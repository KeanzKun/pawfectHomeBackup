import React, { useState, useEffect } from 'react';
import { Modal, BackHandler, View, Alert, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { SERVER_ADDRESS } from '../config';
import Swiper from 'react-native-swiper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearLoadingIndicator from '../components/LinearLoadingIndicator';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;



function formatDate(dateString) {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let date = new Date(dateString);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    // Ensuring the day is two digits
    if (day < 10) day = '0' + day;

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}


const PetListingDetails = ({ route }) => {

    const navigation = useNavigation();
    const [petDetails, setPetDetails] = useState(null);
    const [description, setDescription] = useState("");
    const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonText, setButtonText] = useState(null);
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        if (petDetails) {
            if (petDetails.listing.listing_type === "missing") {
                setButtonText('Found');
            } else if (petDetails.listing.listing_type === "adopt" || petDetails.listing.listing_type === "reHome") {
                setButtonText('Adopted');
            }
        }
    }, [petDetails]); // Dependency on petDetails

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
                const listingID = route.params.listingID;
                const response = await fetch(`${SERVER_ADDRESS}/api/listings/${listingID}`);
                const json = await response.json();

                // Fetch location details
                if (json.listing.locationID) {
                    try {
                        const locationResponse = await fetch(`${SERVER_ADDRESS}/api/listing-location/${json.listing.locationID}`);
                        const locationData = await locationResponse.json();
                        json.listing.locationDetails = locationData;
                    } catch (error) {
                        console.error("Error fetching location details:", error);
                    }
                }

                setPetDetails(json);
                const fullDescription = json.listing.listing_description;
                const description = fullDescription.slice(0, 300);
                setDescription(description);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchPetDetails();

    }, []);

    const updateListingStatus = async (status) => {
        const listingID = petDetails.listing.listingID; // Get the listing ID from the petDetails
        const response = await fetch(`${SERVER_ADDRESS}/api/listings/update-status/${listingID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listing_status: status })
        });

        console.log('API Response:', response.status, response.statusText);
        const responseBody = await response.text();
        console.log('API Response Body:', responseBody);

        try {
            const json = JSON.parse(responseBody);

            if (response.status === 200) {
                // Update the local state with the new listing status
                setPetDetails({
                    ...petDetails,
                    listing: {
                        ...petDetails.listing,
                        listing_status: status,
                    }
                });
                Alert.alert('Success', json.message); // Display the success message
            } else {
                // Handle the error response
                Alert.alert('Error', json.message);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };


    const toggleDescription = () => {
        if (!petDetails) return;
        const fullDescription = petDetails.listing.listing_description;
        if (isFullDescriptionShown) {
            setDescription(fullDescription.slice(0, 300) + "...");
        } else {
            setDescription(fullDescription);
        }

        setIsFullDescriptionShown(!isFullDescriptionShown);
    };

    if (isLoading) { // Render a loading indicator if data is still being fetched
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isLoadingVisible}
                onRequestClose={() => {
                    setIsLoadingVisible(false);
                }}
            >
                <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/icon/cat-typing.gif')} style={{ width: '28%', height: '8%', marginBottom: '3%' }} />
                        <Text style={{ color: Color.sandybrown, fontSize: 20 }}>Please wait while our furry staff</Text>
                        <Text style={{ color: Color.sandybrown, fontSize: 20, marginBottom: '5%' }}>working on it...</Text>
                        <View style={{ width: '50%', overflow: 'hidden' }}>
                            <LinearLoadingIndicator></LinearLoadingIndicator>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    } else { // Once data is available, render your component with actual data
        const imageFilenames = petDetails.pet.pet_photo.split(';');
        const imageUrls = imageFilenames.map(filename => `${SERVER_ADDRESS}/api/pets/pet_image/${filename}`);
        const { petAge } = route.params;
        const formattedDate = formatDate(petDetails.listing.listing_date);
        const locationCity = petDetails.listing.locationDetails ? petDetails.listing.locationDetails.city : "Unknown Location";
        const locationState = petDetails.listing.locationDetails ? petDetails.listing.locationDetails.state : "Unknown Location";
        const petType = capitalizeFirstLetter(petDetails.pet.pet_type)

        return (

            <View style={{ flex: 1 }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Confirmation</Text>
                            <Text style={{ textAlign: 'center', marginTop: '5%' }}>Please note that the action cannot be undone.</Text>

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => setIsModalVisible(false)}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalButtonText}>Back</Text>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsModalVisible(false); // Hide the modal
                                        if (buttonText.toLowerCase() === "found" || buttonText.toLowerCase() === "adopted") {
                                            updateListingStatus(buttonText.toLowerCase());
                                        } else {
                                            updateListingStatus('delisted');
                                        }
                                        navigation.navigate('PetListingHistoryScreen');
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalButtonText}>Proceed</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()} // Navigate back to the previous screen
                >
                    <Text style={styles.backButtonText}>&lt;</Text>
                </TouchableOpacity>

                <ScrollView style={styles.container} stickyHeaderIndices={[1]}>

                    <Swiper
                        height={windowHeight * 0.4}
                        showsButtons={false}
                        dot={<View style={{
                            backgroundColor: 'rgba(255, 158, 92 ,.7)',
                            width: windowWidth * 0.02,
                            marginHorizontal: '1%',
                            height: 8,
                            borderRadius: 4,
                            marginBottom: '5%'
                        }} />}
                        activeDot={<View style={{
                            backgroundColor: Color.sandybrown,
                            width: windowWidth * 0.04,
                            height: windowHeight * 0.01,
                            borderRadius: 4,
                            marginBottom: '5%'
                        }} />}
                        paginationStyle={{
                            alignSelf: 'center'
                        }}
                    >
                        {imageUrls.map((imageUrl, index) => (
                            <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                style={styles.image}
                            />
                        ))}
                    </Swiper>

                    <View key={1} style={styles.detailsContainer}>
                        <Text style={styles.petName}>
                            {petDetails.pet.pet_name} <Icon name="venus" size={20} color="#900" />
                        </Text>
                        <View style={{ flexDirection: 'row', marginBottom: '2%' }}>
                            <MaterialCommunityIcons name="paw" color='#900' size={20} />
                            <Text style={styles.detailText}>{petType}, {petDetails.pet.pet_breed}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: '2%' }}>
                            <MaterialCommunityIcons name="calendar-blank-outline" color='#900' size={20} />
                            <Text style={styles.detailText}>{petAge}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: '2%' }}>
                            <MaterialCommunityIcons name="map-marker" color='#900' size={20} />
                            <Text style={styles.detailText}>{locationCity}, {locationState}</Text>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Pet Description</Text>
                    </View>

                    <View style={styles.description}>
                        <Text>
                            {description}
                        </Text>
                        {description.length > 300 && (
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text style={styles.showMore}>
                                    {isFullDescriptionShown ? "Show Less" : "Show More"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.listingDateContainer}>
                        <Text style={styles.title}>Listed since:</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>

                    <View style={styles.buttonFrame}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            underlayColor={Color.sandybrown}
                            onPress={() => {
                                setIsModalVisible(true); // Show the modal
                            }}
                        >
                            <Text style={styles.loginButtonText}>{buttonText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.loginButton}
                            underlayColor={Color.sandybrown}
                            onPress={() => {
                                setIsModalVisible(true); // Show the modal
                            }}
                        >
                            <Text style={styles.loginButtonText}>Delist</Text>
                        </TouchableOpacity>

                    </View>


                </ScrollView>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '100%',

    },
    modalText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: 'center',
    },
    modalButtonText: {
        fontSize: windowHeight * 0.02,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        width: '75%',
        height: '25%',
        backgroundColor: 'white',
        padding: '5%',
        borderRadius: 30
    },
    modalButton: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        marginHorizontal: '5%',
        marginBottom: '20%',
        width: '40%',
        height: '30%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    buttonFrame: {
        flex: 1,
        paddingHorizontal: windowHeight * 0.03,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        width: windowWidth,
        justifyContent: 'space-between',
        marginVertical: windowHeight * 0.08
    },
    showMore: {
        color: Color.sandybrown
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
        zIndex: 1
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
        width: '45%',
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
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.01,
    },
    adoptionContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.01,
    },
    listingDateContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.05,
    },
    description: {
        marginHorizontal: windowWidth * 0.07,
        marginBottom: windowHeight * 0.05
    },
    image: {
        width: windowWidth,
        height: windowHeight * 0.4,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    detailsContainer: {
        height: windowHeight * 0.21,
        marginHorizontal: windowHeight * 0.03,
        paddingVertical: windowHeight * 0.02,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: windowWidth * 0.08,
        bottom: windowHeight * 0.04,
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
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01
    },
    date: {
        fontSize: 18,
        fontWeight: '700',
    },
    adoptionFee: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.01,
        marginTop: windowHeight * - 0.01
    },
    detailText: {
        marginLeft: '2%',
        fontSize: 15,
    },
    contactContainer: {
        marginHorizontal: windowWidth * 0.07,
        marginVertical: windowHeight * 0.08,
        alignItems: 'center',
    },
    contactButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: windowWidth * 0.8,
        marginTop: windowHeight * 0.02
    },
    contactButton: {
        width: windowWidth * 0.15,
        height: windowWidth * 0.15,
        borderRadius: 50,
        backgroundColor: Color.sandybrown,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default PetListingDetails;
