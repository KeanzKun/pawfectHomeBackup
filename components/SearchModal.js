import React from 'react';
import { Text, View, Pressable, StyleSheet, Modal,Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

class SearchModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false,
      };
    }
  
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    };
  
    render() {
      return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
            this.setModalVisible(false);
          }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Search</Text>
            <View style={styles.dropdownContainer}>
              <Text>Pet Type:</Text>
              <RNPickerSelect
                placeholder={{ label: "Select a pet type..." }}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: 'Cat', value: 'cat' },
                  { label: 'Dog', value: 'dog' },
                  // Add more items here
                ]}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text>Status:</Text>
              <RNPickerSelect
                placeholder={{ label: "Select a status..." }}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: 'Available', value: 'available' },
                  { label: 'Adopted', value: 'adopted' },
                  // Add more items here
                ]}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text>Age:</Text>
              <RNPickerSelect
                placeholder={{ label: "Select an age..." }}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: 'Puppy/Kitten', value: 'young' },
                  { label: 'Adult', value: 'adult' },
                  // Add more items here
                ]}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text>Location:</Text>
              <RNPickerSelect
                placeholder={{ label: "Select a location..." }}
                onValueChange={(value) => console.log(value)}
                items={[
                  { label: 'New York', value: 'new_york' },
                  { label: 'Los Angeles', value: 'los_angeles' },
                  // Add more items here
                ]}
              />
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.props.setModalVisible(!this.props.modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      );
    }
  }


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