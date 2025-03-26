import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
const [secureEntery, setSecureEntery] = useState(true);

const handleGoBack = () => {
  navigation.goBack();
};

const handleLogin = () => {
  navigation.navigate("LOGIN");
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
    <Text style={styles.headingText}>Let's get</Text>
    <Text style={styles.headingText}>started</Text>

  </View>
  <View style={styles.formContainer}>
    <View style={styles.inputContainer}>
      <Ionicons name={"mail-outline"} size={30} color={colors.scondary} />
      <TextInput style={styles.textInput} placeholder="Enter your email" placeholderTextColor={colors.secondary} keyboardType='email-address'/>
    </View>
    <View style={styles.inputContainer}>
      <SimpleLineIcons name={"lock"} size={30} color={colors.scondary} />
      <TextInput style={styles.textInput} placeholder="Enter your password" placeholderTextColor={colors.secondary} secureTextEntry={secureEntery}/>
      <TouchableOpacity onPress={() => {
        setSecureEntery((prev) => !prev);
      }}
      >
        <SimpleLineIcons name={"eye"} size={20} color={colors.scondary} />
      </TouchableOpacity>
    </View>
    <View style={styles.inputContainer}>
      <SimpleLineIcons name={"screen-smartphone"} size={30} color={colors.scondary} />
      <TextInput style={styles.textInput} placeholder="Enter your phone no" placeholderTextColor={colors.secondary} keyboardType="phone-pad"/>
      <TouchableOpacity onPress={() => {
        setSecureEntery((prev) => !prev);
      }}
      >
      </TouchableOpacity>
    </View>

    <TouchableOpacity style = {styles.loginBottonWrapper}>
      <Text style={styles.loginText}>Sign up</Text>
    </TouchableOpacity>
    <Text style={styles.continueText}> or continue with</Text>
    <TouchableOpacity style={styles.googleButtonContainer}>
      <Image source={require("../assets/google.png")} style={styles.googleImage} />
      <Text style={styles.googleText}>Google</Text>
    </TouchableOpacity>
    <View style={styles.footerContainer}>
      <Text style={styles.accountText}>Already have an account!</Text>
      <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.signupText}>Login</Text>
      </TouchableOpacity>

    </View>
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
  marginVertical: 20,
},
textInput: {
  flex: 1,
  paddingHorizontal: 10,
  fontFamily: fonts.Light,
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

  fontSize: 8,
  color:colors.primary,
  fontFamily: fonts.SemiBold,

},
});