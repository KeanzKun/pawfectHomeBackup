import React, { useState, useEffect, useCallback } from 'react';
import { Animated, BackHandler, Alert, Linking, View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import ReportListingModal from '../components/ReportListingModal';
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';

import { SERVER_ADDRESS } from '../config';

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

const PetDetails = ({ route }) => {
    const navigation = useNavigation();
    const [petDetails, setPetDetails] = useState(null);
    const [description, setDescription] = useState("");
    const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userContact, setUserContact] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handleReportListing = () => {
        setModalVisible(true);
    };

    const submitReport = async (reportData) => {
        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: petDetails.user.userID,
                    listingID: route.params.listingID,
                    report_type: reportData.reportReason,
                    report_description: reportData.description,
                }),
            });

            const result = await response.json();

            if (response.status === 201) {
                Alert.alert('Success!', 'Report submitted successfully!');
            } else {
                alert('Failed to submit the report. ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while submitting the report. Please try again later.');
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
                const listingID = route.params.listingID;
                const response = await fetch(`${SERVER_ADDRESS}/api/listings/${listingID}`);
                const json = await response.json();
                setPetDetails(json);
                const fullDescription = json.listing.listing_description;
                const shortDescription = fullDescription.slice(0, 300);
                setDescription(shortDescription);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchPetDetails();
    }, []);

    useEffect(() => {
        if (petDetails) {
            getUserContacts();
        }
    }, [petDetails, getUserContacts]);

    const getUserContacts = useCallback(async () => {
        try {
            const userID = petDetails.listing.userID;
            const response = await fetch(`${SERVER_ADDRESS}/api/user/${userID}`);
            const json = await response.json();
            setUserContact(json); // Modify this line to match the structure of your response
        } catch (error) {
            console.error(error);
        }
    }, [petDetails]);

    const directWhatsapp = async () => {

        const whatsappNumber = userContact.contact_number.slice(3);

        try {
            const url = `https://wa.me/${whatsappNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
        }
    };

    const directEmail = async () => {
        const email = userContact.user_email;

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
        const phoneNumber = userContact.contact_number

        try {
            const url = `tel:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
        }
    };

    const directSMS = async () => {
        const phoneNumber = userContact.contact_number

        try {
            const url = `sms:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            // Handle the error as needed, such as logging it or displaying an alert
            console.error('An error occurred:', error);
            Alert.alert('Error', 'Unable to open the URL');
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else { // Once data is available, render your component with actual data
        const imageFilenames = petDetails.pet.pet_photo.split(';');
        const imageUrls = imageFilenames.map(filename => `${SERVER_ADDRESS}/api/pets/pet_image/${filename}`);
        const { petAge } = route.params;
        const formattedDate = formatDate(petDetails.listing.listing_date);
        const gender = 'gender-' + petDetails.pet.pet_gender;

        return (

            <View style={{ flex: 1 }}>

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
                            {petDetails.pet.pet_name} <MaterialCommunityIcons name={gender} color='#900' size={25} />
                        </Text>
                        <Text style={styles.detailText}>{petDetails.pet.pet_type}</Text>
                        <Text style={styles.detailText}>{petDetails.pet.pet_breed}</Text>
                        <Text style={styles.detailText}>Age: {petAge}</Text>
                        <Text style={styles.detailText}>Location: {petDetails.listing.listing_location}</Text>
                        <Text style={styles.detailText}>Owner: {petDetails.user.user_name}</Text>
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
                        <Text style={styles.title}>Listing was created on:</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>

                    <View style={styles.adoptionContainer}>
                        <Text style={styles.title}>Adoption Fee</Text>
                        <Text style={styles.adoptionFee}>RM {petDetails.listing.adoption_fee}</Text>
                    </View>

                    <View style={styles.contactContainer}>
                        <Text style={[styles.title, { fontSize: 28 }]}>Contact The Owner</Text>
                        <View style={styles.contactButtons}>
                            <TouchableOpacity style={styles.contactButton}
                                onPress={() => {
                                    directWhatsapp()
                                }}
                            >
                                <MaterialCommunityIcons name="whatsapp" color='#900' size={30} />
                            </TouchableOpacity>
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
                            <TouchableOpacity style={styles.contactButton}
                                onPress={() => {
                                    directSMS();
                                }}>
                                <MaterialCommunityIcons name="message-outline" color='#900' size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonFrame}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            underlayColor={Color.sandybrown}
                            onPress={handleReportListing} // Handle the press event here
                        >
                            <Text style={styles.loginButtonText}>Report Listing</Text>
                        </TouchableOpacity>
                    </View>
                    <ReportListingModal modalVisible={modalVisible} setModalVisible={setModalVisible} onSubmit={submitReport} />
                </ScrollView>
            </View>
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
        height: windowHeight * 0.23,
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

export default PetDetails;
