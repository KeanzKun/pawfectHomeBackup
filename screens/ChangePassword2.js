import React, { useState } from "react";
import { BackHandler, Alert, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation, useFocusEffect, CommonActions } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_ADDRESS } from '../config';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const ChangePassword2 = () => {
    const navigation = useNavigation();

    // State variables to hold the new password and confirmed password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);


    const handleNewPasswordChange = (text) => {
        setNewPassword(text);
        setPasswordValid(isPasswordValid(text));  // Use the isPasswordValid function here
        setIsPasswordMatch(text === confirmPassword);
    };
    

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setIsPasswordMatch(newPassword === text);
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.,<>[\]])[A-Za-z\d@$!%*?&#.,<>[\]]{8,}$/;
        return regex.test(password);
    };

    const handleBackPress = () => {
        // Construct the navigation action to target the nested navigator
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Main', // The name of the screen that hosts the bottom tab navigator
                params: {
                    screen: 'AccountSetting', // The name of the target screen inside the bottom tab navigator
                },
            })
        );

        return true; // Return true to prevent the default back action
    };

    // Use the useFocusEffect hook to add the custom back handler when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            // Add the custom back handler when the screen is focused
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            // Return a cleanup function that removes the custom back handler when the screen is unfocused
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            };
        }, []) // Empty dependency array means this effect will run only when the screen is focused or unfocused
    );

    // Function to handle the password update
    const handleUpdatePassword = async () => {

        //Validate the passwords
        if (newPassword === '' || confirmPassword === '') {
            Alert.alert('Error', 'Both password fields must be filled in.');
            return;
        }

        if (!passwordValid || !isPasswordMatch) {
            Alert.alert('Error', 'Please meet all the criteria.');
        }

        const token = await AsyncStorage.getItem('token'); // Retrieve token

        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token // Replace with your user's token
                },
                body: JSON.stringify({ new_password: newPassword })
            });

            const result = await response.json();

            if (response.status === 200) {
                await AsyncStorage.removeItem('token');
                // Password was updated, navigate to the next screen or show success message
                navigation.navigate("PasswordChanged");
            } else {
                // Handle error, show an alert or some feedback to the user
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error(error);
            // Handle the error as needed
        }
    };
    return (
        <ScrollView scrollEnabled={false}>
            <View style={[styles.container, { height: windowHeight }]}>

                <View style={{ flex: 5 }}>
                    <TouchableHighlight
                        style={styles.backButton}
                        onPress={() => navigation.navigate("AccountSetting")} // Navigate back to the previous screen
                    >
                        <Text style={styles.backButtonText}>X</Text>
                    </TouchableHighlight>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Change Password</Text>
                        <Text style={styles.subTitleText}>Okay, enter the new password!</Text>
                    </View>

                    <View style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>New Password</Text>
                        <Input
                            secureTextEntry={true}
                            onChangeText={handleNewPasswordChange}
                            required={true}
                            inputStyle={styles.inputText}
                        />
                        {!passwordValid && <Text style={styles.warningText}>Password must be at least 8 characters, contain 1 number, 1 special character, and 1 capital letter.</Text>}
                    </View>

                    <View style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <Input
                            secureTextEntry={true}
                            onChangeText={handleConfirmPasswordChange}
                            required={true}
                            inputStyle={styles.inputText}
                        />
                        {!isPasswordMatch && <Text style={styles.warningText}>Passwords do not match.</Text>}
                    </View>
                </View>
                <View style={styles.buttonFrame}>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={handleUpdatePassword} // Call the handleUpdatePassword function when pressed
                        underlayColor={Color.sandybrown}
                    >
                        <Text style={styles.buttonText}>Reset Password</Text>
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
        paddingHorizontal: '3%',
        alignItems: "flex-start",
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
        marginBottom: windowHeight * 0.05,
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
    warningText: {
        color: Color.sandybrown,
        marginLeft: windowHeight * 0.015,
        marginTop: windowHeight * -0.03,
        marginBottom: windowHeight * 0.0055
    },
});

export default ChangePassword2;
