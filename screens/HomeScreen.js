import React, { useCallback, useEffect, useState } from 'react';
import { View, BackHandler, Text, TextInput, Button, FlatList, Image, Modal, Animated, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import TextStroke from '../components/TextStroke';
import SearchModal from '../components/SearchModal';
import { SERVER_ADDRESS } from '../config';
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

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  const fetchData = useCallback(async () => {
    let url;
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
      url = `${SERVER_ADDRESS}/api/listings`; // use the original endpoint if no filters
    }
    try {
      console.log(url);
      const response = await fetch(url);
      console.log('ccc');
      const json = await response.json();
      console.log('aaa');
      setData(json);
      console.log('aaa');
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [filters]);
  

  useEffect(() => {
    // Handle the back button press event
    const handleBackPress = () => {
      BackHandler.exitApp(); // Exit the app
      return true; // Prevent default behavior
    };

    // Add the event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Return a cleanup function to remove the event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }) => {
    const imageUrl = `${SERVER_ADDRESS}/api/pets/pet_image/${item.pet.pet_photo}`; // Fetch pet details from pet object
    const petAge = getAgeFromDate(item.pet.pet_age);  // Fetch pet details from pet object


    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("PetDetails", { listingID: item.listing.listingID, petAge: petAge })}  // Pass the listing ID
      >
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        <View style={styles.itemTextContainer}>
          <TextStroke stroke="#533e41" strokeWidth={0.3} style={[styles.itemText, { fontSize: 19, fontWeight: '800' }]}>{item.pet.pet_name}</TextStroke >
          <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{item.pet.pet_breed}</TextStroke>
          <TextStroke stroke="#533e41" strokeWidth={0.1} style={styles.itemText}>{petAge} {item.pet.pet_gender}</TextStroke>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <SearchModal modalVisible={modalVisible} setModalVisible={setModalVisible} onSearch={handleSearch} />

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
        <TouchableOpacity style={styles.button} onPress={() => { }}>
          <Image source={require("../assets/icon/catIcon.png")} style={styles.filterIcon} />
          <Text>Cat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { }}>
          <Image source={require("../assets/icon/dogIcon.png")} style={styles.filterIcon} />
          <Text>Dog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { }}>
          <Image source={require("../assets/icon/birdIcon.png")} style={styles.filterIcon} />
          <Text>Bird</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { }}>
          <Image source={require("../assets/icon/hamsterIcon.png")} style={styles.filterIcon} />
          <Text>Hamster</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.pet.petID.toString()}
        numColumns={2}
        onRefresh={fetchData}  // Add this line
        refreshing={refreshing}  // And this line
      />
    </View>
  );
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