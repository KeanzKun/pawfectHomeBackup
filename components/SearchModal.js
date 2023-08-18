import React, { useState } from 'react';
import { Animated, Text, TouchableWithoutFeedback, View, Pressable, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { Color, FontFamily } from "../GlobalStyles";
import GestureRecognizer from 'react-native-swipe-gestures';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const SearchModal = ({ modalVisible, setModalVisible, onSearch }) => {
  // Declare state variables for each picker's selected value
  const [petType, setPetType] = useState(null);
  const [status, setStatus] = useState(null);
  const [age, setAge] = useState(null);
  const [location, setLocation] = useState(null);

  const clearFilters = () => {
    setPetType(null);
    setStatus(null);
    setAge(null);
    setLocation(null);
  };

  const handleSearch = () => {
    onSearch({ petType, status, age, location }); // pass the selected values to the parent component
    setModalVisible(false);
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View
                style={styles.modalView}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.modalTitle}>Search</Text>
                  <TouchableOpacity
                    style={[styles.filterButton]} // you might want to define a specific style for this button
                    onPress={clearFilters}>
                    <Text style={styles.filterButtonText}>Clear Filters</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Pet Type</Text>
                  <Picker
                    selectedValue={petType}
                    onValueChange={(itemValue) => setPetType(itemValue)}>
                    <Picker.Item label="Select a pet type..." value={null} />
                    <Picker.Item label="Cat" value="Cat" />
                    <Picker.Item label="Dog" value="Dog" />
                    <Picker.Item label="Bird" value="Bird" />
                    <Picker.Item label="Hamster" value="Hamster" />
                    <Picker.Item label="Reptile" value="Reptile" />
                    <Picker.Item label="Furry" value="Furry" />

                  </Picker>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Status</Text>
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}>
                    <Picker.Item label="Select a status..." value={null} />
                    <Picker.Item label="Re-Home" value="reHome" />
                    <Picker.Item label="Adopt" value="adopt" />

                  </Picker>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Age</Text>
                  <Picker
                    selectedValue={age}
                    onValueChange={(itemValue) => setAge(itemValue)}>
                    <Picker.Item label="Select age range..." value={null} />
                    <Picker.Item label="Less than 1 year" value="1" />
                    <Picker.Item label="1 - 3 years old" value="3" />
                    <Picker.Item label="4 - 6 years old" value="6" />
                    <Picker.Item label="7 - 10 years old" value="10" />
                    <Picker.Item label="at least 10 years old" value=">10" />
                  </Picker>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Location</Text>
                  <Picker
                    selectedValue={location}
                    onValueChange={(itemValue) => setLocation(itemValue)}>
                    <Picker.Item label="Select a location..." value={null} />
                    <Picker.Item label="City A" value="City A" />
                    <Picker.Item label="City B" value="City B" />
                    <Picker.Item label="City C" value="City C" />
                    <Picker.Item label="City D" value="City D" />
                    <Picker.Item label="City E" value="City E" />
                    <Picker.Item label="City F" value="City F" />
                    <Picker.Item label="City Q" value="City Q" />
                  </Picker>
                </View>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={handleSearch}>
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GestureRecognizer>
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
    justifyContent: "flex-end",
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: "center",
  },
  pickerTitleText: {
    color: Color.dimgray,
    fontWeight: '500'
  },
  modalView: {
    backgroundColor: "white",
    width: '100%',
    height: '70%',
    Top: '10%',
    borderTopLeftRadius: windowHeight * 0.05,
    borderTopRightRadius: windowHeight * 0.05,
    padding: windowWidth * 0.07,
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
    marginBottom: '6%',
    color: Color.dimgray,
    fontWeight: '800',
    textAlign: "center",
    marginLeft: '52%',
    fontSize: windowHeight * 0.03,
  },
  buttonText: {
    fontSize: windowWidth * 0.06,
    letterSpacing: 0.3,
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
  },
  filterButtonText: {
    fontSize: windowWidth * 0.03,
    color: Color.sandybrown,
    textAlign: "center",
    marginBottom: '15%',
  },
  dropdownContainer: {
    marginBottom: '3%',
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
    backgroundColor: Color.sandybrown,
    width: '50%',
    height: windowHeight * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.04,
    marginTop: '5%',
    borderRadius: windowWidth * 0.1,
  },
  filterButton: {
    width: '50%',
    height: windowHeight * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
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

  searchText: {
    alignSelf: 'flex-start',
    fontWeight: '400',
    fontSize: 13,
  },
});

export default SearchModal;