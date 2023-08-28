import React, { useState, useEffect } from "react";
import { Image, BackHandler, Modal, Text, StyleSheet, Pressable, TouchableOpacity, View, ScrollView, TouchableHighlight, Dimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily } from "../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_ADDRESS } from '../config';
import { fetchUserDetails } from "../components/UserService";
import LinearLoadingIndicator from "../components/LinearLoadingIndicator";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Login = () => {
  const navigation = useNavigation();

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
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

  // Function to handle login
  const handleLogin = async () => {
    setIsLoadingVisible(true);

    try {
      const response = await fetch(`${SERVER_ADDRESS}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          password: password,
        }),
      });

      const json = await response.json();
      if (response.status === 200) {
        const userStatus = json.user.user_status;

        if (userStatus === 'unverified') {
          // Send verification email and navigate to EmailVerification
          fetch(`${SERVER_ADDRESS}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
          })
            .then(() => {
              navigation.navigate('EmailVerification', { user_email: userEmail });
              setIsLoadingVisible(false); // Hide the loading screen when done
            })
            .catch((err) => {
              console.error(err);
              Alert.alert('Error', 'Failed to send verification email. Please try again.');
              setIsLoadingVisible(false);
            });
        } else if (userStatus === 'banned') {
          setModalMessage('Login failed, please contact customer service');
          setModalVisible(true);
          setIsLoadingVisible(false);
        } else if (userStatus === 'active') {
          // Store the token and navigate to Main
          await AsyncStorage.setItem('token', json.token);

          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          setModalMessage('Unexpected user status. Please contact support.');
          setModalVisible(true);
          setIsLoadingVisible(false);
        }
      } else {
        setModalMessage(json.message);
        setModalVisible(true);
        setIsLoadingVisible(false);
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
        visible={isLoadingVisible}
        onRequestClose={() => {
          setIsLoadingVisible(false);
        }}
      >
        <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/icon/cat-typing.gif')} style={{ width: '28%', height: '8%', marginBottom: '3%' }} />
            <Text style={{ color: Color.sandybrown, fontSize: 20 }}>Please wait while our furry staff</Text>
            <Text style={{ color: Color.sandybrown, fontSize: 20, marginBottom: '5%' }}>working on it...</Text>
            <View style={{ width: '50%', overflow: 'hidden' }}>
              <LinearLoadingIndicator></LinearLoadingIndicator>
            </View>
          </View>
        </View>
      </Modal>

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
              autoCapitalize="none"
              onChangeText={text => setUserEmail(text)}
              leftIcon={{ name: "email", type: "material-community" }} // Updated icon
              inputStyle={styles.usernameInput}
            />
          </View>

          <View style={styles.passwordFieldContainer}>
            <Input
              placeholder="Password"
              required={true}
              autoCapitalize="none"
              onChangeText={text => setPassword(text)}
              leftIcon={{ name: "lock", type: "material-community" }}
              inputStyle={styles.passwordInput}
              secureTextEntry={true} // Hide the password input
            />
          </View>

          <View style={styles.forgotPasswordBtnContainer}>
            <TouchableOpacity
              style={styles.forgotPasswordBtn}
              onPress={() => navigation.navigate("ForgotPassword")}
              underlayColor={Color.transparent}
            >
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
          </View>


        </View>

        <View style={styles.buttonFrame}>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin} // Call handleLogin when the login button is pressed
            underlayColor={Color.sandybrown}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.redirectSignUp}>

          <Text style={[styles.dontHaveAnText, styles.dontHaveAnTypo]}>
            Don't have an account yet?
          </Text>

          <TouchableOpacity
            style={styles.signUp}
            onPress={() => navigation.navigate("SignUp")}
            underlayColor={Color.transparent}
          >
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>

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
    height: '25%',
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
