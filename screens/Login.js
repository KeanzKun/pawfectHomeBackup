import React, { useState } from "react";
import { Modal, Text, StyleSheet, Pressable, TouchableOpacity, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_ADDRESS } from '../config'; 


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Login = () => {
  const navigation = useNavigation();

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch(`${SERVER_ADDRESS}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail, // Use the userEmail state variable
          password: password,
        }),
      });

      const json = await response.json();
      if (response.status === 200) {
        // Store the token
        await AsyncStorage.setItem('token', json.token);

        navigation.navigate('Main'); // Navigate to the main screen on successful login
      } else {
        setModalMessage(json.message); // Set the message
        setModalVisible(true); // Show the modal
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <ScrollView scrollEnabled={false}>

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

        <View style={{ flex: 2.5 }}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeBackText}>Welcome Back!</Text>
            <Text style={styles.loginToContinueText}>Login to continue</Text>
          </View>

          <View style={styles.usernameFieldContainer}>
            <Input
              placeholder="Email" // Updated placeholder
              required={true}
              onChangeText={text => setUserEmail(text)}
              leftIcon={{ name: "email", type: "material-community" }} // Updated icon
              inputStyle={styles.usernameInput}
            />
          </View>

          <View style={styles.passwordFieldContainer}>
            <Input
              placeholder="Password"
              required={true}
              onChangeText={text => setPassword(text)}
              leftIcon={{ name: "lock", type: "material-community" }}
              inputStyle={styles.passwordInput}
              secureTextEntry={true} // Hide the password input
            />
          </View>

          <View style={styles.forgotPasswordBtnContainer}>
            <TouchableHighlight
              style={styles.forgotPasswordBtn}
              onPress={() => navigation.navigate("ForgotPassword")}
              underlayColor={Color.transparent}
            >
              <Text>Forgot Password?</Text>
            </TouchableHighlight>
          </View>


        </View>

        <View style={styles.buttonFrame}>

          <TouchableHighlight
            style={styles.loginButton}
            onPress={handleLogin} // Call handleLogin when the login button is pressed
            underlayColor={Color.sandybrown}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.redirectSignUp}>

          <Text style={[styles.dontHaveAnText, styles.dontHaveAnTypo]}>
            Don't have an account yet?
          </Text>

          <TouchableHighlight
            style={styles.signUp}
            onPress={() => navigation.navigate("SignUp")}
            underlayColor={Color.transparent}
          >
            <Text style={styles.signUpText}>Sign up</Text>
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
    paddingTop: windowHeight * 0.1,
    paddingHorizontal: windowWidth * 0.06,
    flex: 6,
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
    height:'25%',
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
    marginLeft: windowHeight * 0.01,
    marginTop: windowHeight * 0.06, // Adjust the margin as needed
    marginBottom: windowHeight * 0.07, // Adjust the margin as needed

  },
  welcomeBackText: {
    fontSize: 39,
    letterSpacing: 0.4,
    color: Color.dimgray,
    fontWeight: '900',
    textAlign: "left",
  },
  loginToContinueText: {
    fontSize: 23,
    letterSpacing: 0.2,
    marginBottom: 30,
    fontWeight: '700',
    textAlign: "left",
  },
  usernameFieldContainer: {
    width: windowWidth * 0.935,
  },
  usernameInput: {
    color: Color.dimgray,
  },
  passwordFieldContainer: {
    width: windowWidth * 0.935,
  },
  passwordInput: {
    color: Color.dimgray,
  },
  forgotPasswordBtnContainer: {
    alignSelf: "flex-end",
    bottom: 20,
    marginRight: "3%",
  },
  forgotPasswordBtn: {
    color: "#c7c7c7",
    fontSize: windowHeight * 0.018,
    fontWeight: "600",
    fontFamily: FontFamily.interSemibold,
  },
  loginButton: {
    borderRadius: 87,
    backgroundColor: Color.sandybrown,
    width: '60%',
    height: windowHeight * 0.09,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loginButtonText: {
    fontSize: windowHeight * 0.04,
    letterSpacing: 0.3,
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
  },
  redirectSignUp: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.02,
    position: "absolute",
    bottom: windowHeight * 0.07,
    width: "100%",
  },
  buttonFrame: {
    flex: 1,
    alignItems: "center",
    width: windowWidth,
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

export default Login;
