import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View, Text, Pressable, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const InitialPage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to determine if the screen is currently focused
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token != null) {
        navigation.navigate('Main'); // Navigate to the main screen if the token exists
      }
      else
        setIsLoading(false);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Handle the back button press event
    const handleBackPress = () => {
      BackHandler.exitApp(); // Exit the app
      return true; // Prevent default behavior
    };

    // Add the event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Return a cleanup function to remove the event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useEffect(() => {
    if (isFocused) { // If the screen is focused, check the login status
      checkLoginStatus();
    }
  }, [isFocused]); // Re-run the effect when the focus state changes


  if (!isLoading) {
    return (

        <View style={[styles.container]}>
          <View style={styles.topSection}>
            <Text style={styles.LogoTypo}>Pawfect Home.</Text>
          </View>
          <View style={styles.bottomSection}>
            <View style={{ flex: 0.3 }}></View>
            <View style={styles.quoteContainer}>
              <Text style={styles.adoptLoveAndText}>Adopt, love,</Text>
              <Text style={styles.adoptLoveAndText}>and make a</Text>
              <Text style={styles.pawfectHomeText}>Pawfect Home.</Text>
              <Text style={styles.sayNoToText}>Say no to buying pets</Text>
            </View>
            <View style={{ flex: 0.3 }}></View>
            <View style={styles.buttonContainer}>
              <TouchableHighlight
                style={[styles.loginLayout]}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.login1Typo}>Login</Text>
              </TouchableHighlight>
              <TouchableHighlight style={[styles.loginLayout]}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.login1Typo}>SignUp</Text>
              </TouchableHighlight>
            </View>
            <View style={{ flex: 0.3 }}></View>
          </View>
        </View>

    );
  }
  else {
    return (
      <View style={styles.loadingScreenContainer}>
        <Text style={styles.loadingScreen}>Pawfect Home.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  loadingScreen: {
    color: Color.sandybrown,
    fontSize: windowHeight * 0.05,
    fontFamily: FontFamily.latoExtrabold,
    fontWeight: "900",
    textAlign: "center",
  },
  loadingScreenContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  LogoTypo: {
    color: Color.white,
    fontSize: windowHeight * 0.06,
    fontFamily: FontFamily.latoExtrabold,
    fontWeight: "900",
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FF9E5C",
    justifyContent: "center",
    height: '100%',
    alignItems: "flex-start"
  },
  topSection: {
    width: "100%",
    flex: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    flex: 60,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    alignItems: "center",

  },
  loginLayout: {
    height: windowHeight * 0.07,
    width: '60%',
    backgroundColor: Color.sandybrown,
    borderRadius: windowHeight * 0.07 * 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  login1Typo: {
    fontSize: windowHeight * 0.03,
    fontWeight: "800",
    color: "white",
  },
  quoteContainer: {
    flex: 1,
    width: "90%",
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  adoptLoveAndText: {
    color: '#533E41',
    fontSize: windowHeight * 0.039,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "900",
    textAlign: "center",
  },
  pawfectHomeText: {
    color: Color.sandybrown,
    fontSize: windowHeight * 0.039,
    fontFamily: FontFamily.latoExtrabold,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  sayNoToText: {
    color: "#adadad",

    fontSize: windowHeight * 0.02,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    textAlign: "center",
  },

});

export default InitialPage;
