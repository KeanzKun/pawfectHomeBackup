import React, {useEffect} from "react";
import { BackHandler, Text, StyleSheet, Pressable, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";

const windowHeight = Dimensions.get("window").height;

const CreateListing3 = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle the back button press event
    const handleBackPress = () => {
      navigation.navigate('HomeScreen'); // Exit the app
      return true; // Prevent default behavior
    };

    // Add the event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Return a cleanup function to remove the event listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.login}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeBackText}>Pawfect!</Text>
          <Text style={styles.loginToContinueText}>You may view your listing in</Text>
          <Text style={styles.loginToContinueText}>Account Setting -&gt; Listing</Text>
        </View>

        <View style={styles.redirectSignUp}>
          <TouchableHighlight
            style={styles.loginButton}
            onPress={() => navigation.navigate("AccountSetting")}
            underlayColor={Color.sandybrown}
          >
            <Text style={styles.loginButtonText}>Yay!</Text>
          </TouchableHighlight>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    alignItems: "center",    
    height: "100%",
    
  },
  login: {
    flex: 1,
    width: "90%",
    justifyContent: "center", // Add justifyContent property
  },
  welcomeContainer: {
    marginLeft: windowHeight * 0.01,
    marginBottom: windowHeight * 0.05,
  },
  welcomeBackText: {
    fontSize: 39,
    letterSpacing: 0.4,
    color: Color.dimgray,
    fontWeight: '900',
    textAlign: "center", 
  },
  loginToContinueText: {
    fontSize: 23,
    letterSpacing: 0.2,
    fontWeight: '700',
    textAlign: "center", 
  },
  centeredText: {
    textAlign: "center",
  },
  usernameFieldContainer: {
    width: "100%",
  },
  emailLabel: {
    marginLeft: windowHeight * 0.015,
    fontSize: 16,
    marginBottom: 5,
    color: Color.silver,
    fontWeight: "600",
  },
  usernameInput: {
    color: "#c7c7c7",
  },
  loginButton: {
    borderRadius: 87,
    backgroundColor: Color.sandybrown,
    width: "70%",
    height: windowHeight * 0.09,
    paddingHorizontal: windowHeight * 0.04,
    marginBottom: windowHeight * 0.03, // Add margin bottom
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loginButtonText: {
    fontSize: windowHeight * 0.025,
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

export default CreateListing3;
