import React from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PetListingActiveScreen from "./PetListingActiveScreen";
import PetListingHistoryScreen from "./PetListingHistoryScreen";

const DATA = [
    { id: '1', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Second Item', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '4', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '5', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '6', title: 'First Item', image: 'https://via.placeholder.com/150' },
    { id: '7', title: 'First Item', image: 'https://via.placeholder.com/150' },

    // add more items here...
];
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const TopTab = createMaterialTopTabNavigator();

const PetListingActive = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate("AccountSetting")} // Navigate back to the previous screen
                >
                    <Text style={styles.backButtonText}>&lt;</Text>
                </TouchableOpacity>

                <Text style={styles.titleText}>Listing</Text>
                <View />
            </View>

            <TopTab.Navigator
                initialRouteName="Active"
                screenOptions={{
                    tabBarActiveTintColor: '#ff9e5c',
                    tabBarInactiveTintColor: 'gray',
                    tabBarIndicatorStyle: {
                        backgroundColor: '#ff9e5c',
                    },
                }}
            >
                <TopTab.Screen name="Active" component={PetListingActiveScreen} />
                <TopTab.Screen name="History" component={PetListingHistoryScreen} />
            </TopTab.Navigator>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: windowWidth * 0.03,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: windowHeight * 0.03,
    },
    backButton: {
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        borderRadius: 20,
        backgroundColor: '#FF9E5C',
        alignItems: "center",
        justifyContent: 'center',  // Add this line to center the "<" icon
    },
    backButtonText: {
        fontSize: 24,
        color: Color.dimgray,
        fontWeight: "700",
    },
    item: {
        height: windowHeight * 0.25,
        width: windowWidth * 0.42,
        marginBottom: windowWidth * 0.045,
        marginLeft: windowWidth * 0.03,
        marginRight: windowWidth * 0.03,
        borderRadius: 30,
        overflow: 'hidden', // Add this line
    },
    itemImage: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    titleText: {
        fontSize: 33,
        letterSpacing: 0.4,
        marginRight: windowWidth * 0.08,
        color: Color.dimgray,
        fontWeight: '900',
    },
    itemTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
    },
});

export default PetListingActive;