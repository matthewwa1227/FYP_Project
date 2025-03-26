import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };
  const handleSignUp = () => {
    navigation.navigate("SIGNUP");
  };
   
  return (
    <View style={styles.container}>
      <Image source={require("../assets/ABC_logo.png")} style={styles.logo} />
      <Image source={require("../assets/rpanda.png")} style={styles.bannerImage} />
      <Text style={styles.title}>Meet Our Pixel Pals</Text>
      <Text style={styles.subTitle}> Friendly pixel art characters guide you through games, puzzles, and creative quests</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.loginButtonWrapper,{backgroundColor: colors.primary}, ]} onPress={handleLogin}>
          <Text style={styles.loginButtonText  }>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.loginButtonWrapper }  onPress={handleSignUp}  >
          <Text style={styles.signupButtonText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 120,
    width: 140,
    marginVertical: 20,
  },
  bannerImage: {
    marginVertical:20,
    height: 250,
    width: 231,

  },
  title: {
    fontSize: 40,
    left: 10,
    fontFamily:fonts.Regular,
    peddingHorizontal: 20,
    testAlign: "center",
    color:  colors.primary,
  },
  subTitle: {
    fontSize: 16,
    fontFamily:fonts.Medium,
    color: colors.scondary,
    testAlign: "center",
    marginVertical: 20,
    }, 
    buttonContainer: {
      flexDirection: "row",
      borderWidth: 2,
      borderColor:colors.primary,
      width: "80%",
      height: 60,
      borderRadius: 100,
    },
    loginButtonWrapper: {
      justifyContent: "center",
      alignItems: "center",
      width: "50%",
      borderRadius: 98,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: 18,
      fontFamily: fonts.SemiBold,
    },
    signupButtonText: {
      height: 55,
      fontSize: 32,
      fontFamily: fonts.Medium, 
    }
});