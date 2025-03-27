import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import from correct paths
import config from '../config/config';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Navigate to HOME screen when there's nowhere to go back
      navigation.navigate("HOME");
    }
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
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      
      try {
        console.log('Attempting login with:', {
          url: `${config.API_BASE_URL}${config.AUTH.LOGIN}`,
          credentials: { email, password }
        });

        const response = await fetch(`${config.API_BASE_URL}${config.AUTH.LOGIN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await response.json();
        console.log('Login response:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Store user data and token
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        }));
        
        setIsLoading(false);
        
        // Navigate based on user role
        if (data.user.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'KDASHBOARD' }], // Update to ADMIN_DASHBOARD if you have it
          });
        } else if (data.user.role === 'teacher') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'KDASHBOARD' }], // Update to TEACHER_DASHBOARD if you have it
          });
        } else {
          // For students/parents, navigate to KDASHBOARD
          navigation.reset({
            index: 0,
            routes: [{ name: 'KDASHBOARD' }],
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Login error:', error);
        
        // Show error message to user
        Alert.alert(
          'Login Failed', 
          error.message || 'Invalid email or password. Please try again.'
        );
        
        // For development/testing only - allow fallback login
        if (__DEV__) {
          Alert.alert(
            'Development Mode', 
            'Would you like to proceed with test credentials?', 
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: () => {
                  // Store mock user data
                  const mockUserData = {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'student'
                  };
                  
                  AsyncStorage.setItem('userData', JSON.stringify(mockUserData))
                    .then(() => {
                      AsyncStorage.setItem('userToken', 'mock-token')
                        .then(() => {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'KDASHBOARD' }],
                          });
                        });
                    });
                } 
              }
            ]
          );
        }
      }
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    Alert.alert('Coming Soon', 'Forgot password functionality will be available soon!');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/cat.png')} 
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
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={30} color={colors.secondary} />
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
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={30} color={colors.secondary} />
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter your password" 
            placeholderTextColor={colors.secondary} 
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
              color={colors.secondary} 
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordTest}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.loginBottonWrapper, 
            (!(email && password) || isLoading) && styles.disabledButton
          ]} 
          onPress={handleLogin}
          disabled={!email || !password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.continueText}> or continue with</Text>
        
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image source={require('../assets/google.png')} style={styles.googleImage} />
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
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
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
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  signupText:{
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginLeft: 5,
  },
});