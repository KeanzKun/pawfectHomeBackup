import React, { useState } from 'react';
import { TextInput, Animated, Text, TouchableWithoutFeedback, View, Pressable, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { Color, FontFamily } from "../GlobalStyles";
import GestureRecognizer from 'react-native-swipe-gestures';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ReportListingModal = ({ modalVisible, setModalVisible, onSubmit }) => {
  // Declare state variables for each picker's selected value
  const [reportReason, setReportReason] = useState(null);
  const [description, setDescription] = useState("");

  const clearFilters = () => {
    setReportReason(null)
    setDescription('')
  };

  const handleSubmit = () => {
    if (reportReason && description) { // Check if both fields are not empty
      onSubmit({ reportReason, description }); // pass the selected values to the parent component
      setModalVisible(false);
    } else {
      alert("Please fill in both fields before submitting."); // Alert user if any field is empty
    }
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
                  <Text style={styles.modalTitle}>Report Listing</Text>
                  <TouchableOpacity
                    style={[styles.filterButton]} // you might want to define a specific style for this button
                    onPress={clearFilters}>
                    <Text style={styles.filterButtonText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Report reason</Text>
                  <Picker
                    selectedValue={reportReason}
                    onValueChange={(itemValue) => setReportReason(itemValue)}>
                    <Picker.Item label="Select report reason..." value={null} />
                    <Picker.Item label="Spam" value="spam" />
                    <Picker.Item label="I find it suspicious" value="suspicious" />
                    <Picker.Item label="Scam" value="scam" />
                    <Picker.Item label="Fake account" value="fake_account" />
                    <Picker.Item label="Illegal listing" value="illegal" />
                    <Picker.Item label="Other reasons" value="other" />
                  </Picker>
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.pickerTitleText}>Description</Text>
                  <TextInput
                    style={styles.descriptionInput}
                    multiline={true} // Allow multiple lines of text
                    numberOfLines={8} // Initial number of lines
                    placeholder="Enter the description..."
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    textAlignVertical="top" // Add this line
                  />
                </View>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={handleSubmit}> 
                  <Text style={styles.buttonText}>Submit</Text> 
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
  descriptionContainer: {
    marginVertical: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    marginTop: '3%',
    borderColor: '#ccc',
    borderRadius: 20,
    minHeight: 100, // Define the height that you want
    padding: windowHeight * 0.02
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
    marginLeft: '12%',
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
    left: '110%',
    bottom: '18%',
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
    marginTop: '25%',
    borderRadius: windowWidth * 0.1,
  },
  filterButton: {
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

export default ReportListingModal;