import * as React from "react";
import { Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from "./screens/Login";
import SignUpEnterEmail from "./screens/SignUpEnterEmail";
import InitialPage from "./screens/InitialPage";
import SignUp from "./screens/SignUp";
import EmailVerification from "./screens/EmailVerification";
import EmailVerification2 from "./screens/EmailVerification2";
import EditProfile from "./screens/EditProfile";
import ChangePassword from "./screens/ChangePassword";
import ChangePassword2 from "./screens/ChangePassword2";
import ForgotPassword from "./screens/ForgotPassword";
import ForgotPassword2 from "./screens/ForgotPassword2";
import ResetPassword from "./screens/ResetPassword";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/Profile";
import VetScreen from "./screens/VetScreen";
import MissingPetScreen from "./screens/MissingPet";
import AccountSetting from "./screens/AccountSetting";
import PetListingActiveScreen from "./screens/PetListingActiveScreen";
import PetListingHistoryScreen from "./screens/PetListingHistoryScreen";
import CustomHeader from "./components/CustomHeader";
import CreateListing from "./screens/CreateListing";
import CreateListing2 from "./screens/CreateListing2";
import CreateListing3 from "./screens/CreateListing3";
import PetDetails from "./screens/PetDetails";
import VetDetails from "./screens/VetDetails";
import MissingPetDetails from "./screens/MissingPetDetails";
import PetListingDetails from "./screens/PetListingDetails";
import PetListingHistoryDetails from "./screens/PetListingHistoryDetails";
import PasswordChanged from "./screens/PasswordChanged";
import DeleteAccount from "./screens/DeleteAccount";
import DeleteAccount2 from "./screens/DeleteAccount2";
import DeleteAccount3 from "./screens/DeleteAccount3";
import { Color, FontFamily } from './GlobalStyles'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const TopTab = createMaterialTopTabNavigator(); // New declaration

const windowHeight = Dimensions.get("window").height;

const TopTabNavigator = () => {

  return (
    <TopTab.Navigator
      initialRouteName="PetListingActiveScreen"
      screenOptions={{
        tabBarActiveTintColor: '#ff9e5c',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: '#ff9e5c',
        },
      }}
    >
      <TopTab.Screen name="PetListingActiveScreen" component={PetListingActiveScreen} options={{ tabBarLabel: 'Active' }} />
      <TopTab.Screen name="PetListingHistoryScreen" component={PetListingHistoryScreen} options={{ tabBarLabel: 'History' }} />
    </TopTab.Navigator>);
}


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarPosition='bottom'
      screenOptions={{
        tabBarActiveTintColor: '#FF9E5C',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: windowHeight * 0.016,
          textTransform: 'none', // Add this line to avoid uppercase text
        },
        tabBarIndicatorStyle: {
          height: 0,
        },
        tabBarPressColor: 'transparent',
        tabBarStyle: {
          marginBottom: '-1%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#533E41',
        }
      }}
    >
      
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw" color={color} size={windowHeight * 0.03} />
          ),
        }}
      />
      <Tab.Screen name="VetScreen" component={VetScreen} options={{
        tabBarLabel: 'Vet', tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="hospital-marker" color={color} size={windowHeight * 0.03} />
        ),
      }} />
      <Tab.Screen name="MissingPet" component={MissingPetScreen} options={{
        tabBarLabel: 'Missing Pet', tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="crosshairs-question" color={color} size={windowHeight * 0.03} />
        ),
      }} />
      <Tab.Screen name="AccountSetting" component={AccountSetting} options={{
        tabBarLabel: 'Account', tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-circle" color={color} size={windowHeight * 0.03} />
        ),
      }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InitialPage" component={InitialPage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUpEnterEmail" component={SignUpEnterEmail} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="EmailVerification2" component={EmailVerification2} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangePassword2" component={ChangePassword2} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreateListing" component={CreateListing} />
        <Stack.Screen name="CreateListing2" component={CreateListing2} />
        <Stack.Screen name="CreateListing3" component={CreateListing3} />
        <Stack.Screen name="PetDetails" component={PetDetails} />
        <Stack.Screen name="VetDetails" component={VetDetails} />
        <Stack.Screen name="MissingPetDetails" component={MissingPetDetails} />
        <Stack.Screen name="PetListingDetails" component={PetListingDetails} />
        <Stack.Screen name="PetListingHistoryDetails" component={PetListingHistoryDetails} />
        <Stack.Screen name="PasswordChanged" component={PasswordChanged} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="DeleteAccount2" component={DeleteAccount2} />
        <Stack.Screen name="DeleteAccount3" component={DeleteAccount3} />

        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="Top" component={TopTabNavigator} options={{
          headerShown: true,
          header: () => <CustomHeader title="Pet Listing" />
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
