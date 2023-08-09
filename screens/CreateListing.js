import React from "react";
import { Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const windowHeight = Dimensions.get("window").height;

const SignUp = () => {
    const navigation = useNavigation();

    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: '#4c69a5', flex:1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <View style={[styles.container, { height: windowHeight }]}>

                <View style={styles.login}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeBackText}>Create Listing.</Text>
                        <Text style={styles.loginToContinueText}>Your pet deserves second home</Text>
                    </View>

                    <View style={styles.usernameFieldContainer}>
                        <Text style={styles.emailLabel}>Animal Species</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Breed</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Pet's name</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Pet's born date</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Adoption Fee</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Location</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <Text style={styles.emailLabel}>Listing type</Text>
                        <Input
                            required={true}
                            inputStyle={styles.usernameInput}
                        />

                        <TouchableHighlight
                            style={styles.loginButton}
                            onPress={() => navigation.navigate("CreateListing2")}
                            underlayColor={Color.sandybrown}
                        >
                            <Text style={styles.loginButtonText}>Next</Text>
                        </TouchableHighlight>

                    </View>

                    
                </View>
                <View style={styles.redirectSignUp}>
                    
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
    },
    login: {
        flex: 13,
        width: "90%",
        alignItems: "flex-start",
    },
    welcomeContainer: {
        flex: 0.3,
        marginLeft: windowHeight * 0.01,
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
        marginTop: windowHeight * 0.03,
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
        flex: 2,
        backgroundColor: "#f5f5f5",
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
