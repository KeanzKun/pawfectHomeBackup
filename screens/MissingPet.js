import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, Modal, Animated, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import TextStroke from '../components/TextStroke';
import { SERVER_ADDRESS } from '../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';

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

const MissingPetScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);  // Initializing state to hold pet data
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = async () => {
    try {
      const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
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

  useEffect(() => {
    getUserLocation();
  }, []);


  const fetchData = useCallback(async () => {
    setRefreshing(true);
    let url = `${SERVER_ADDRESS}/api/listings/missing`;

    // Append user's latitude and longitude to the URL
    if (userLocation) {
      url += `?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`;
    }

    try {
      const response = await fetch(url);
      const json = await response.json();

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

      setData(updatedData);

    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [userLocation]);


  const dataWithPhotos = data.filter(item => item.pet.pet_photo);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }) => {
    const locationCity = item.listing.locationDetails ? item.listing.locationDetails.city : "Unknown Location";
    if (!item.pet.pet_photo) return null;  // Guard clause

    const firstPhoto = item.pet.pet_photo.split(';')[0];
    const imageUrl = `${SERVER_ADDRESS}/api/pets/pet_image/${firstPhoto}`;
    const petAge = getAgeFromDate(item.pet.pet_age);
    const gender = 'gender-' + item.pet.pet_gender;

    return (
      <TouchableOpacity style={styles.item}
        onPress={() => navigation.navigate("MissingPetDetails", { listingID: item.listing.listingID, petAge: petAge, locationDetails: item.listing.locationDetails })}>
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

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Pawfect Home.</Text>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categories}>Helps the pet go home</Text>
      </View>

      <FlatList
        data={dataWithPhotos}
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
    height: windowHeight * 0.25,
    width: windowWidth * 0.42,
    marginBottom: windowWidth * 0.045,
    marginLeft: windowWidth * 0.03,
    marginRight: windowWidth * 0.03,
    borderRadius: 30,
    overflow: 'hidden', // Add this line
  },
  itemImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
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
});

export default MissingPetScreen;