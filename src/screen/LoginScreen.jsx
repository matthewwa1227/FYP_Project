import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Handle login function
  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      // Here you would typically make an API call to authenticate the user
      // For this example, we'll mock a successful login with some test credentials
      if (email === 'test@example.com' && password === 'password123') {
        Alert.alert('Success', 'Login successful!');
        // Navigate to your main app screen after successful login
        // navigation.navigate("MAIN_APP");
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/cat.png")} 
        style={styles.catImage} 
      />
      
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={"black"}
          size={30}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your email" 
            placeholderTextColor={colors.secondary} 
            keyboardType='email-address'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            onBlur={() => validateEmail(email)}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your password" 
            placeholderTextColor={colors.secondary} 
            secureTextEntry={secureEntery}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
            }}
            onBlur={() => validatePassword(password)}
          />
          <TouchableOpacity onPress={() => {
            setSecureEntery((prev) => !prev);
          }}
          >
            <SimpleLineIcons name={secureEntery ? "eye" : "eye-slash"} size={20} color={colors.scondary} />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity>
          <Text style={styles.forgotPasswordTest}>ForgetPassword?</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.loginBottonWrapper, 
            !(email && password) && styles.disabledButton
          ]} 
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}> or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image source={require("../assets/google.png")} style={styles.googleImage} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  catImage: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  backButtonWrapper:{
    height:40,
    width:40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer:{
    marginVertical: 20,
  },
  headingText:{
    fontSize: 32,
    color: colors.primary,
    fontFamily:fonts.SemiBold,
  },
  formContainer:{
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor:colors.scondary,
    borderRadius: 100,
    paddingHorizontal:20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  errorText: {
    color: 'red',
    fontFamily: fonts.Regular,
    fontSize: 12,
    marginLeft: 10,
    marginTop: -5,
    marginBottom: 5,
  },
  forgotPasswordTest:{
    fontSize: 18,
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.Light,
    marginVertical: 10,
  },
  loginBottonWrapper:{
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer:{
    flexDirection:"row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems:"center",
    padding:10,
    gap: 10,
  },
  googleImage:{
    height:20,
    width: 20,
  },
  googleText:{
    fontSize: 20,
    fontFamily: fonts.Light,
    textAlign: "center",
  },
  footerContainer:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems: "center",
    marginVertical: 20,
    gap: 2,
  },
  accountText:{
    color:colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText:{
    fontSize: 14,  // Increased from 8 to be more readable
    color:colors.primary,
    fontFamily: fonts.SemiBold,
    marginLeft: 5,
  },
});