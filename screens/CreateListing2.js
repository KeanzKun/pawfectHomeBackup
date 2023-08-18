import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Pressable, View, Image, ScrollView, TouchableHighlight, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const DATA = [
    { id: '1', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Second Item', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '4', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '5', title: 'First Item', image: 'https://via.placeholder.com/150' },

    // add more items here...
];

const CreateListing2 = () => {
    const [userImage, setUserImage] = useState(null);

    const chooseImage = () => {
        const options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets[0] && response.assets[0].uri) {
                const source = { uri: response.assets[0].uri };
                setUserImage(source);
                console.log(source);
            }
        });
    };



    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
            </View>
        </TouchableOpacity>
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

            {/* Display image for debugging */}
            {userImage && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text>Uploaded Image:</Text>
                    <Image source={userImage} style={{ width: 150, height: 150, marginTop: 10 }} />
                </View>
            )}

            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{ height: 3 * (windowHeight * 0.02 + windowWidth * 0.03) }}
            />

            <View style={styles.addContainer}>
                <TouchableOpacity style={styles.addBox} onPress={chooseImage}>
                    <Text style={styles.addBoxText}>+</Text>
                    <Text style={styles.addBoxTextUploadPhoto}>Upload Photo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonFrame}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={() => navigation.navigate("CreateListing3")}
                    underlayColor={Color.sandybrown}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableHighlight>
            </View>

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
        height: windowHeight * 0.08,
        width: windowWidth * 0.88,
        marginBottom: windowWidth * 0.03,
        marginLeft: windowWidth * 0.03,
        marginRight: windowWidth * 0.03,
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
