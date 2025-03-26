import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";

const FaceDetectionGame = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={"black"}
          size={30}
        />
      </TouchableOpacity>
      <Text style={styles.headingText}>Face Detection Game</Text>
      <Text style={styles.descriptionText}>This game helps children learn about different emotions and facial expressions.</Text>
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
        <Text style={styles.infoText}>This feature is under development.</Text>
      </View>
    </View>
  );
};

export default FaceDetectionGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headingText: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.scondary,
    fontFamily: fonts.Regular,
    marginBottom: 30,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.scondary,
    fontFamily: fonts.Regular,
  }
});