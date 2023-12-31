import React, { useState, useRef } from 'react';
import { Animated, Text, View, Pressable, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { Color, FontFamily } from "../GlobalStyles";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const SearchModal = ({ modalVisible, setModalVisible }) => {
  // Declare state variables for each picker's selected value
  const [petType, setPetType] = useState(null);
  const [status, setStatus] = useState(null);
  const [age, setAge] = useState(null);
  const [location, setLocation] = useState(null);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ['48%'];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
             >
              <View style={styles.centeredView}>
                <View
                  style={styles.modalView}>
                  <Text style={styles.modalTitle}>Search</Text>
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.pickerTitleText}>Pet Type</Text>
                    <Picker
                      selectedValue={petType}
                      onValueChange={(itemValue) => setPetType(itemValue)}>
                      <Picker.Item label="Select a pet type..." value={null} />
                      <Picker.Item label="Cat" value="cat" />
                      <Picker.Item label="Dog" value="dog" />

                    </Picker>
                  </View>
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.pickerTitleText}>Status</Text>
                    <Picker
                      selectedValue={status}
                      onValueChange={(itemValue) => setStatus(itemValue)}>
                      <Picker.Item label="Select a status..." value={null} />
                      <Picker.Item label="Available" value="available" />
                      <Picker.Item label="Adopted" value="adopted" />

                    </Picker>
                  </View>
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.pickerTitleText}>Age</Text>
                    <Picker
                      selectedValue={age}
                      onValueChange={(itemValue) => setAge(itemValue)}>
                      <Picker.Item label="Select age range..." value={null} />
                      <Picker.Item label="Puppy/Kitten" value="young" />
                      <Picker.Item label="Adult" value="adult" />

                    </Picker>
                  </View>
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.pickerTitleText}>Location</Text>
                    <Picker
                      selectedValue={location}
                      onValueChange={(itemValue) => setLocation(itemValue)}>
                      <Picker.Item label="Select a location..." value={null} />
                      <Picker.Item label="New York" value="new_york" />
                      <Picker.Item label="Los Angeles" value="los_angeles" />
                    </Picker>
                  </View>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.buttonText}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetModal>
          </View>
      </View>
    </BottomSheetModalProvider>
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
    borderRadius: windowHeight * 0.05,
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
    fontSize: windowHeight * 0.03,
  },
  buttonText: {
    fontSize: windowWidth * 0.06,
    letterSpacing: 0.3,
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
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
    backgroundColor: Color.sandybrown,
    width: '50%',
    height: windowHeight * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: windowWidth * 0.1,
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