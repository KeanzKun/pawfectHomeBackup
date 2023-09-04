import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { SERVER_ADDRESS } from '../config';
import SearchVetModal from '../components/SearchVetModal';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const VetScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [userLocation, setUserLocation] = useState(null);
  const [isSearchModalUsed, setIsSearchModalUsed] = useState(false);
  const [itemHeight, setItemHeight] = useState(windowHeight * 0.19);

  useEffect(() => {
    fetchVets();
  }, [userLocation]);  // Add userLocation as a dependency

  const getUserLocation = async () => {
    try {
      const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });  // This will trigger the above useEffect
          },
          error => {
            console.error(error);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      console.error("Location permission error:", error);
    }
  };

  const handleLayout = (event) => {
    const height = event.nativeEvent.layout.height;
    if (height > windowHeight * 0.21) {
      setItemHeight(height);
    }
  };
  
  useEffect(() => {
    getUserLocation();
  }, []);


  const fetchVets = (state = null) => {
    let url = `${SERVER_ADDRESS}/api/vets`;
    const params = [];
    if (state) {
      params.push(`vet_state=${state}`);
    }
    if (userLocation) {
      params.push(`latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
    }
    if (params.length) {
      url += `?${params.join('&')}`;
    }

    console.log(url)

    fetch(url)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  };


  const handleSearch = (filters) => {
    if (filters.vetState) {
      setIsSearchModalUsed(true);  // Set this to true when a filter is applied
      fetchVets(filters.vetState);
    } else {
      setIsSearchModalUsed(false);  // Set this to false when no filter is applied
      fetchVets();
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}
      onPress={() => navigation.navigate("VetDetails", { vetID: item.vetID })}>
      <View style={[styles.itemTextContainer, { height: itemHeight, marginBottom: '9%' }]} onLayout={handleLayout}>
        <Text style={styles.itemText}>{item.vet_name}</Text>
        <View style={{ flexDirection: 'row', marginBottom: '2%' }}>
          <MaterialCommunityIcons name="store-clock-outline" color={Color.sandybrown} size={20} />
          <Text style={styles.itemSubText}>{item.vet_hours}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons name="map-marker-outline" color={Color.sandybrown} size={20} />
          <Text style={styles.itemSubText}>{item.vet_address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Pawfect Home.</Text>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={[
            styles.searchButton,
            isSearchModalUsed && { backgroundColor: Color.sandybrown }
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>


      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.vetID.toString()}
      />
      <SearchVetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSearch={handleSearch}
        onClose={() => setIsSearchModalUsed(false)}  // Add this line
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
  button: {
    backgroundColor: 'white',
    height: windowHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: 20,
    borderRadius: 15,
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
    flex:1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    width: windowWidth * 0.9, // Adjust the width to take up most of the row
    marginBottom: windowWidth * 0.045,
    marginLeft: windowWidth * 0.03,
    marginRight: windowWidth * 0.03,
    borderRadius: 30,
    overflow: 'hidden',
  },

  itemText: {
    color: Color.dimgray,
    marginBottom: windowHeight * 0.009,
    fontSize: 22,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  itemSubText: {
    color: Color.dimgray,
    fontSize: 14,
    letterSpacing: 0.4,
    marginLeft: '2%'
  },
  searchContainer: {
    width: windowWidth * 0.9,
    marginBottom: windowHeight * 0.03,
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
    paddingLeft: windowHeight * 0.035,
    paddingTop: windowHeight * 0.024,
    paddingRight: '10%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  searchText: {
    alignSelf: 'flex-start',
    fontWeight: '400',
    fontSize: 13,
  },
});

export default VetScreen;