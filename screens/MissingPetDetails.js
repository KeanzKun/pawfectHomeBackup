import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler, Linking, Alert, ScrollView, View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
import { SERVER_ADDRESS } from '../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

const MissingPetDetails = ({ route }) => {
    const navigation = useNavigation();
    const [petDetails, setPetDetails] = useState(null);
    const [description, setDescription] = useState("");
    const [isFullDescriptionShown, setIsFullDescriptionShown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userContact, setUserContact] = useState(null);

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
        console.log(whatsappNumber)
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
    } else {
        const imageUrl = `${SERVER_ADDRESS}/api/pets/pet_image/${petDetails.pet.pet_photo}`;
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

                    <View key={0}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                        />
                    </View>

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
                        <Text style={styles.title}>Missing Details</Text>
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

export default MissingPetDetails;
