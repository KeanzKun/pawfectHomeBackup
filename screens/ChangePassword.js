import React from "react";
import { Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;

const ChangePassword = () => {
    const navigation = useNavigation();

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
                    <Text style={styles.welcomeBackText}>Change Password</Text>
                    <Text style={styles.loginToContinueText}>First, enter your current password</Text>
                </View>

                <View style={styles.usernameFieldContainer}>
                    <Text style={styles.emailLabel}>Current Password</Text>
                    <Input
                        required={true}
                        inputStyle={styles.usernameInput}
                    />
                </View>
            </View>

            <View style={styles.buttonFrame}>
                <TouchableHighlight
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("ChangePassword2")}
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
        height: windowHeight,
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
        flex: 5,
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
    loginToContinueText: {
        fontSize: 18,
        letterSpacing: 0.2,
        marginBottom: 30,
        fontWeight: '700',
        textAlign: "left",
    },
    loginButtonText: {
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

export default ChangePassword;
