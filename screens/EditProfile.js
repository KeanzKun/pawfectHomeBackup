import React, { useEffect, useState } from 'react';
import { BackHandler, Alert, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For accessing token
import { SERVER_ADDRESS } from '../config';

const windowHeight = Dimensions.get("window").height;

const EditProfile = () => {
    const navigation = useNavigation();
    const [userDetails, setUserDetails] = useState({
        userName: '',
        userEmail: '',
        contactNumber: ''
    });

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

    const updateUsername = async () => {

        if (!userDetails.userName.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        fetch(`${SERVER_ADDRESS}/api/update-userName`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: userDetails.userName }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle response from server
                Alert.alert('Success', 'Username updated successfully');
                navigation.navigate("AccountSetting");
            })
            .catch((error) => console.error(error));
    };

    const fetchUserDetails = async () => {
        const token = await AsyncStorage.getItem('token'); // Retrieve token
        fetch(`${SERVER_ADDRESS}/api/get-user-details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}` // Send token in header
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setUserDetails({
                    userName: data.user.user_name,
                    userEmail: data.user.user_email,
                    contactNumber: data.user.contact_number
                });
            })
            .catch((error) => console.error(error));
    };

    // Fetch user details when component is mounted
    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.screen}>

                <TouchableHighlight
                    style={styles.backButton}
                    onPress={() => navigation.goBack()} // Navigate back to the previous screen
                >
                    <Text style={styles.backButtonText}>&lt;</Text>
                </TouchableHighlight>

                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeBackText}>Profile</Text>
                </View>

                <View style={styles.usernameFieldContainer}>
                    <Text style={styles.emailLabel}>Username</Text>
                    <Input
                        required={true}
                        inputStyle={styles.usernameInput}
                        onChangeText={(value) => setUserDetails({ ...userDetails, userName: value })} // Handle change
                        value={userDetails.userName}
                    />
                </View>


                <View style={styles.usernameFieldContainer}>
                    <Text style={styles.emailLabel}>Email</Text>
                    <Input
                        inputStyle={styles.usernameInput}
                        value={userDetails.userEmail}
                        editable={false}
                        color={'#8D8D8D'}
                    />
                </View>

                <View style={styles.usernameFieldContainer}>
                    <Text style={styles.emailLabel}>Contact Number</Text>
                    <Input
                        inputStyle={styles.usernameInput}
                        value={userDetails.contactNumber}
                        editable={false}
                        color={'#8D8D8D'}
                    />
                </View>
            </View>
            <View style={styles.redirectSignUp}>
                <TouchableHighlight
                    style={styles.loginButton}
                    onPress={updateUsername} // Call the update function on press
                    underlayColor={Color.sandybrown}
                >
                    <Text style={styles.loginButtonText}>Submit</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        height: "100%",
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
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "900",
    },
    screen: {
        flex: 1,
        width: "90%",
        alignItems: "flex-start",
    },
    titleContainer: {
        marginLeft: windowHeight * 0.01,
        marginTop: windowHeight * 0.01,
        marginBottom: windowHeight * 0.05,
    },
    welcomeBackText: {
        fontSize: 39,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: "left",
    },
    usernameFieldContainer: {
        width: "100%",

    },
    emailLabel: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.silver,
        fontWeight: "600",
    },
    usernameInput: {
        color: "#533E41",
        paddingBottom: windowHeight * -0.015,
    },
    loginButton: {
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
    loginButtonText: {
        fontSize: windowHeight * 0.04,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    redirectSignUp: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: windowHeight * 0.02,
        position: "absolute",
        bottom: windowHeight * 0.05,
        width: "100%",
    },
});

export default EditProfile;
