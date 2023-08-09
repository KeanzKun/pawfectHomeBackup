import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For accessing token

const windowHeight = Dimensions.get("window").height;

const EditProfile = () => {

    const navigation = useNavigation();
    const [userDetails, setUserDetails] = useState({
        userName: '',
        userEmail: '',
        contactNumber: ''
    });

    const fetchUserDetails = async () => {
        const token = await AsyncStorage.getItem('token'); // Retrieve token
        console.log('Frontend token:', token); // Print the token
        fetch('http://10.0.2.2:5000/api/get-user-details', {
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
                        value={userDetails.userName} // Value from state
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


                <View style={styles.redirectSignUp}>
                    <TouchableHighlight
                        style={styles.loginButton}
                        onPress={() => navigation.navigate("EmailVerification2")}
                        underlayColor={Color.sandybrown}
                    >
                        <Text style={styles.loginButtonText}>Submit</Text>
                    </TouchableHighlight>
                </View>
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
        width: "70%",
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
