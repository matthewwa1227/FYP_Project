import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";

const CardDetectionGame = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('animals');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const categories = [
    { id: 'animals', name: 'Animals', icon: 'paw' },
    { id: 'fruits', name: 'Fruits', icon: 'food-apple' },
    { id: 'vehicles', name: 'Vehicles', icon: 'car' },
    { id: 'shapes', name: 'Shapes', icon: 'shape' },
  ];

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
        <Text style={styles.headingText}>Card Detection</Text>
      </View>

      <Text style={styles.descriptionText}>
        Explore and learn new words by showing cards to your camera. 
        The app will recognize objects and teach you their names!
      </Text>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Choose a Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton, 
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialCommunityIcons 
                name={category.icon} 
                size={28} 
                color={selectedCategory === category.id ? colors.white : colors.primary} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <MaterialCommunityIcons name="camera" size={60} color={colors.gray} />
          <Text style={styles.cameraText}>Camera Preview</Text>
          <Text style={styles.instructionText}>Point your camera at a card to detect the object</Text>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultTitle}>Last Detection</Text>
        <View style={styles.noResultView}>
          <Text style={styles.noResultText}>No objects detected yet</Text>
          <Text style={styles.helpText}>Try pointing your camera at a {selectedCategory.slice(0, -1)} card</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Detection</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardDetectionGame;

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
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.primary,
    marginLeft: 8,
  },
  selectedCategoryText: {
    color: colors.white,
  },
  cameraContainer: {
    height: 250,
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
  resultsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  noResultView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  noResultText: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.scondary,
  },
  helpText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.scondary,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
});