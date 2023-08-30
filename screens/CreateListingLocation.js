import React, { useState, useEffect } from "react";
import { Image, Text, StyleSheet, TouchableOpacity, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API } from "../config";
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const DEFAULT_LAT = 3.1466
const DEFAULT_LNG = 101.6958
const DEFAULT_CITY = 'Kuala Lumpur'
const DEFAULT_STATE = 'Wilayah Persekutuan Kuala Lumpur'
const CreateListingLocation = ({ route, navigation }) => {
    const { animalType, breed, petName, adoptionFee, listingType, petGender, description } = route.params;
    const date = new Date(route.params.date);

    const [location, setLocation] = useState({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        city: DEFAULT_CITY,
        state: DEFAULT_STATE
    });


    const requestLocationPermission = async () => {
        try {
            const result = await request(
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            );
            return result === RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const fetchLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                async position => {
                    const { latitude, longitude } = position.coords;
                    const { city, state } = await reverseGeocode(latitude, longitude);
                    setLocation({ latitude, longitude, city, state });
                },
                error => console.log(error),
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            console.log("Location permission denied");
        }
    };

    const reverseGeocode = async (latitude, longitude) => {
        const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API}`;
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const addressComponents = data.results[0].address_components;
                let city = '';
                let state = '';
                addressComponents.forEach(component => {
                    if (component.types.includes("locality")) {
                        city = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        state = component.long_name;
                    }
                });
                return { city, state };
            }
        } catch (error) {
            console.error("Error reverse geocoding:", error);
        }
        return { city: null, state: null };
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchLocation);

        return unsubscribe;  // Unsubscribe on cleanup for optimization
    }, [navigation]);

    return (
        <View style={[styles.container]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Navigate back to the previous screen
            >
                <Text style={styles.backButtonText}>&lt;</Text>
            </TouchableOpacity>

            <View style={styles.login}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeBackText}>Create Listing.</Text>
                    <Text style={styles.loginToContinueText}>Locate your pet :D</Text>
                </View>

                <GooglePlacesAutocomplete
                    styles={{
                        container: styles.autoCompleteContainer,
                        textInput: styles.autoCompleteTextInput,
                        listView: { zIndex: 16 },
                    }}
                    placeholder='Search for location...'
                    onPress={(data, details = null) => {
                        const { address_components } = details;
                        let city = '';
                        let state = '';

                        address_components.forEach(component => {
                            if (component.types.includes("locality")) {
                                city = component.long_name;
                            }
                            if (component.types.includes("administrative_area_level_1")) {
                                state = component.long_name;
                            }
                        });

                        const newLocation = {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            city: city,
                            state: state
                        };
                        setLocation(newLocation);
                        console.log("New Location:", newLocation);
                    }}

                    query={{
                        key: GOOGLE_API,
                        language: 'en',
                        location: location ? `${location.latitude},${location.longitude}` : null,
                        radius: 100000,  // Search within a 5km radius. Adjust as necessary.  
                        components: 'country:MY',  // Restrict to Malaysia only
                    }}
                    onFail={error => console.error(error)}
                    fetchDetails={true}
                />


                {location ? (
                    <MapView
                        style={{ height: windowHeight * 0.7, width: '100%' }}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0122,
                            longitudeDelta: 0.0061,
                        }}
                        onPress={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setLocation(prevLocation => ({ ...prevLocation, latitude, longitude }));
                        }}

                    >
                        {location.latitude && location.longitude && (
                            <Marker coordinate={location} />
                        )}
                    </MapView>

                ) : (
                    <View style={{ width: '100%', height: '100%', marginTop: '50%', alignItems: 'center' }}>
                        <Image source={require('../assets/icon/cat-typing.gif')} style={{ width: '28%', height: '8%', marginBottom: '3%' }} />
                        <Text style={{ color: Color.sandybrown, fontSize: 20 }}>Please wait while our furry staff</Text>
                        <Text style={{ color: Color.sandybrown, fontSize: 20, marginBottom: '5%' }}>working on it...</Text>
                        <View style={{ width: '50%', overflow: 'hidden' }}>
                            <LinearLoadingIndicator></LinearLoadingIndicator>
                        </View>
                    </View>
                )}


                <TouchableHighlight
                    style={styles.loginButton}
                    onPress={() => {
                        console.log("Location before navigating:", location);

                        navigation.navigate("CreateListing2", {
                            animalType: animalType,
                            breed: breed,
                            date: date.toISOString(),
                            petName: petName,
                            adoptionFee: adoptionFee,
                            listingType: listingType,
                            location: location,
                            petGender: petGender,
                            description: description
                        });
                    }}
                    underlayColor={Color.sandybrown}
                >
                    <Text style={styles.loginButtonText}>Next</Text>
                </TouchableHighlight>

            </View>
            <View style={styles.redirectSignUp}>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    autoCompleteContainer: {
        height: windowHeight * 0.2,
        width: '98%',
        height: '100%',
        position: 'absolute',
        marginLeft: windowWidth * 0.008,
        top: windowHeight * 0.17, // Or adjust as needed to place it at the desired position
        zIndex: 16, // To ensure it overlays other components
    },
    autoCompleteTextInput: {
        shadowColor: 'black',
        borderRadius: 30,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
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
    backButtonText: {
        paddingTop: windowHeight * 0.004,
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    container: {
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        paddingTop: windowHeight * 0.03,
        height: '100%'
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
        width: "93%",
        alignItems: "flex-start",
    },
    welcomeContainer: {
        marginTop: windowHeight * 0.035,
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
        marginBottom: windowHeight * 0.02,
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
        marginTop: windowHeight * 0.035,
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

export default CreateListingLocation;
