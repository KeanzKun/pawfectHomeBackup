import React, { useState } from "react";
import { ActivityIndicator, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { SERVER_ADDRESS } from "../config";
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";

const windowHeight = Dimensions.get("window").height;

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (value) => {
        setEmail(value);
        setIsValidEmail(validateEmail(value));
    };

    const validateEmail = (email) => {
        // Using a simple regex to validate email format
        const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return pattern.test(email);
    };

    const handleSubmit = () => {
        if (isValidEmail) {
            setIsLoading(true);
            // Make API call to check if email exists in the user table
            fetch(`${SERVER_ADDRESS}/api/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    if (data.exists) { // Changed from data.isValid to data.exists
                        console.log('TEST')
                        // Call another API to send an email if the email is valid
                        fetch(`${SERVER_ADDRESS}/api/send-email`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email }),
                        })
                            .then(() => {
                                // Navigate to the next screen if successful
                                navigation.navigate("ForgotPassword2", {user_email: email});
                            })
                            .catch((err) => console.error(err));
                    }
                    else {
                        navigation.navigate("ForgotPassword2", {user_email: '' });
                    }
                })
                .catch((error) => console.error(error))
                
        }
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>
        {isLoading && <LinearLoadingIndicator />}
            <View style={styles.screen}>

                <TouchableHighlight
                    style={styles.backButton}
                    onPress={() => navigation.goBack()} // Navigate back to the previous screen
                >
                    <Text style={styles.backButtonText}>&lt;</Text>
                </TouchableHighlight>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Let us assist you.</Text>
                    <Text style={styles.subTitleText}>Enter your email</Text>
                </View>

                <View style={styles.inputFieldContainer}>
                    <Input
                        required={true}
                        placeholder="Email"
                        leftIcon={{ name: "email", type: "material-community" }}
                        inputStyle={styles.inputField}
                        onChangeText={handleEmailChange}
                        value={email}
                    />
                    {!isValidEmail && <Text style={styles.warningText}>Please enter a valid email</Text>}
                </View>


            </View>

            <View style={styles.buttonFrame}>
                <TouchableHighlight
                    style={[styles.button]}
                    onPress={handleSubmit}
                    underlayColor={Color.sandybrown}
                    disabled={!isValidEmail || !email || isLoading}
                >
                    <Text style={styles.buttonText}>Submit</Text>
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
        height: windowHeight,
    },
    loadingBar: {
        height: 3, // You can adjust the height as you like
        backgroundColor: 'transparent',
    },
    backButton: {
        marginTop: windowHeight * 0.03,
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
    },
    warningText: {
        color: Color.sandybrown,
        marginLeft: windowHeight * 0.015,
        marginTop: windowHeight * -0.03,
        marginBottom: windowHeight * 0.0055
    },
    backButtonText: {
        fontSize: 24,
        paddingTop: '6%',
        color: Color.dimgray,
        fontWeight: "900",
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
    label: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.silver,
        fontWeight: "600",
    },
    inputField: {
        color: "#533E41",
        paddingBottom: windowHeight * -0.015,
        marginTop: '-3%'
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
        fontSize: 18,
        letterSpacing: 0.2,
        marginBottom: 30,
        fontWeight: '700',
        textAlign: "left",
    },
    buttonText: {
        fontSize: windowHeight * 0.04,
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

export default ForgotPassword;
