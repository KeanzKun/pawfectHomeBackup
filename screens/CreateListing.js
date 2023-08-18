import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
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
    const [animalType, setAnimalType] = useState(null);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [hasDateBeenPicked, setHasDateBeenPicked] = useState(false);
    const [adoptionFee, setAdoptionFee] = useState('');
    const [listingType, setListingType] = useState('');
    const [location, setLocation] = useState(null);

    function dateFormatter(dateObj) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
        const dd = String(dateObj.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
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
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

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
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Adoption Fee</Text>
                        <View style={{ flexDirection: 'row', }}>
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
                                    onChangeText={text => setAdoptionFee(text.replace(/[^0-9]/g, ''))} // Allow only numbers
                                    inputStyle={styles.usernameInput}
                                />
                            </View>
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.emailLabel}>Listing type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={listingType}
                                    itemStyle={styles.pickerItem}
                                    onValueChange={(itemValue) => setListingType(itemValue)}
                                >
                                    <Picker.Item label="Select listing type..." value={null} />
                                    <Picker.Item label="Adopt" value="adopt" />
                                    <Picker.Item label="Re-Home" value="re-home" />
                                    <Picker.Item label="Missing" value="missing" />
                                </Picker>
                            </View>
                        </View>
                        <TouchableHighlight
                            style={styles.loginButton}
                            onPress={() => navigation.navigate("CreateListingLocation")}
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
    selectDateButton: {
        justifyContent: 'center',
        height: '7.5%',
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
