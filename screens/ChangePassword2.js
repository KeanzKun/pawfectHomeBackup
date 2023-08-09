import React from "react";
import { Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const ChangePassword2 = () => {
    const navigation = useNavigation();

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
                            required={true}
                            inputStyle={styles.inputText}
                        />
                    </View>

                    <View style={styles.inputFieldContainer}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <Input
                            required={true}
                            inputStyle={styles.inputText}
                        />
                    </View>
                </View>
                <View style={styles.buttonFrame}>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => navigation.navigate("EmailVerification2")}
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
});

export default ChangePassword2;
