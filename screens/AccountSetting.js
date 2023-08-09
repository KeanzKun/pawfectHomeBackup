import React, { useState } from "react";
import { Modal, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, TouchableOpacity, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AccountSetting = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const logOut = async () => {
        await AsyncStorage.removeItem('token'); // Remove the token from storage
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to Log out?</Text>

                        <View style= {styles.modalButtonContainer}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>No</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    logOut();
                                    setModalVisible(false)
                                    navigation.navigate("InitialPage"); // Navigate to the initial page after logging out
                                }}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>Yes, Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Account Setting</Text>
            </View>

            <View style={{ flex: 1 }}></View>
            <View style={styles.buttonFrame}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("ChangePassword")}
                        underlayColor={Color.transparent}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>Change password</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("EditProfile")}
                        underlayColor={Color.transparent}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>View profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Top")}
                        underlayColor={Color.transparent}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '500' }}>Pet listing</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            setModalVisible(true); // Show the modal
                        }}
                        underlayColor={Color.transparent}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '500', color: Color.sandybrown }}>Log out</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ flex: 2 }}>
                <Text style={{ fontWeight: '800', color: '#E23F29', marginTop: windowHeight * 0.05 }}>Delete Account</Text>
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
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        
    },
    modalText: {
        fontSize: windowHeight * 0.03,
        letterSpacing: 0.4,
        color: Color.dimgray,
        fontWeight: '900',
        textAlign: 'center',
    },
    modalButtonText: {
        fontSize: windowHeight * 0.02,
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
        padding: '5%',
        borderRadius: 30
    },
    modalButton: {
        borderRadius: 87,
        backgroundColor: Color.sandybrown,
        marginHorizontal: '5%',
        marginBottom : '3%',
        width: '40%',
        height: '30%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
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
