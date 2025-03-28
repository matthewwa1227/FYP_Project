import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";
import { useNavigation } from '@react-navigation/native';
import config from '../config/config'; // Make sure this import works

const SignupScreen = () => {
  const navigation = useNavigation();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug mode for development
  const [debugMessage, setDebugMessage] = useState('');

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("HOME");
    }
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };
  
  // Validation functions
  const validateName = (value) => {
    if (!value) {
      setNameError('Name is required');
      return false;
    } else if (value.length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };
  
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };
  
  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };
  
  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    if (!value) {
      // Phone can be optional
      setPhoneError('');
      return true;
    } else if (!phoneRegex.test(value)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };
  
  // Handle signup
  const handleSignup = async () => {
    // First validate all inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phone);
    
    if (isNameValid && isEmailValid && isPasswordValid && isPhoneValid) {
      setIsLoading(true);
      setDebugMessage('Starting registration...');
      
      // Registration payload
      const registrationData = {
        name: name,
        email: email.trim().toLowerCase(), // Normalize email
        password: password,
        phone: phone,
        role: 'student' // Default role
      };
      
      try {
        console.log('Attempting registration with:', {
          url: `${config.API_BASE_URL}${config.AUTH.REGISTER}`,
          data: registrationData
        });
        
        setDebugMessage(`Sending request to ${config.API_BASE_URL}${config.AUTH.REGISTER}`);
        
        const response = await fetch(`${config.API_BASE_URL}${config.AUTH.REGISTER}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });
        
        const data = await response.json();
        console.log('Registration response:', data);
        setDebugMessage(`Registration response: ${JSON.stringify(data)}`);
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        setIsLoading(false);
        Alert.alert(
          'Success',
          'Your account has been created successfully!',
          [
            {
              text: 'Login Now',
              onPress: () => navigation.navigate('LOGIN')
            }
          ]
        );
      } catch (error) {
        setIsLoading(false);
        console.error('Registration error:', error);
        setDebugMessage(`Registration error: ${error.message}`);
        
        if (error.message.includes('Email already registered')) {
          setEmailError('This email is already registered. Please use a different email or try logging in.');
        } else {
          Alert.alert(
            'Registration Failed',
            error.message || 'Something went wrong. Please try again.'
          );
        }
        
        // Development fallback for testing
        if (__DEV__) {
          Alert.alert(
            'Development Mode',
            'Would you like to proceed to login anyway for testing?',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: () => {
                  // Store the email for login screen
                  navigation.navigate('LOGIN', { email: email });
                }
              }
            ]
          );
        }
      }
    }
  };

  // For testing - try a specific email that might work
  const tryTestEmail = () => {
    const testEmail = 'newuser_' + Math.floor(Math.random() * 1000) + '@example.com';
    setEmail(testEmail);
    setEmailError('');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/cat.png")} 
        style={styles.catImage} 
      />
      
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name="arrow-back-outline"
          color="black"
          size={30}
        />
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's get</Text>
        <Text style={styles.headingText}>started</Text>
      </View>
      
      <View style={styles.formContainer}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={30} color={colors.secondary || colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your name" 
            placeholderTextColor={colors.secondary || colors.scondary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) validateName(text);
            }}
            onBlur={() => validateName(name)}
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={30} color={colors.secondary || colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your email" 
            placeholderTextColor={colors.secondary || colors.scondary}
            keyboardType='email-address'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            onBlur={() => validateEmail(email)}
            autoCapitalize="none"
          />
          {__DEV__ && (
            <TouchableOpacity onPress={tryTestEmail}>
              <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        {/* Password Input */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={30} color={colors.secondary || colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your password" 
            placeholderTextColor={colors.secondary || colors.scondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
            }}
            onBlur={() => validatePassword(password)}
          />
          <TouchableOpacity onPress={() => {
            setSecureEntry((prev) => !prev);
          }}>
            <Ionicons 
              name={secureEntry ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={colors.secondary || colors.scondary} 
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="screen-smartphone" size={30} color={colors.secondary || colors.scondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your phone no" 
            placeholderTextColor={colors.secondary || colors.scondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) validatePhone(text);
            }}
            onBlur={() => validatePhone(phone)}
          />
        </View>
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
    
        {/* Signup Button */}
        <TouchableOpacity 
          style={[
            styles.signupButtonWrapper, 
            (!name || !email || !password || isLoading) && styles.disabledButton
          ]} 
          onPress={handleSignup}
          disabled={!name || !email || !password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.signupText}>Sign up</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.continueText}> or continue with</Text>
        
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image source={require("../assets/google.png")} style={styles.googleImage} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account!</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        
        {__DEV__ && debugMessage ? (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>{debugMessage}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default SignupScreen;

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
    height: 40,
    width: 40,
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
    fontFamily: fonts.SemiBold,
  },
  formContainer:{
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary || colors.scondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10, // Changed from 20 to make room for error messages
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
  signupButtonWrapper:{
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
  signupText: {
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
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage:{
    height: 20,
    width: 20,
  },
  googleText:{
    fontSize: 20,
    fontFamily: fonts.Light,
    textAlign: "center",
  },
  footerContainer:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 2,
  },
  accountText:{
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  loginText:{
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginLeft: 5,
  },
  debugContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  debugText: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: '#333',
  },
});