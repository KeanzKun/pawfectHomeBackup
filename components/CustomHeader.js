import React from 'react';
import { View, Text, Button, TouchableOpacity,StyleSheet,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily } from "../GlobalStyles";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const CustomHeader = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("AccountSetting")} // Navigate back to the previous screen
            >
                <Text style={styles.backButtonText}>&lt;</Text>
            </TouchableOpacity>
            <Text style={styles.titleText}>Pet Listing</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: windowHeight * 0.095,
        paddingHorizontal: windowWidth * 0.055,
        paddingVertical: windowHeight * 0.009,
        backgroundColor: "white",
        alignItems: "center",
    },
    backButton: {
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
    titleText: {
        fontSize: 33,
        letterSpacing: 0.4,
        marginRight: windowWidth * 0.08,
        color: Color.dimgray,
        fontWeight: '900',
        marginLeft: windowWidth * 0.145
    },
});
export default CustomHeader;
