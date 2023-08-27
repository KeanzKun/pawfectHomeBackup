import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, BackHandler, Text, TextInput, Button, FlatList, Image, Modal, Animated, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import TextStroke from '../components/TextStroke';
import SearchModal from '../components/SearchModal';
import { SERVER_ADDRESS } from '../config';
import LinearLoadingIndicator from '../components/LinearLoadingIndicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import { debounce } from 'lodash';
import { fetchUserDetails, getStoredUserID } from '../components/UserService';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function getAgeFromDate(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  return `${years}y ${months}m`;
}

const HomeScreen = () => {

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);  // Initializing state to hold pet data
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [showMessageModalVisible, setShowMessageModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  
  const ITEMS_PER_PAGE = 10;
  let timeoutId = null;

  const handleSearch = (searchFilters) => {
    console.log('b4 set', filters)
    setFilters(searchFilters);
    console.log('after set', filters)
    setSelectedType(null); // Reset the selected type
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if the user has scrolled to within 100 pixels of the bottom
    if (offsetY + screenHeight + 100 >= contentHeight) {
      if (!isNearBottom) {
        setIsNearBottom(true);
      }
    } else {
      if (isNearBottom) {
        setIsNearBottom(false);
      }
    }
  };


  const handleTypePress = (type) => {
    if (selectedType === type) {
      setSelectedType(null); // If the type is already selected, deselect it
      setFilters({ ...filters, petType: null });
    } else {
      setSelectedType(type); // Select the new type
      setFilters({ ...filters, petType: type });
    }
  };
  const dataWithPhotos = data.filter(item => item.pet.pet_photo);

  //get user location
  const getUserLocation = async () => {
    try {
      console.log('RAN THIS');

      const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          error => {
            console.error(error);
            setShowMessageModalVisible(true);  // Show the modal if there's an error fetching the location
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setShowMessageModalVisible(true);  // Show the modal if the user denies permission
      }
    } catch (error) {
      console.error("Location permission error:", error);
      setShowMessageModalVisible(true);  // Show the modal for any other errors
    }
  };


  //call userLocation hook when loaded
  useEffect(() => {
    const init = async () => {
      await getUserLocation();
      fetchData(1);
    };
    init();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [filters, userLocation]);

  const fetchData = async (page = 1, loadMore = false) => {
    let url;
    console.log("fetchData called");

    // If not loading more (i.e., refreshing or initial load), reset states
    if (!loadMore) {
      setCurrentPage(1);
      setAllItemsLoaded(false);
    }

    if (Object.values(filters).some(value => value !== null)) {
      url = `${SERVER_ADDRESS}/api/search_listings?`;
      const params = [];
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.push(`${key}=${filters[key]}`);
        }
      });
      url += params.join('&');
    } else {
      console.log('ELSE API LISING');
      url = `${SERVER_ADDRESS}/api/listings`; // use the original endpoint if no filters
    }

    // Append user's latitude and longitude to the URL
    if (userLocation) {
      if (url.includes('?')) {
        url += `&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`;
      } else {
        url += `?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`;
      }
    }

    // Append the page number to the URL
    if (url.includes('?')) {
      url += `&page=${page}`;
    } else {
      url += `?page=${page}`;
    }

    try {
      const response = await fetch(url);
      const json = await response.json();

      // Check if the fetched data is less than the expected ITEMS_PER_PAGE
      if (json.length < ITEMS_PER_PAGE) {
        setAllItemsLoaded(true);
      } else {
        setAllItemsLoaded(false);  // Reset this in case filters change or user refreshes
      }

      const updatedData = await Promise.all(json.map(async item => {
        if (item.listing.locationID) {
          try {
            const locationResponse = await fetch(`${SERVER_ADDRESS}/api/listing-location/${item.listing.locationID}`);
            const locationData = await locationResponse.json();
            item.listing.locationDetails = locationData;
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        }
        return item;
      }));

      if (loadMore) {
        setData(prevData => [...prevData, ...updatedData]);
      } else {
        setData(updatedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);  // Set loading to false after data is fetched
      setIsLoadMore(false);  // Reset the isLoadMore flag
    }


  }


  const handleLoadMore = () => {
    if (!loadingMore && !allItemsLoaded && data.length % ITEMS_PER_PAGE === 0) {
      setLoadingMore(true);
      fetchData(currentPage + 1, true).then(() => {
        setCurrentPage(prevPage => prevPage + 1);
        setLoadingMore(false);
      });
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };


  const renderItem = ({ item }) => {
    if (!item.pet.pet_photo) return null;  // Guard clause

    const firstPhoto = item.pet.pet_photo.split(';')[0];
    const imageUrl = `${SERVER_ADDRESS}/api/pets/pet_image/${firstPhoto}`;
    const petAge = getAgeFromDate(item.pet.pet_age);
    const gender = 'gender-' + item.pet.pet_gender;
    const locationCity = item.listing.locationDetails ? item.listing.locationDetails.city : "Unknown Location";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("PetDetails", {
          listingID: item.listing.listingID,
          petAge: petAge,
          locationDetails: item.listing.locationDetails  // Pass the location details
        })}

      >
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        <View style={styles.itemTextContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TextStroke stroke="#533e41" strokeWidth={0.3} style={[styles.itemText, { fontSize: 19, fontWeight: '800' }]}>{item.pet.pet_name}</TextStroke >
            <MaterialCommunityIcons name={gender} color={Color.sandybrown} size={25} />
          </View>

          <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{item.pet.pet_breed}</TextStroke>
          <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{petAge}</TextStroke>
          <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{locationCity}</TextStroke>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isLoading) {
    return (
      <View style={styles.container}>

        <SearchModal modalVisible={modalVisible} setModalVisible={setModalVisible} onSearch={handleSearch} />

        <Modal
          animationType="fade"
          transparent={true}
          visible={showMessageModalVisible}
        >
          <View style={styles.messageModalContainer}>
            <View style={styles.messageModalView}>
              <Text style={styles.messageModalText}>Hey There!</Text>
              <Text style={{ textAlign: 'center', marginTop: '5%' }}>Please turn on your location for the best experience! Dont worry, our dog staff wont steal your data!</Text>

              <TouchableOpacity
                onPress={() => setShowMessageModalVisible(false)}
                style={styles.messageModalButton}
              >
                <Text style={styles.messageModalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.titleText}>Pawfect Home.</Text>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categories}>Categories</Text>
        </View>

        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={[styles.button, selectedType === "Cat" && styles.selectedButton]}
            onPress={() => handleTypePress("Cat")}
          >
            <Image source={require("../assets/icon/catIcon.png")} style={styles.filterIcon} />
            <Text>Cat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedType === "Dog" && styles.selectedButton]}
            onPress={() => handleTypePress("Dog")}
          >
            <Image source={require("../assets/icon/dogIcon.png")} style={styles.filterIcon} />
            <Text>Dog</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedType === "Bird" && styles.selectedButton]}
            onPress={() => handleTypePress("Bird")}
          >
            <Image source={require("../assets/icon/birdIcon.png")} style={styles.filterIcon} />
            <Text>Bird</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedType === "Hamster" && styles.selectedButton]}
            onPress={() => handleTypePress("Hamster")}
          >
            <Image source={require("../assets/icon/hamsterIcon.png")} style={styles.filterIcon} />
            <Text>Hamster</Text>
          </TouchableOpacity>

        </View>

        <FlatList
          onScroll={handleScroll}
          data={dataWithPhotos}
          renderItem={renderItem}
          keyExtractor={item => item.pet.petID.toString()}
          numColumns={2}
          onRefresh={() => fetchData()}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}  // Load more when the user is halfway through the last set of items
          ListFooterComponent={renderFooter}  // Render a loading indicator at the bottom
        />

      </View>
    );
  }
  else {
    return (
      <View style={{ width: '100%', height: '100%', marginTop: '50%', alignItems: 'center' }}>
        <Image source={require('../assets/icon/cat-typing.gif')} style={{ width: '28%', height: '8%', marginBottom: '3%' }} />
        <Text style={{ color: Color.sandybrown, fontSize: 20 }}>Please wait while our furry staff</Text>
        <Text style={{ color: Color.sandybrown, fontSize: 20, marginBottom: '5%' }}>working on it...</Text>
        <View style={{ width: '50%', overflow: 'hidden' }}>
          <LinearLoadingIndicator></LinearLoadingIndicator>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  loadingScreen: {
    color: Color.sandybrown,
    fontSize: windowHeight * 0.05,
    fontFamily: FontFamily.latoExtrabold,
    fontWeight: "900",
    textAlign: "center",
  },
  loadingScreenContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
  },
  messageModalText: {
    fontSize: windowHeight * 0.03,
    letterSpacing: 0.4,
    color: Color.dimgray,
    fontWeight: '900',
    textAlign: 'center',
  },
  messageModalButtonText: {
    fontSize: windowHeight * 0.03,
    letterSpacing: 0.3,
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
  },
  messageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  messageModalView: {
    width: '75%',
    height: '25%',
    backgroundColor: 'white',
    padding: 20,
    textAlign: 'center',
    borderRadius: 30
  },
  messageModalButton: {
    borderRadius: 87,
    backgroundColor: Color.sandybrown,
    width: '40%',
    height: '30%',
    marginTop: '5%',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  dropdownContainer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: 'white',
  },
  categories: {
    alignSelf: 'flex-start',
    fontSize: 25,
    letterSpacing: 0.7,
    color: Color.dimgray,
    fontWeight: '900',
  },
  categoriesContainer: {
    marginVertical: windowHeight * 0.01,
    width: windowWidth * 0.9,
  },
  button: {
    backgroundColor: 'white',
    width: windowWidth * 0.21,
    height: windowHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
  },
  selectedButton: {
    backgroundColor: Color.sandybrown,
  },
  searchButton: {
    backgroundColor: 'white',
    width: '100%',
    height: windowHeight * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.9, // was 0.8
    marginBottom: windowHeight * 0.03,
  },
  searchInput: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 40,
    width: '100%',
    height: windowHeight * 0.06,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  item: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.42,
    marginBottom: windowWidth * 0.045,
    marginLeft: windowWidth * 0.03,
    marginRight: windowWidth * 0.03,
    borderRadius: 30,
    overflow: 'hidden',
  },
  itemImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  filterIcon: {
    width: '55%',
    height: '55%'
  },
  searchContainer: {
    width: windowWidth * 0.9,
    alignItems: 'center',
  },

  titleText: {
    marginVertical: windowHeight * 0.024,
    fontSize: 33,
    letterSpacing: 0.4,
    color: Color.sandybrown,
    fontWeight: '900',
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginLeft: windowWidth * 0.05,
    marginBottom: windowHeight * 0.02
  },
  itemText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },

  searchText: {
    alignSelf: 'flex-start',
    fontWeight: '400',
    fontSize: 13,
  },
});

export default HomeScreen;