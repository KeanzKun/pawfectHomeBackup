import React, { useState, useEffect } from "react";
import { TextInput, Text, StyleSheet, TouchableOpacity, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';

const windowHeight = Dimensions.get("window").height;

const CreateListing = () => {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [hasDateBeenPicked, setHasDateBeenPicked] = useState(false);
    const [adoptionFeeError, setAdoptionFeeError] = useState(null);
    const [breedError, setBreedError] = useState(null);
    const [petNameError, setPetNameError] = useState(null);
    const [location, setLocation] = useState(null);

    const [animalType, setAnimalType] = useState(null);
    const [date, setDate] = useState(new Date());
    const [breed, setBreed] = useState('');
    const [adoptionFee, setAdoptionFee] = useState('');
    const [listingType, setListingType] = useState('');
    const [petName, setPetName] = useState('');
    const [petGender, setPetGender] = useState('');
    const [description, setDescription] = useState('');
    const [isLostFee, setIsLostFee] = useState(false);
    function dateFormatter(dateObj) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
        const dd = String(dateObj.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }


    const validateInputs = () => {
        if (!description || !animalType || !breed || !hasDateBeenPicked || !petName || adoptionFee === '' || !listingType) {
            alert('Please fill in all fields.');
            return false;
        }
        if (listingType === 'adopt' || listingType === 'reHome') {
            if (parseInt(adoptionFee) < 50 || parseInt(adoptionFee) > 400) {
                alert('Adoption Fee needs to be between 50 and 400.');
                return false;
            }
        }

        // For 'missing' listing type, you can add additional validations if needed
        if (listingType === 'missing') {
            if (adoptionFee === '') {
                setAdoptionFee('0');
            } else if (parseInt(adoptionFee) > 9999) {
                alert('Reward Fee cannot exceed 9999.');
                return false;
            }
        }

        if (breed.length > 30 || petName.length > 30) {
            alert('Pet name and animal breed should not be more than 30 characters.');
            return false;
        }

        return true;
    }


    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        setDate(selectedDate || date);
        setHasDateBeenPicked(true);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: "#f5f5f5" }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Navigate back to the previous screen
            >
                <Text style={styles.backButtonText}>&lt;</Text>
            </TouchableOpacity>

            <View style={[styles.container]}>



                <View style={styles.login}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeBackText}>Create Listing.</Text>
                        <Text style={styles.loginToContinueText}>Your pet deserves a second home</Text>
                    </View>

                    <View style={styles.usernameFieldContainer}>
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.emailLabel}>Animal type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={animalType}
                                    itemStyle={styles.pickerItem}
                                    onValueChange={(itemValue) => setAnimalType(itemValue)}
                                >
                                    <Picker.Item label="Select animal type..." value={null} />
                                    <Picker.Item label="Cat" value="Cat" />
                                    <Picker.Item label="Dog" value="Dog" />
                                    <Picker.Item label="Bird" value="Bird" />
                                    <Picker.Item label="Hamster" value="Hamster" />
                                    <Picker.Item label="Reptile" value="Reptile" />
                                    <Picker.Item label="Furry" value="Furry" />
                                </Picker>
                            </View>
                        </View>


                        <Text style={styles.emailLabel}>Animal's breed</Text>
                        <Input
                            value={breed}
                            placeholder="ex: house cat... huskey..."
                            onChangeText={(value) => {
                                setBreed(value);
                                if (value.length > 30) {
                                    setBreedError('Breed should not exceed 30 characters.');
                                } else {
                                    setBreedError(null);
                                }
                            }}
                            required={true}
                            inputStyle={styles.usernameInput}
                        />
                        {breedError && <Text style={styles.warningText}>{breedError}</Text>}

                        <Text style={styles.emailLabel}>Pet's born date</Text>
                        <TouchableOpacity
                            style={styles.selectDateButton}
                            onPress={showDatePicker}
                        >
                            <Text style={{ marginLeft: '5%', color: 'black' }}>
                                {hasDateBeenPicked ? dateFormatter(date) : "Select Pet's Birth Date..."}
                            </Text>
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}
                                maximumDate={new Date()} // Today's date
                            />
                        )}

                        <Text style={styles.emailLabel}>Pet's name</Text>
                        <Input
                            value={petName}
                            onChangeText={(value) => {
                                setPetName(value);
                                if (value.length > 30) {
                                    setPetNameError('Pet name should not exceed 30 characters.');
                                } else {
                                    setPetNameError(null);
                                }
                            }}
                            required={true}
                            inputStyle={styles.usernameInput}
                        />
                        {petNameError && <Text style={styles.warningText}>{petNameError}</Text>}

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.emailLabel}>Pet's gender</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={petGender}
                                    itemStyle={styles.pickerItem}
                                    onValueChange={(itemValue) => setPetGender(itemValue)}
                                >
                                    <Picker.Item label="Select pet's gender..." value={null} />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.emailLabel}>Listing type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={listingType}
                                    itemStyle={styles.pickerItem}
                                    onValueChange={(itemValue) => {
                                        setListingType(itemValue)
                                        if (itemValue === 'missing') {
                                            setAdoptionFee('0')
                                            setIsLostFee(true)
                                        }
                                        else
                                            setIsLostFee(false)
                                    }}
                                >
                                    <Picker.Item label="Select listing type..." value={null} />
                                    <Picker.Item label="Adopt" value="adopt" />
                                    <Picker.Item label="Re-Home" value="reHome" />
                                    <Picker.Item label="Lost" value="missing" />
                                </Picker>
                            </View>
                        </View>

                        {(listingType === 'adopt' || listingType === 'reHome') && <View>
                            <Text style={styles.emailLabel}>Adoption Fee</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '16%', marginRight: '-5.7%' }}>
                                    <Input
                                        value={'RM'}
                                        inputStyle={styles.usernameInput}
                                        editable={false}
                                    />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Input
                                        required={true}
                                        value={adoptionFee}
                                        keyboardType="numeric"
                                        onChangeText={text => {
                                            const fee = text.replace(/[^0-9]/g, '');
                                            setAdoptionFee(fee);

                                            if (parseInt(fee) < 50 || parseInt(fee) > 400) {
                                                setAdoptionFeeError('Adoption Fee needs to be between 50 and 400.');
                                            } else {
                                                setAdoptionFeeError(null);
                                            }
                                        }}
                                        inputStyle={styles.usernameInput}
                                    />

                                </View>
                            </View>
                        </View>
                        }


                        {(listingType === 'missing') && <View>
                            <Text style={styles.emailLabel}>Reward Fee</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '16%', marginRight: '-5.7%' }}>
                                    <Input
                                        value={'RM'}
                                        inputStyle={styles.usernameInput}
                                        editable={false}
                                    />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Input
                                        required={true}
                                        value={adoptionFee}
                                        keyboardType="numeric"
                                        placeholder="For the one found your pet.."
                                        onChangeText={text => {
                                            const fee = text.replace(/[^0-9]/g, '');
                                            setAdoptionFee(fee);

                                            if (parseInt(fee) < 0) {
                                                setAdoptionFeeError('Reward Fee cannot be negative.');
                                            } else if (parseInt(fee) > 9999) {
                                                setAdoptionFeeError('Reward Fee cannot more than 9999')
                                            }
                                            else {
                                                setAdoptionFeeError(null);
                                            }
                                        }}
                                        inputStyle={styles.usernameInput}
                                    />

                                </View>
                            </View>
                        </View>}
                        {adoptionFeeError && <Text style={styles.warningText}>{adoptionFeeError}</Text>}
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.emailLabel}>Description</Text>
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

                        <TouchableHighlight
                            style={styles.loginButton}
                            onPress={() => {
                                if (validateInputs()) {
                                    navigation.navigate("CreateListingLocation", {
                                        animalType: animalType,
                                        breed: breed,
                                        date: date,
                                        petName: petName,
                                        adoptionFee: adoptionFee,
                                        listingType: listingType,
                                        petGender: petGender,
                                        description: description
                                    })
                                }
                            }}
                            underlayColor={Color.sandybrown}
                        >
                            <Text style={styles.loginButtonText}>Next</Text>
                        </TouchableHighlight>

                    </View>


                </View>
                <View style={styles.redirectSignUp}>

                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        paddingTop: windowHeight * 0.03,
        height: '100%'
    },
    backButton: {
        position: 'absolute',
        top: 10, // adjust this value as per your needs
        left: 10, // adjust this value as per your needs
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
        zIndex: 1, // make sure the button is above other elements
    },
    warningText: {
        color: Color.sandybrown,
        marginTop: windowHeight * -0.03,
        marginLeft: windowHeight * 0.015,
        marginBottom: windowHeight * 0.0055
    },
    descriptionInput: {
        borderWidth: 1,
        marginTop: '1%',
        width: '95%',
        borderColor: 'gray',
        borderRadius: 10,
        minHeight: 100, // Define the height that you want
        padding: windowHeight * 0.02
    },
    backButtonText: {
        paddingTop: windowHeight * 0.004,
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    selectDateButton: {
        justifyContent: 'center',
        height: '5%',
        borderRadius: 5,
        width: '95%',
        borderColor: 'gray',
        borderWidth: 1,
        alignSelf: 'center',
        marginBottom: '5%',
    },
    dropdownContainer: {
        marginBottom: '5%',
        alignContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '95%'
    },
    pickerItem: {
        fontSize: 16,
    },
    login: {
        width: "90%",
        alignItems: "flex-start",
    },
    welcomeContainer: {
        marginLeft: windowHeight * 0.01,
        marginTop: '7%',
    },
    welcomeBackText: {
        fontSize: 36,
        letterSpacing: 0.9,
        marginBottom: windowHeight * 0.004,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: "left",
    },
    loginToContinueText: {
        fontSize: 18,
        letterSpacing: 0.2,
        marginBottom: 30,
        fontWeight: '700',
        textAlign: "left",
    },
    usernameFieldContainer: {
        width: "100%",
    },
    emailLabel: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.dimgray,
        fontWeight: "600",
        alignSelf: 'flex-start',
        marginBottom: '2%'
    },
    usernameInput: {
        marginTop: -(windowHeight * 0.009), // Adjust the margin bottom as desired
        paddingBottom: -(windowHeight * 0.018),
    },
    loginButton: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        width: "70%",
        height: windowHeight * 0.08,
        paddingHorizontal: windowHeight * 0.04,
        paddingVertical: windowHeight * 0.01,
        marginBottom: windowHeight * 0.1,
        marginTop: windowHeight * 0.03,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: windowHeight * 0.035,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    redirectSignUp: {
        backgroundColor: "#f5f5f5",
    },
    signUpText: {
        fontSize: windowHeight * 0.018,
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: 0.1,
        color: Color.sandybrown,
        fontFamily: FontFamily.interSemibold,
        fontWeight: "600",
        marginTop: 5,
    },
});

export default CreateListing;
