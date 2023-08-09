import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { SERVER_ADDRESS } from '../config'; 

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const VetScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Initializing state to hold vet data

  useEffect(() => {

    let url = `${SERVER_ADDRESS}/api/vets`;
    console.log(url);
    // Fetching vet data from the API
    fetch(url)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
      }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}
      onPress={() => navigation.navigate("VetDetails" , {vetID: item.vetID})}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{item.vet_name}</Text> 
        <Text style={styles.itemSubText}>{item.vet_hours}</Text> 
        <Text style={styles.itemSubText}>{item.vet_address}</Text> 
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Pawfect Home.</Text>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>
      <FlatList
        data={data} // Updated to use state data
        renderItem={renderItem}
        keyExtractor={item => item.vetID.toString()} // Updated to match the API response
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
    height: windowHeight * 0.21,
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
    fontSize: 28,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  itemSubText: {
    color: Color.dimgray,
    fontSize: 14,
    color: Color.silver,
    letterSpacing: 0.4,
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

});

export default VetScreen;