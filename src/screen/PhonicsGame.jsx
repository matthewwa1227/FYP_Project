import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";

const PhonicsGame = () => {
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState(1);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const letters = [
    { id: 1, letter: 'A', word: 'Apple', color: '#FFD6D6' },
    { id: 2, letter: 'B', word: 'Ball', color: '#D6E5FF' },
    { id: 3, letter: 'C', word: 'Cat', color: '#D8F5D6' },
    { id: 4, letter: 'D', word: 'Dog', color: '#FFF0D6' },
    { id: 5, letter: 'E', word: 'Elephant', color: '#F5D6F5' },
    { id: 6, letter: 'F', word: 'Fish', color: '#D6F5F5' },
    { id: 7, letter: 'G', word: 'Goat', color: '#FFD6D6' },
    { id: 8, letter: 'H', word: 'House', color: '#D6E5FF' },
    { id: 9, letter: 'I', word: 'Igloo', color: '#D8F5D6' },
    { id: 10, letter: 'J', word: 'Jam', color: '#FFF0D6' },
    { id: 11, letter: 'K', word: 'Kite', color: '#F5D6F5' },
    { id: 12, letter: 'L', word: 'Lion', color: '#D6F5F5' },
  ];

  const renderLetterItem = ({ item }) => (
    <TouchableOpacity style={[styles.letterCard, { backgroundColor: item.color }]}>
      <Text style={styles.letterText}>{item.letter}</Text>
      <Text style={styles.wordText}>{item.word}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
          <Ionicons
            name={"arrow-back-outline"}
            color={"black"}
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.headingText}>Phonics Fun</Text>
      </View>

      <Text style={styles.descriptionText}>
        Learn letter sounds and practice pronunciation with our fun phonics games!
      </Text>

      <View style={styles.levelsContainer}>
        <Text style={styles.sectionTitle}>Choose a Level</Text>
        <View style={styles.levelButtonsContainer}>
          <TouchableOpacity 
            style={[styles.levelButton, selectedLevel === 1 && styles.selectedLevel]} 
            onPress={() => setSelectedLevel(1)}
          >
            <Text style={[styles.levelText, selectedLevel === 1 && styles.selectedLevelText]}>Level 1</Text>
            <Text style={[styles.levelDescription, selectedLevel === 1 && styles.selectedLevelText]}>A to L</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.levelButton, selectedLevel === 2 && styles.selectedLevel]} 
            onPress={() => setSelectedLevel(2)}
          >
            <Text style={[styles.levelText, selectedLevel === 2 && styles.selectedLevelText]}>Level 2</Text>
            <Text style={[styles.levelDescription, selectedLevel === 2 && styles.selectedLevelText]}>M to Z</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.levelButton, selectedLevel === 3 && styles.selectedLevel]} 
            onPress={() => setSelectedLevel(3)}
          >
            <Text style={[styles.levelText, selectedLevel === 3 && styles.selectedLevelText]}>Level 3</Text>
            <Text style={[styles.levelDescription, selectedLevel === 3 && styles.selectedLevelText]}>Blends</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Letters to Practice</Text>

      <FlatList
        data={letters}
        renderItem={renderLetterItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.letterRow}
        showsVerticalScrollIndicator={false}
        style={styles.lettersList}
      />

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Practice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhonicsGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headingText: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.scondary,
    fontFamily: fonts.Regular,
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  levelsContainer: {
    marginBottom: 20,
  },
  levelButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '31%',
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: colors.primary,
  },
  levelText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  levelDescription: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.scondary,
    marginTop: 4,
  },
  selectedLevelText: {
    color: colors.white,
  },
  lettersList: {
    flex: 1,
    marginTop: 5,
  },
  letterRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  letterCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  letterText: {
    fontSize: 42,
    fontFamily: fonts.Bold,
    color: colors.primary,
    marginBottom: 5,
  },
  wordText: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.primary,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
});