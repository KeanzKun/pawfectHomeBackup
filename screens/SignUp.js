import React, { useState } from "react";
import { Image, Text, Modal, StyleSheet, TouchableOpacity, Pressable, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SERVER_ADDRESS } from '../config';
import { isDisposable } from '../components/IsDisposable'
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";

const windowHeight = Dimensions.get("window").height;

const SignUp = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState("+60");
    const [isEmailValid, setEmailValid] = useState(true);
    const [isPasswordMatch, setPasswordMatch] = useState(true);
    const [isEmailExist, setEmailExist] = useState(false);
    const [isContactNumberValid, setContactNumberValid] = useState(true);
    const [isUsernameValid, setUsernameValid] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDisposableDomain, setIsDisposableDomain] = useState(false);
    const [isContactNumbeExist, setIsContactNumberExist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(true)
    const [userID, setUserID] = useState('')
    const [passwordValid, setPasswordValid] = useState(true);

    const resetForm = () => {
        setUserName('');
        setUserEmail('');
        setPassword('');
        setConfirmPassword('');
        setContactNumber("+60");
        setEmailValid(true);
        setPasswordMatch(true);
        setEmailExist(false);
        setContactNumberValid(true);
        setUsernameValid(true);
        setModalVisible(false);
        setModalMessage('');
        setIsDisposableDomain(false);
        setIsContactNumberExist(false);
        setIsLoading(false);
        setEmailSent(true);
        setUserID('');
    };

    useFocusEffect(
        React.useCallback(() => {
            resetForm();
        }, [])
    );


    const validateEmail = async (email) => {
        setUserEmail(email)
        setEmailValid(true)
        setIsDisposableDomain(false)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailPattern.test(email)) {
            // Check if the email is disposable
            if (await isDisposable(email)) {
                setIsDisposableDomain(true)
                return;
            }
            setIsDisposableDomain(false);
            setEmailValid(true);
            handleEmailChange(email);
        }
        else {
            setEmailValid(false);
        }
    };

    const isCriteriaMet = async () => {

        // Check if any fields are empty
        if (userName.trim() === '' ||
            userEmail.trim() === '' ||
            password.trim() === '' ||
            confirmPassword.trim() === '' ||
            contactNumber.trim() === '') {
            setModalMessage("Please fill in all fields");
            setModalVisible(true);
            return false;
        }

        // If fields are filled, check validation criteria
        if (!isEmailValid || !passwordValid || (isEmailExist) || isContactNumbeExist || !isUsernameValid || !isPasswordMatch || !isContactNumberValid || isDisposableDomain) {
            setModalMessage("Please meet all the input criteria");
            setModalVisible(true);
            return false;
        }

        const disposable = await isDisposableMail(userEmail);
        console.log('DISPOSABLE RETURN VALUE:', disposable);

        if (disposable) {
            console.log('DISPOSABLE RETURN VALUE: ' + isDisposableMail(userEmail))
            console.log('ISDISPOSABLEMAIL FUNCTION RAN');
            setIsDisposableDomain(true);
            setModalMessage("Disposable email not allowed.");
            setModalVisible(true);
            return;
        }

        return true; // Return true if all fields are filled and validation criteria are met
    };

    const isDisposableMail = async (email) => {
        const domain = email.split('@')[1]; // Extract the domain from the email
        try {
            console.log('API CALLED')
            const response = await fetch(`https://api.mailcheck.ai/domain/${domain}`);
            const data = await response.json();

            console.log('Parsed Data:', data);

            console.log('DATA: ' + data.disposable);
            return data.disposable; // This will return true if the domain is disposable, false otherwise
        } catch (error) {
            console.error("Error checking if email is disposable:", error);
            return false; // Default to not disposable if there's an error
        }
    };

    const validateContactNumber = async (text) => {
        if (text.startsWith("+60")) {
            setContactNumber(text);

            // Use 'text' instead of 'contactNumber'
            if (!/^\+601[0-9]{8,9}$/.test(text)) {
                setContactNumberValid(false)
                setIsContactNumberExist(false);
            }
            else {
                setContactNumberValid(true)
                setIsContactNumberExist(false);
                handleContactNumber(text)
            }
        }
    }

    const handleContactNumber = async (text) => {
        setContactNumber(text); // This still updates the state, but we don't rely on it for the request

        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/check-contactNumber`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactNumber: text, // Use the text parameter instead of the state variable
                }),
            });

            const json = await response.json();

            if (json.exists) {
                setIsContactNumberExist(true);
            }

        } catch (error) {
            console.error("An error occurred while checking the contact number:", error);
        }
    };



    const handleEmailChange = async (text) => {
        setUserEmail(text);
        setEmailExist(false);
        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: text.toLowerCase(),
                }),
            });

            const json = await response.json();

            if (json.exists) {
                setEmailExist(true);

            }
        } catch (error) {
            console.error("An error occurred while checking the email:", error);
        }
    };


    const checkUsernameValid = (text) => {
        // Only allow alphanumeric characters, underscores, hyphens, and spaces
        if (/^[a-zA-Z0-9-_ ]*$/.test(text)) {
            setUserName(text);
            setUsernameValid(true);
        }
        else
            setUsernameValid(false)
    }


    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordValid(isPasswordValid(text));
        console.log(isPasswordValid(text))
        setPasswordMatch(text === confirmPassword);
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setPasswordMatch(password === text);
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_.,<>[\]])[A-Za-z\d@$!%*?&#_.,<>[\]]{8,}$/;
        return regex.test(password);
    };


    //Called by handleSignUp, send verification code to user
    const handleRequestCode = () => {
        const email = userEmail;
        console.log(userEmail)
        if (userEmail) {
            setIsLoading(true);
            fetch(`${SERVER_ADDRESS}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
                .then(() => {
                    setEmailSent(true)
                }).catch((err) => {
                    setEmailSent(false)
                    Alert.alert('Error', 'Failed to send verification email. Please try again.');
                });
        }
    }


    //called when user click signup button
    const handleSignUp = async () => {

        if (!isCriteriaMet()) {
            return;
        }

        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: userName,
                    user_email: userEmail,
                    user_password: password,
                    contact_number: contactNumber,
                    user_status: 'unverified',
                }),
            });

            const json = await response.json();
            if (response.status === 200) {
                handleRequestCode();
                if (emailSent) {
                    navigation.navigate('EmailVerification', { user_email: userEmail, userID: userID });
                } else {
                    Alert.alert('Error', 'Failed to send verification email. Please try again.');
                }
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: '#f5f5f5', height: '100%' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <Image source={require('../assets/icon/cat-typing.gif')} style={{ width: '28%', height: '8%', marginBottom: '3%' }} />
                    <Text style={{ color: Color.sandybrown, fontSize: 20 }}>Please wait while our furry staff</Text>
                    <Text style={{ color: Color.sandybrown, fontSize: 20, marginBottom: '5%' }}>working on it...</Text>
                    <View style={{ width: '50%', overflow: 'hidden' }}>
                        <LinearLoadingIndicator></LinearLoadingIndicator>
                    </View>
                </View>
            )}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Error!</Text>
                        <Text style={{ textAlign: 'center', marginTop: '5%' }}>{modalMessage}</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={[styles.container, { flex: 1, height: windowHeight }]}>

                <View style={styles.login}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeBackText}>Create Account.</Text>
                        <Text style={styles.loginToContinueText}>Sign Up to continue</Text>
                    </View>

                    <View style={styles.usernameFieldContainer}>
                        <Text style={styles.emailLabel}>Username</Text>
                        <Input
                            value={userName}
                            required={true}
                            autoCapitalize="none"
                            onChangeText={text => {
                                checkUsernameValid(text)
                            }}
                            inputStyle={styles.usernameInput}
                        />
                        {!isUsernameValid && <Text style={styles.warningText}>Special characters allowed: -_</Text>}

                        <Text style={styles.emailLabel}>Email</Text>
                        <Input
                            value={userEmail}
                            autoCapitalize="none"
                            required={true}
                            onChangeText={text => validateEmail(text)} // async call is inside the function
                            inputStyle={styles.usernameInput}
                        />
                        {!isEmailValid && <Text style={styles.warningText}>Please enter a valid email address.</Text>}
                        {(isEmailExist) && <Text style={styles.warningText}>Email registered.</Text>}
                        {isDisposableDomain && <Text style={styles.warningText}>Disposable email not allowed.</Text>}
                        <Text style={styles.emailLabel}>Password</Text>
                        <Input
                            value={password}
                            required={true}
                            autoCapitalize="none"
                            onChangeText={handlePasswordChange}
                            inputStyle={styles.usernameInput}
                            secureTextEntry={true}
                        />
                        {!passwordValid && <Text style={styles.warningText}>Password must be at least 8 characters, contain 1 number, 1 special character, and 1 capital letter.</Text>}


                        <Text style={styles.emailLabel}>Confirm Password</Text>
                        <Input
                            value={confirmPassword}
                            required={true}
                            autoCapitalize="none"
                            onChangeText={handleConfirmPasswordChange} // Call the handleConfirmPasswordChange function
                            inputStyle={styles.usernameInput}
                            secureTextEntry={true}
                        />
                        {!isPasswordMatch && <Text style={styles.warningText}>Passwords do not match.</Text>}

                        <Text style={styles.emailLabel}>Contact number</Text>
                        <Input
                            required={true}
                            value={contactNumber} // "+60" prefix is already included in the state
                            onChangeText={text => {
                                validateContactNumber(text)
                            }}
                            keyboardType="numeric" // Numeric keyboard
                            inputStyle={styles.usernameInput}
                        />
                        {!isContactNumberValid && <Text style={styles.warningText}>Phone number format should be +60123456789 or +601234567890.</Text>}
                        {isContactNumbeExist && <Text style={styles.warningText}>Phone number registered.</Text>}

                    </View>

                    <View style={styles.redirectSignUp}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleSignUp} // Call handleSignUp when the sign-up button is pressed
                            underlayColor={Color.sandybrown}
                        >
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <Text style={[styles.dontHaveAnText, styles.dontHaveAnTypo]}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity
                            style={styles.signUp}
                            onPress={() => navigation.navigate("Login")}
                            underlayColor={Color.transparent}
                        >
                            <Text style={styles.signUpText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        paddingTop: windowHeight * 0.03,
        height: "100%",
    },
    login: {
        flex: 1,
        width: "90%",
        alignItems: "flex-start",
    },
    modalText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: 'center',
    },
    modalButtonText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.3,
        color: Color.white,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "800",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        width: '75%',
        height: '25%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 30
    },
    modalButton: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        width: '40%',
        height: '30%',
        marginTop: '13%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    welcomeContainer: {
        flex: 0.3,
        marginLeft: windowHeight * 0.01,
    },
    warningText: {
        color: Color.sandybrown,
        marginLeft: windowHeight * 0.015,
        marginTop: windowHeight * -0.03,
        marginBottom: windowHeight * 0.0055
    },
    welcomeBackText: {
        fontSize: 36,
        letterSpacing: 0.9,
        marginBottom: windowHeight * 0.004,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: "left",
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent white background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure it's on top
    },
    loginToContinueText: {
        fontSize: 18,
        letterSpacing: 0.2,
        marginBottom: 30,
        fontWeight: '700',
        textAlign: "left",
    },
    usernameFieldContainer: {
        flex: 1.9,
        width: "100%",
    },
    emailLabel: {
        marginLeft: windowHeight * 0.015,
        fontSize: 16,
        color: Color.silver,
        fontWeight: "600",
    },
    usernameInput: {
        color: Color.dimgray,
        marginTop: -(windowHeight * 0.009), // Adjust the margin bottom as desired
        paddingBottom: -(windowHeight * 0.018),
    },
    loginButton: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        width: "70%",
        height: windowHeight * 0.08,
        paddingHorizontal: windowHeight * 0.04,
        paddingVertical: windowHeight * 0.01,
        marginBottom: windowHeight * 0.03,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    loginButtonText: {
        fontSize: windowHeight * 0.035,
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
    signUpText: {
        fontSize: windowHeight * 0.018,
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: 0.1,
        color: Color.sandybrown,
        fontFamily: FontFamily.interSemibold,
        fontWeight: "600",
        marginTop: 5,
    },
    dontHaveAnText: {
        fontSize: windowHeight * 0.018,
        letterSpacing: 0.1,
        marginRight: 5,
    },
    dontHaveAnTypo: {
        textAlign: "center",
        color: Color.silver,
        fontFamily: FontFamily.interSemibold,
        fontWeight: "600",
    },
});

export default SignUp;
