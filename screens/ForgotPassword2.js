import React, { useState, useEffect } from "react";
import { BackHandler, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions, Alert } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { SERVER_ADDRESS } from "../config";
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";

const windowHeight = Dimensions.get("window").height;

const ForgotPassword2 = ({ route }) => {
    const navigation = useNavigation();
    const { user_email } = route.params;
    const [code, setCode] = useState('');
    const [isExpired, setIsExpired] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleBackPress = () => {
        if (user_email) {
            fetch(`${SERVER_ADDRESS}/api/delete-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user_email }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.message);
                    navigation.navigate('Login'); // Direct to Login
                })
                .catch((error) => Alert.alert('Error', error));

            return true; // Prevent default behavior
        }
        else {
            navigation.navigate('Login'); // Direct to Login if email is empty
            return true; // Prevent default behavior
        }
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



    const handlerequestCode = () => {
        const email = user_email;

        if (user_email) {
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
                        console.log(user_email)
                        // Call another API to send an email if the email is valid
                        fetch(`${SERVER_ADDRESS}/api/send-email`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email }),
                        }).then(() => {
                            setIsExpired(false)
                            setIsLoading(false)
                        })
                            .catch((err) => console.error(err));
                    }

                })
                .catch((error) => console.error(error))

        }
    };

    const handleSubmit = () => {
        if (code.length === 6 && user_email != '') {
            // Make an API call to verify the code
            fetch(`${SERVER_ADDRESS}/api/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, email: user_email }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.verified) {
                        navigation.navigate("ResetPassword", {user_email: user_email} );
                    } else {
                        // Check for the code expiration message
                        if (data.message === 'Code has expired') {
                            setIsExpired(true)
                            Alert.alert('Failed', 'The verification code has expired. Please request a new code.');
                        } else {
                            Alert.alert('Failed', 'Seems like the verification code entered is incorrect, please try again.');
                        }
                    }
                })
                .catch((error) => console.error(error));
        }
        else {
            Alert.alert('Failed', 'Seems like the verification code entered is incorrect, please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoading && <LinearLoadingIndicator />}
            <View style={styles.screen}>

                <TouchableHighlight
                    style={styles.backButton}
                    onPress={handleBackPress} // Directly call handleBackPress
                >
                    <Text style={styles.backButtonText}>X</Text>
                </TouchableHighlight>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Let us assist you.</Text>
                    <Text style={styles.subTitleText}>Check the code in your email.</Text>
                </View>

                <View style={styles.inputFieldContainer}>
                    <Input
                        placeholder="Code"
                        leftIcon={{ name: "lock", type: "material-community" }}
                        required={true}
                        inputStyle={styles.inputText}
                        onChangeText={value => setCode(value)} // Capture the code
                        value={code}
                    />
                    {isExpired && <View style={styles.requestCodeBtnContainer}>
                        <TouchableHighlight
                            style={styles.requestCodeBtn}
                            onPress={() => handlerequestCode()}
                            underlayColor={Color.transparent}
                        >
                            <Text style={{ color: Color.sandybrown }}>Request a new code</Text>
                        </TouchableHighlight>
                    </View>
                    }

                </View>

            </View>

            <View style={styles.buttonFrame}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={handleSubmit} // Updated to call handleSubmit
                    underlayColor={Color.sandybrown}
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
    requestCodeBtnContainer: {
        alignSelf: "flex-end",
        bottom: 20,
        marginRight: "3%",
    },
    requestCodeBtn: {
        color: "#c7c7c7",
        fontSize: windowHeight * 0.018,
        fontWeight: "600",
        fontFamily: FontFamily.interSemibold,
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
});

export default ForgotPassword2;
