import React, { useState, useEffect } from "react";
import { Alert, BackHandler, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { SERVER_ADDRESS } from "../config";
const windowHeight = Dimensions.get("window").height;

const ResetPassword = ({ route }) => {
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_.,<>[\]])[A-Za-z\d@$!%*?&#_.,<>[\]]{8,}$/;
        return regex.test(password);
    };

    const handleNewPasswordChange = (text) => {
        setNewPassword(text);
        setPasswordValid(isPasswordValid(text));
        setIsPasswordMatch(text === confirmPassword);
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setIsPasswordMatch(newPassword === text);
    };

    const handleResetPassword = () => {
        // Validate the passwords
        if (newPassword === '' || confirmPassword === '') {
            Alert.alert('Error', 'Both password fields must be filled in.');
            return;
        }

        if (!passwordValid || !isPasswordMatch) {
            Alert.alert('Error', 'Please meet all the criteria.');
        }

        // Make the API call to update the password
        // Here, you'll need to include the email or user ID
        const email = route.params.user_email; // Assuming the email is passed from the previous component

        fetch(`${SERVER_ADDRESS}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        })
            .then((res) => res.json())
            .then((data) => {
                navigation.navigate('PasswordChanged'); // Redirect to login on successful password update
            })
            .catch((error) => Alert.alert('Error', error));
    };

    useEffect(() => {
        // Handle the back button press event
        const handleBackPress = () => {
            navigation.navigate('Login') // Direct to Login
            return true; // Prevent default behavior
        };

        // Add the event listener
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Return a cleanup function to remove the event listener
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []);

    return (
        <ScrollView>

            <View style={[styles.container, { height: windowHeight }]}>

                <View style={styles.screen}>

                    <TouchableHighlight
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Login')} // Navigate back to the previous screen
                    >
                        <Text style={styles.backButtonText}>X</Text>
                    </TouchableHighlight>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Reset Password</Text>
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
                        onPress={handleResetPassword} // Call the new handler
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
        paddingTop: windowHeight * 0.004,
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },

    screen: {
        flex: 5,
        width: "90%",
        alignItems: "flex-start",
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
        width: "100%",

    },
    inputLabel: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.silver,
        fontWeight: "600",
    },
    inputText: {
        color: "#533E41",
        paddingBottom: windowHeight * -0.015,
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
        fontSize: windowHeight * 0.028,
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

export default ResetPassword;
