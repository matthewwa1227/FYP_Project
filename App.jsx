import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from "./src/screen/HomeScreen.jsx";
import LoginScreen from "./src/screen/LoginScreen.jsx";
import SignupScreen from "./src/screen/SignupScreen.jsx";
import SettingsScreen from "./src/screen/SettingsScreen.jsx";
import KDashboard from "./src/screen/KDashboard.jsx";
import TeacherDashboard from "./src/screen/TeacherDashboard.jsx";
import AdminDashboard from "./src/screen/AdminDashboard.jsx";
import ParentDashboard from "./src/screen/ParentDashboard.jsx";
import FaceDetectionGame from "./src/screen/FaceDetectionGame.jsx";
import SignLanguageGame from "./src/screen/SignLanguageGame.jsx";
import PhonicsGame from "./src/screen/PhonicsGame.jsx";
import CardDetectionGame from "./src/screen/CardDetectionGame.jsx";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />
        <Stack.Screen name="KDASHBOARD" component={KDashboard} />
        <Stack.Screen name="TEACHER_DASHBOARD" component={TeacherDashboard} />
        <Stack.Screen name="ADMIN_DASHBOARD" component={AdminDashboard} />
        <Stack.Screen name="PARENT_DASHBOARD" component={ParentDashboard} />
        <Stack.Screen name="SETTINGS" component={SettingsScreen} />
        <Stack.Screen name="FACE_DETECTION" component={FaceDetectionGame} />
        <Stack.Screen name="SIGN_LANGUAGE" component={SignLanguageGame} />
        <Stack.Screen name="PHONICS" component={PhonicsGame} />
        <Stack.Screen name="CARD_DETECTION" component={CardDetectionGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});