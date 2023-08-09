import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you are using FontAwesome for icons
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from '@react-navigation/native';
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    
    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setIsLoading(true);
                const listingID = route.params.listingID;
                const response = await fetch(`http://10.0.2.2:5000/api/listings/${listingID}`);
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
        const imageUrl = `http://10.0.2.2:5000/api/pets/pet_image/${petDetails.pet.pet_photo}`;
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
                            <TouchableOpacity style={styles.contactButton}>
                                <MaterialCommunityIcons name="whatsapp" color='#900' size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactButton}>
                                <MaterialCommunityIcons name="email-outline" color='#900' size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactButton}>
                                <MaterialCommunityIcons name="phone" color='#900' size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactButton}>
                                <MaterialCommunityIcons name="message-outline" color='#900' size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonFrame}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            underlayColor={Color.sandybrown}
                        >
                            <Text style={styles.loginButtonText}>Report Listing</Text>
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
