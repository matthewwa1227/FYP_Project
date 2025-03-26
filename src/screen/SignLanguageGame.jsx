import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";

const SignLanguageGame = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('learn');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const signs = [
    { id: 1, name: 'Hello', difficulty: 'Easy' },
    { id: 2, name: 'Thank You', difficulty: 'Easy' },
    { id: 3, name: 'Please', difficulty: 'Easy' },
    { id: 4, name: 'Friend', difficulty: 'Medium' },
    { id: 5, name: 'Family', difficulty: 'Medium' },
    { id: 6, name: 'Help', difficulty: 'Easy' },
  ];

  const renderDifficultyBadge = (difficulty) => {
    let badgeColor = '#4CAF50'; // Easy (green)
    if (difficulty === 'Medium') badgeColor = '#FFC107'; // Medium (yellow)
    if (difficulty === 'Hard') badgeColor = '#F44336'; // Hard (red)
    
    return (
      <View style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.difficultyText}>{difficulty}</Text>
      </View>
    );
  };

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
        <Text style={styles.headingText}>Sign Language</Text>
      </View>

      <Text style={styles.descriptionText}>
        Learn to communicate using sign language with interactive lessons and practice!
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'learn' && styles.selectedTab]} 
          onPress={() => setSelectedTab('learn')}
        >
          <Ionicons name="book-outline" size={24} color={selectedTab === 'learn' ? colors.white : colors.primary} />
          <Text style={[styles.tabText, selectedTab === 'learn' && styles.selectedTabText]}>Learn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'practice' && styles.selectedTab]} 
          onPress={() => setSelectedTab('practice')}
        >
          <Ionicons name="hand-left-outline" size={24} color={selectedTab === 'practice' ? colors.white : colors.primary} />
          <Text style={[styles.tabText, selectedTab === 'practice' && styles.selectedTabText]}>Practice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'quiz' && styles.selectedTab]} 
          onPress={() => setSelectedTab('quiz')}
        >
          <Ionicons name="game-controller-outline" size={24} color={selectedTab === 'quiz' ? colors.white : colors.primary} />
          <Text style={[styles.tabText, selectedTab === 'quiz' && styles.selectedTabText]}>Quiz</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'learn' && (
        <View style={styles.signListContainer}>
          <Text style={styles.sectionTitle}>Basic Signs</Text>
          <ScrollView style={styles.signList} showsVerticalScrollIndicator={false}>
            {signs.map((sign) => (
              <TouchableOpacity key={sign.id} style={styles.signItem}>
                <View style={styles.signIconContainer}>
                  <FontAwesome5 name="hands" size={30} color={colors.primary} />
                </View>
                <View style={styles.signInfo}>
                  <Text style={styles.signName}>{sign.name}</Text>
                  {renderDifficultyBadge(sign.difficulty)}
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.scondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedTab === 'practice' && (
        <View style={styles.practiceModeContainer}>
          <View style={styles.cameraContainer}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="videocam" size={60} color={colors.gray} />
              <Text style={styles.cameraText}>Camera Preview</Text>
              <Text style={styles.instructionText}>Show hand signs to the camera to practice</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedTab === 'quiz' && (
        <View style={styles.quizContainer}>
          <View style={styles.quizPlaceholder}>
            <Ionicons name="trophy" size={60} color={colors.primary} />
            <Text style={styles.quizTitle}>Sign Language Quiz</Text>
            <Text style={styles.quizDescription}>
              Test your knowledge of sign language with fun interactive quizzes!
            </Text>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SignLanguageGame;

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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    padding: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 50,
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: fonts.Medium,
    color: colors.primary,
    marginLeft: 5,
  },
  selectedTabText: {
    color: colors.white,
  },
  signListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  signList: {
    flex: 1,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  signIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  signInfo: {
    flex: 1,
  },
  signName: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.primary,
    marginBottom: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  practiceModeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraText: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.scondary,
    marginTop: 10,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.scondary,
    marginTop: 5,
    textAlign: 'center',
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  quizTitle: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginTop: 15,
    marginBottom: 10,
  },
  quizDescription: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.scondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
});