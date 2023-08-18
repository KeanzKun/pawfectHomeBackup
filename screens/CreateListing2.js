import React, { useState, useEffect } from "react";
import { Alert, Text, StyleSheet, TouchableOpacity, Pressable, View, Image, ScrollView, TouchableHighlight, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageResizer from 'react-native-image-resizer';
import EnlargeImageModal from "../components/EnlargeImageModal";
import RNFS from 'react-native-fs';
import { PET_IMG } from "../config"; // Import your config
import { SERVER_ADDRESS } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDetails, getStoredUserID } from "../components/UserService";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;


const CreateListing2 = ({ route }) => {
    const { animalType, breed, date, petName, adoptionFee, listingType, location, petGender, description } = route.params;
    const [userImages, setUserImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);
    const [userID, setUserID] = useState(null);

    const requestStoragePermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        if (result === 'granted') {
            return true;
        }
        return false;
    };

    function getCurrentTimestamp() {
        const date = new Date();
    
        const YYYY = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const DD = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        const ms = String(date.getMilliseconds()).padStart(3, '0'); // padStart with 3 zeros for milliseconds
    
        return `${YYYY}${MM}${DD}${hh}${mm}${ss}${ms}`;
    }

    useEffect(() => {
        const fetchUserID = async () => {
            const storedUserID = await getStoredUserID();
            setUserID(storedUserID);
        };

        fetchUserID();
    }, []);

    const chooseImage = () => {
        if (userImages.length >= 5) {
            alert("You can only upload a maximum of 5 photos.");
            return;
        }

        const options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets[0] && response.assets[0].uri) {
                const originalWidth = response.assets[0].width;
                const originalHeight = response.assets[0].height;

                // Define the percentage to resize
                const resizePercentage = 0.6;  // 50%

                // Calculate new dimensions
                const newWidth = originalWidth * resizePercentage;
                const newHeight = originalHeight * resizePercentage;

                try {
                    // Resize and compress the image
                    const resizedImage = await ImageResizer.createResizedImage(
                        response.assets[0].uri,
                        newWidth,
                        newHeight,
                        'JPEG',  // format
                        90  // compression quality
                    );

                    const source = { uri: resizedImage.uri };
                    setUserImages(prevImages => [...prevImages, source]);
                } catch (error) {
                    console.log("Error resizing the image: ", error);
                }
            };


        });
    };

    const handleSubmission = async () => {
        // Check if any images are uploaded
        if (userImages.length === 0) {
            alert("Please upload at least one image before proceeding.");
            return;
        }
        // Generate image names and upload images
        let tempImageNames = []; // Temporary array to store image names
        for (let image of userImages) {
            try {
                
                if (!userID) {
                    alert("Something went wrong. Please try again.");
                    return;
                }

                const timeStamp = getCurrentTimestamp();
                let imageName = `${animalType}_${userID}${timeStamp}.jpg`;

                tempImageNames.push(imageName); // Add the image name to the temporary array

                let formData = new FormData();
                formData.append('photo', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: imageName
                });

                await fetch(`${SERVER_ADDRESS}/api/upload-image`, {
                    method: "POST",
                    body: formData
                });
            } catch (error) {
                console.error("Failed to upload image", image, error);
            }
        }

        setImageNames(tempImageNames); // Update the state with the image names

        let concatenatedImageNames = tempImageNames.join(';'); // Concatenate image names

        // Insert pet details with concatenated image names
        let petResponse = await fetch(`${SERVER_ADDRESS}/api/add-pet`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pet_name: petName,
                pet_type: animalType,
                pet_age: date,
                pet_gender: petGender,
                pet_breed: breed,
                pet_photo: concatenatedImageNames
            })
        });
        let petData = await petResponse.json();

        if (!petResponse.ok) {
            Alert.alert('Uh Oh!', 'Something went wrong, our dog ate the data, please try again')
            return;
        }

        // 2. Insert into Pet_Owner table
        let petOwnerResponse = await fetch(`${SERVER_ADDRESS}/api/add-pet-owner`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                petID: petData.petID
            })
        });

        if (!petOwnerResponse.ok) {
            Alert.alert('Uh Oh!', 'Something went wrong, our dog ate the data, please try again')
            return;
        }

        // 3. Insert location details
        let locationResponse = await fetch(`${SERVER_ADDRESS}/api/add-location`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude: location.latitude,
                longitude: location.longitude,
                city: location.city,
                state: location.state,
            })
        });
        let locationData = await locationResponse.json();

        if (!locationResponse.ok) {
            Alert.alert('Uh Oh!', 'Something went wrong, dog ate the data, please try again')
            return;
        }

        // 4. Insert listing details
        let listingResponse = await fetch(`${SERVER_ADDRESS}/api/add-listing`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                petID: petData.petID,
                listing_description: description,
                userID: userID,
                locationID: locationData.locationID,
                listing_type: listingType,
                adoption_fee: adoptionFee,
                listing_date: new Date().toISOString().split('T')[0], // Today's date
                listing_status: 'active'
            })
        });

        if (!listingResponse.ok) {
            Alert.alert('Uh Oh!', 'Something went wrong, dog ate the data, please try again')
            return;
        }

        navigation.navigate("CreateListing3");

    };
    const removeImage = (index) => {
        const updatedImages = [...userImages];
        updatedImages.splice(index, 1);
        setUserImages(updatedImages);
    };


    const renderItem = ({ item, index }) => (
        <View style={{ flex: 1, height: '100%' }}>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeImage(index)}>
                <View style={{ marginTop: '8%' }}>
                    <MaterialCommunityIcons name="trash-can-outline" color='#900' size={25} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    setEnlargedImageUrl(item.uri);
                    setModalVisible(true);
                }}
            >
                <Image source={item} style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity>
        </View>
    );


    const navigation = useNavigation();

    return (

        <View style={[styles.container, { height: windowHeight }]}>

            <View style={{ flex: 1.5 }}>
                <TouchableHighlight
                    style={styles.backButton}
                    onPress={() => navigation.navigate("AccountSetting")} // Navigate back to the previous screen
                >
                    <Text style={styles.backButtonText}>X</Text>
                </TouchableHighlight>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>One Step Left!</Text>
                    <Text style={styles.subTitleText}>Your pet is closer to get a new home!</Text>
                </View>

            </View>

            <FlatList
                data={userImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}

                horizontal={true}
                style={{ height: '8%' }}
            />

            <View style={{ alignItems: 'center', alignContent: 'center', width: '100%', marginTop: '5%' }}>
                <Text style={{ fontSize: 16, color: Color.dimgray }}>
                    Uploaded photos: {userImages.length} / 5
                </Text>
            </View>



            <View style={styles.addContainer}>
                <TouchableOpacity style={styles.addBox} onPress={chooseImage}>
                    <Text style={styles.addBoxText}>+</Text>
                    <Text style={styles.addBoxTextUploadPhoto}>Upload Photo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonFrame}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={handleSubmission} // Modified to handleSubmission
                    underlayColor={Color.sandybrown}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableHighlight>
            </View>
            <EnlargeImageModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                imageUrl={enlargedImageUrl}
            />

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: '3%',
        alignItems: "flex-start",
    },
    addContainer: {
        flex: 1.8,
        width: '100%',
        alignContent: 'center',
        marginTop: windowHeight * 0.04,
    },

    addBox: {
        width: windowWidth * 0.8,
        height: windowHeight * 0.2,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Color.dimgray,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    addBoxText: {
        fontSize: 48,
        color: Color.dimgray,
        fontWeight: 'bold',
    },
    addBoxTextUploadPhoto: {
        fontSize: 20,
        color: Color.dimgray,
        fontWeight: 'bold',
    },
    item: {
        height: windowHeight * 0.2,
        width: windowWidth * 0.406,
        marginLeft: windowWidth * 0.03,
        marginRight: windowWidth * 0.03,
        marginTop: windowHeight * 0.01,
        borderRadius: 10,
        backgroundColor: Color.dimgray,
        overflow: 'hidden', // Add this line
    },
    itemText: {
        color: 'white',
    },
    itemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        marginTop: windowHeight * 0.03,
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
    },
    backButtonText: {
        paddingTop: windowHeight * 0.004,
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    deleteButton: {
        width: windowHeight * 0.04,
        height: windowHeight * 0.04,
        borderRadius: 10,
        position: 'absolute',
        right: 2,
        top: 0,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
        zIndex: 1,
    },
    deleteButtonText: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    titleContainer: {
        marginLeft: windowHeight * 0.01,
        marginTop: windowHeight * 0.01,
    },
    titleText: {
        fontSize: 39,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: "left",
    },
    inputFieldContainer: {
        width: windowWidth * 0.935,
    },
    inputLabel: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.silver,
        fontWeight: "600",
    },
    inputText: {
        color: "#533E41",
        paddingBottom: windowWidth * -0.015,
    },
    button: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        width: "60%",
        height: windowHeight * 0.09,
        paddingHorizontal: windowHeight * 0.04,
        marginBottom: windowHeight * 0.03, // Add margin bottom
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    subTitleText: {
        fontSize: windowHeight * 0.025,
        letterSpacing: 0.2,
        marginBottom: windowHeight * 0.015,
        fontWeight: '700',
        textAlign: "left",
    },
    buttonText: {
        fontSize: windowHeight * 0.025,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    buttonFrame: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },
});

export default CreateListing2;
