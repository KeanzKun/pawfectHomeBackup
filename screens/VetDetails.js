import React, { useState, useEffect } from "react";
import { BackHandler, Alert, Linking, ScrollView, View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { SERVER_ADDRESS } from '../config';
import MapView, { Marker } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const VetDetails = ({ route }) => {
    const navigation = useNavigation();
    const vetID = route.params.vetID;
    const [vetDetails, setVetDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const searchVetOnGoogle = async () => {
        try {
            const query = encodeURIComponent(vetDetails.vet_name);
            const url = `https://www.google.com/search?q=${query}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
        }
    };

    const openInGoogleMaps = () => {
        const latitude = vetDetails.vet_latitude;
        const longitude = vetDetails.vet_longitude;
        const label = vetDetails.vet_name;
        const url = Platform.select({
            ios: `maps://app?daddr=${latitude}+${longitude}+&q=${label}`,
            android: `geo:${latitude},${longitude}?q=${label}`
        });

        Linking.openURL(url);
    }

    const directEmail = async () => {
        const email = vetDetails.vet_email;

        try {
            const query = encodeURIComponent(email);
            const url = `mailto:${query}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
        }
    };

    const directCall = async () => {
        const phoneNumber = vetDetails.vet_contact;

        try {
            const url = `tel:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
        }
    };

    useEffect(() => {
        // Handle the back button press event
        const handleBackPress = () => {
            navigation.goBack(); // Exit the app
            return true; // Prevent default behavior
        };

        // Add the event listener
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Return a cleanup function to remove the event listener
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []);


    useEffect(() => {

        const fetchPetDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${SERVER_ADDRESS}/api/vets/${vetID}`);
                const json = await response.json();
                setVetDetails(json[0]);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchPetDetails();
    }, []);

    if (isLoading) { // Render a loading indicator if data is still being fetched
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else {
        return (

            <ScrollView>
                <View style={{ flex: 1 }}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()} // Navigate back to the previous screen
                    >
                        <Text style={styles.backButtonText}>&lt;</Text>
                    </TouchableOpacity>

                    <View style={styles.container}>

                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, { fontSize: 30 }]}>Vet Info</Text>
                        </View>

                        <View style={styles.detailsContainer}>
                            <Text style={styles.petName}>
                                {vetDetails.vet_name}
                            </Text>
                            <Text style={styles.detailText}>{vetDetails.vet_hours}</Text>
                            <Text style={styles.detailText}>{vetDetails.vet_address}</Text>
                            <TouchableOpacity onPress={searchVetOnGoogle}>
                                <Text style={[styles.detailText, { color: Color.sandybrown }]}>Search on Google</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Map</Text>
                        </View>

                        <View style={styles.mapContainer}>
                            <View style={styles.mapContainer}>
                                <TouchableOpacity onPress={openInGoogleMaps} style={{ height: '100%', width: '100%' }}>
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: vetDetails.vet_latitude,
                                            longitude: vetDetails.vet_longitude,
                                            latitudeDelta: 0.0122,
                                            longitudeDelta: 0.0061,
                                        }}
                                        zoomEnabled={false}
                                        scrollEnabled={false}
                                        rotateEnabled={false}
                                        pitchEnabled={false}
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: vetDetails.vet_latitude,
                                                longitude: vetDetails.vet_longitude
                                            }}
                                            title={vetDetails.vet_name}
                                        />
                                    </MapView>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.contactContainer}>
                            <Text style={[styles.title, { fontSize: 28, marginTop: '-10%' }]}>Contact The Vet</Text>
                            <View style={styles.contactButtons}>
                                <TouchableOpacity style={styles.contactButton}
                                    onPress={() => {
                                        directEmail();
                                    }}
                                >
                                    <MaterialCommunityIcons name="email-outline" color='#900' size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactButton}
                                    onPress={() => {
                                        directCall();
                                    }}
                                >
                                    <MaterialCommunityIcons name="phone" color='#900' size={30} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonFrame: {
        flex: 1,
        alignItems: "center",
        width: windowWidth,
        marginBottom: windowHeight * 0.08
    },
    backButton: {
        position: 'absolute',
        top: 20, // adjust this value as per your needs
        left: 20, // adjust this value as per your needs
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
    loginButton: {
        borderRadius: 80,
        backgroundColor: Color.sandybrown,
        width: '60%',
        height: windowHeight * 0.09,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    titleContainer: {
        alignItems: 'center',
        marginHorizontal: windowWidth * 0.07,
        marginTop: windowHeight * 0.07,
        marginVertical: windowHeight * 0.05,
    },
    detailsContainer: {
        height: windowHeight * 0.23,
        marginHorizontal: windowHeight * 0.03,
        paddingVertical: windowHeight * 0.03,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: windowWidth * 0.08,
    },
    petName: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01
    },
    title: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: '900',
    },
    detailText: {
        fontSize: 15,
    },
    contactContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginVertical: windowHeight * 0.08,
        alignItems: 'center',
    },
    contactButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: windowWidth * 0.8,
        marginTop: windowHeight * 0.02
    },
    contactButton: {
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        marginHorizontal: windowWidth * 0.03,
        borderRadius: 50,
        backgroundColor: Color.sandybrown,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        height: windowHeight * 0.3, // adjust the height as you need
        width: '93%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },

    map: {
        marginTop: '-10%',
        height: '100%',
        width: '100%',
    },

});

export default VetDetails;
