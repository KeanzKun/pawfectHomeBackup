import React, { useState } from "react";
import { Text, Modal, StyleSheet, TouchableOpacity, Pressable, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

    const validateEmail = (email) => {
        // Regular expression to match the standard email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailPattern.test(email)) {
            setEmailValid(true)
            handleEmailChange(email)
        }
        else {
            setEmailValid(false)
        }
    };

    const isCriteriaMet = () => {

        console.log('userName:', userName);
        console.log('userEmail:', userEmail);
        console.log('password:', password);
        console.log('confirmPassword:', confirmPassword);
        console.log('contactNumber:', contactNumber);

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
        if (!isEmailValid || !isUsernameValid || !isPasswordMatch || !isContactNumberValid) {
            setModalMessage("Please meet all the input criteria");
            setModalVisible(true);
            return false;
        }

        return true; // Return true if all fields are filled and validation criteria are met
    };



    const handleEmailChange = async (text) => {

        setUserEmail(text);
        // Make a POST request to the API endpoint to check if email already exists
        try {
            const response = await fetch('http://10.0.2.2:5000/api/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: text.toLowerCase(), // Send email in lowercase
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
        // Only allow alphanumeric characters, underscores, and hyphens
        if (/^[a-zA-Z0-9-_]*$/.test(text)) {
            setUserName(text);
            setUsernameValid(true);
        }
        else
            setUsernameValid(false)
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordMatch(text === confirmPassword);
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setPasswordMatch(password === text);
    };

    const handleContactNumber = (text) => {
        if (text.startsWith("+60")) {
            setContactNumber(text);

            // Use 'text' instead of 'contactNumber'
            if (!/^\+601[0-9]{8,9}$/.test(text)) {
                setContactNumberValid(false)
            }
            else
                setContactNumberValid(true)
        }
    };

    const handleSignUp = async () => {
        if (!isCriteriaMet()) {
            return;
        }

        try {
            const response = await fetch('http://10.0.2.2:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: userName,
                    user_email: userEmail,
                    user_password: password,
                    contact_number: contactNumber,
                    user_status: 'unverified', // or whatever default value you want
                }),
            });

            const json = await response.json();
            if (response.status === 200) {
                setUserName('')
                setUserEmail('')
                setPassword('')
                setConfirmPassword('')
                setContactNumber('')
                navigation.navigate('EmailVerification'); // Navigate on successful signup
            } else {
                alert(json.message); // Alert the user if the sign-up failed
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: '#4c69a5' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={[styles.container, { height: windowHeight }]}>

                <View style={styles.login}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeBackText}>Create Account.</Text>
                        <Text style={styles.loginToContinueText}>Sign Up to continue</Text>
                    </View>

                    <View style={styles.usernameFieldContainer}>
                        <Text style={styles.emailLabel}>Username</Text>
                        <Input
                            required={true}
                            onChangeText={text => {
                                checkUsernameValid(text)
                            }}
                            inputStyle={styles.usernameInput}
                        />
                        {!isUsernameValid && <Text style={styles.warningText}>Special characters allowed: -_</Text>}

                        <Text style={styles.emailLabel}>Email</Text>
                        <Input
                            required={true}
                            onChangeText={validateEmail} // Call the handleEmailChange function
                            inputStyle={styles.usernameInput}
                        />
                        {!isEmailValid && <Text style={styles.warningText}>Please enter a valid email address.</Text>}
                        {isEmailExist && <Text style={styles.warningText}>Email registered.</Text>}

                        <Text style={styles.emailLabel}>Password</Text>
                        <Input
                            required={true}
                            onChangeText={handlePasswordChange} // Call the handlePasswordChange function
                            inputStyle={styles.usernameInput}
                            secureTextEntry={true}
                        />

                        <Text style={styles.emailLabel}>Confirm Password</Text>
                        <Input
                            required={true}
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
                                handleContactNumber(text)
                            }}
                            keyboardType="numeric" // Numeric keyboard
                            inputStyle={styles.usernameInput}
                        />
                        {!isContactNumberValid && <Text style={styles.warningText}>Phone number format should be +60123456789 or +601234567890.</Text>}

                    </View>

                    <View style={styles.redirectSignUp}>
                        <TouchableHighlight
                            style={styles.loginButton}
                            onPress={handleSignUp} // Call handleSignUp when the sign-up button is pressed
                            underlayColor={Color.sandybrown}
                        >
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableHighlight>

                        <Text style={[styles.dontHaveAnText, styles.dontHaveAnTypo]}>
                            Already have an account?
                        </Text>
                        <TouchableHighlight
                            style={styles.signUp}
                            onPress={() => navigation.navigate("Login")}
                            underlayColor={Color.transparent}
                        >
                            <Text style={styles.signUpText}>Login</Text>
                        </TouchableHighlight>
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
