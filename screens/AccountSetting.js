import React from "react";
import { Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, TouchableOpacity, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AccountSetting = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Account Setting</Text>
            </View>

            <View style={{flex: 1}}></View>
            <View style={styles.buttonFrame}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("ChangePassword")}
                        underlayColor={Color.transparent}
                    >
                        <Text style ={{fontSize: 15,fontWeight: '500'}}>Change password</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("EditProfile")}
                        underlayColor={Color.transparent}
                    >
                        <Text style ={{fontSize: 15,fontWeight: '500'}}>View profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Top")}
                        underlayColor={Color.transparent}
                    >
                        <Text style ={{fontSize: 15,fontWeight: '500'}}>Pet listing</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("InitialPage")}
                        underlayColor={Color.transparent}
                    >
                        <Text style={{fontSize: 15,fontWeight: '500',color: Color.sandybrown}}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 2 }}>
                <Text style ={{fontWeight: '800',color: '#E23F29',marginTop: windowHeight * 0.05}}>Delete Account</Text>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: windowWidth * 0.065,
        backgroundColor: "#f5f5f5",
        alignItems: "flex-start",
        height: "100%",
    },
    button: {
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
        flex: 1,
        paddingVertical: windowHeight * 0.025,
    },
    titleText: {
        fontSize: 39,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: "left",
    },
    buttonFrame: {
        flex: 1.8,
        alignItems: "flex-start",
        justifyContent: "space-between",  // Add this line
    },
    buttonContainer: {
        flex: 1,  // Add this line
    },
});

export default AccountSetting;
