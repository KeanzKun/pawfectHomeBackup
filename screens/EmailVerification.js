import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Text, TouchableOpacity, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";
import { SERVER_ADDRESS } from "../config";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const EmailVerification = ({ route }) => {
    const navigation = useNavigation();
    const { user_email } = route.params;
    const [code, setCode] = useState('');
    const [isExpired, setIsExpired] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userID, setUserID] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false);
    let isSubmittedCount = 0
    //Called by deleteUserRecord, delete user by userID
    const deleteUserById = async (userID) => {
        try {
            console.log('deleteUserById', userID);
            const response = await fetch(`${SERVER_ADDRESS}/api/users/${userID}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('User and related records deleted successfully');
                navigation.navigate('Login'); // Direct to Login
            } else {
                const text = await response.text(); // Read the raw response text
                console.error(text); // Log it
                Alert.alert('Error', 'Error deleting user');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'An error occurred while deleting the user');
        }
    };

    const handleBackPress = async  () => {
        try {
            const userID = await getUserIDBack(); // Get the userID
            console.log('handleBackPress, userID:', userID);
            if (userID) {
                await deleteVerificationRecord(userID);
                await deleteUserById(userID); // Pass userID as an argument
            } else {
                console.error('UserID is null or undefined');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while handling back press');
        }
    };

    const deleteVerificationRecord = (userID) => {
        return new Promise((resolve, reject) => { // Return a promise
            if (user_email) {
                fetch(`${SERVER_ADDRESS}/api/delete-verification-code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user_email }),
                })
                    .then(res => res.ok ? res.json() : Promise.reject('Failed to delete verification code'))
                    .then(data => {
                        console.log(data.message);
                        console.log('deleteVerificationRecord', userID);
                        // Return the promise from deleteUserById
                    })
                    .then(() => resolve()) // Resolve when done
                    .catch(error => {
                        console.error(error);
                        Alert.alert('Error', 'An error occurred while deleting the verification code');
                        reject(error);
                    });
            } else {
                resolve();
            }
        });
    };

    const getUserIDBack = async () => {
        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/registration/getUserID`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user_email }),
            });
            const json = await response.json();

            if (response.ok) {
                const userID = json.userID;
                console.log('Fetched userID:', userID);
                setUserID(userID);
                return userID; // Return the userID
            } else {
                console.error(json.error || 'Error fetching user ID');
                Alert.alert('Error', json.error || 'Error fetching user ID');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'An error occurred while retrieving the user ID');
        }
    }

    const getUserID = async () => {
        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/registration/getUserID`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user_email }),
            });
            const json = await response.json();

            if (response.ok) {
                const userID = json.userID;
                console.log('Setting userID:', userID);
                setUserID(userID);
                await updateUserStatus(userID); // Added await to ensure the function call completes
            } else {
                console.error(json.error || 'Error fetching user ID');
                Alert.alert('Error', json.error || 'Error fetching user ID');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'An error occurred while retrieving the user ID');
        }
    }

    const updateIsSubmitted = () => {

        if (isSubmittedCount === 0) {
            isSubmittedCount = isSubmittedCount + 1
            setIsSubmitted(true)
            handleSubmit()
        }
    }

    const updateUserStatus = async (userIDToUpdate) => {

        console.log('Updating user status for userID:', userIDToUpdate);
        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/update-user_status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ID: userIDToUpdate, userStatus: 'active' }),
            });
            const json = await response.json();

            if (response.ok) {
                navigation.navigate('EmailVerification2');
            } else {
                console.error(json.message || 'Error updating user status');
                //Alert.alert('Error', json.message || 'Error updating user status');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', error);
        }
    }

    useEffect(() => {
        // Add the event listener
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Return a cleanup function to remove the event listener
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };

    }, []);

    const handleSubmit = async () => {
        if (isSubmitted) return; // Prevents multiple submissions
        setIsSubmitted(true);

        if (code.length === 6 && user_email != '') {
            // Make an API call to verify the code
            try {
                const response = await fetch(`${SERVER_ADDRESS}/api/verify-code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, email: user_email }),
                });
                const data = await response.json();

                if (data.verified) {
                    await getUserID(); // Wait for getUserID to finish
                    setIsSubmitted(false);
                    navigation.navigate("EmailVerification2");
                } else {
                    // Check for the code expiration message
                    if (data.message === 'Code has expired') {
                        setIsExpired(true)
                        setIsSubmitted(false)
                        Alert.alert('Failed', 'The verification code has expired. Please request a new code.');
                    } else {
                        setIsSubmitted(false)
                        Alert.alert('Failed', 'Seems like the verification code entered is incorrect, please try again.');
                    }
                }
            } catch (error) {
                setIsSubmitted(false)
                console.error(error);
            }
        } else {
            Alert.alert('Failed', 'Seems like the verification code entered is incorrect, please try again.');
        }
    };

    const handleRequestCode = () => {
        const email = user_email;

        if (user_email) {
            setIsLoading(true);
            // Make API call to check if email exists in the user table
            fetch(`${SERVER_ADDRESS}/api/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
                .then((res) => {
                    if (res.ok) { // Check if response is OK
                        return res.json();
                    } else {
                        throw new Error('Email check failed'); // Throw an error if not OK
                    }
                })
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
                .catch((error) => {
                    console.error(error)
                    Alert.alert('Error', 'An error occurred while checking email');
                });

        }
    };

    return (
        <ScrollView scrollEnabled={false}>
            {isLoading && <LinearLoadingIndicator />}

            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress} // Directly call handleBackPress
            >
                <Text style={styles.backButtonText}>X</Text>
            </TouchableOpacity>

            <View style={[styles.container, { height: windowHeight }]}>

                <View style={{ flex: 2.5 }}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>One more step!</Text>
                        <Text style={styles.subTitleText}>Check the code in your email.</Text>
                    </View>

                    <View style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>Verification Code</Text>
                        <Input
                            placeholder="Code"
                            leftIcon={{ name: "lock", type: "material-community" }}
                            required={true}
                            inputStyle={styles.inputText}
                            onChangeText={value => setCode(value)} // Capture the code
                            value={code}
                        />
                        {isExpired && <View style={styles.requestCodeBtnContainer}>
                            <TouchableOpacity
                                style={styles.requestCodeBtn}
                                onPress={() => handleRequestCode()}
                                underlayColor={Color.transparent}
                            >
                                <Text style={{ color: Color.sandybrown }}>Request a new code</Text>
                            </TouchableOpacity>
                        </View>
                        }
                    </View>

                </View>
                <View style={styles.buttonFrame}>
                    <TouchableOpacity
                        style={isSubmitted ? styles.buttonDisabled : styles.button} // You can define styles for the disabled state
                        onPress={() => {
                            updateIsSubmitted()
                        }} // Call handleSubmit directly
                        underlayColor={Color.sandybrown}
                        disabled={isSubmitted} // Disable the button if isSubmitted is true
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: windowHeight * 0.15,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: '3%',
        alignItems: "flex-start",
    },
    backButton: {
        marginTop: windowHeight * 0.02,
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        marginLeft: '3%',
        backgroundColor: '#FF9E5C',
        alignItems: "center",
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
    titleContainer: {
        marginLeft: windowHeight * 0.01,
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
        fontSize: windowHeight * 0.03,
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

export default EmailVerification;
