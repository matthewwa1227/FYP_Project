import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import config from '../config/config';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.42;

const KDashboard = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [kidProfiles, setKidProfiles] = useState([]);
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');

      if (!userDataString || !token) {
        throw new Error('No user data found');
      }

      const user = JSON.parse(userDataString);
      setUserData(user);

      // Only fetch kid profiles if user role is 'student'
      if (user.role === 'student') {
        // Fetch kid profiles using your API endpoint URL from config
        const kidProfilesResponse = await fetch(
          `${config.API_BASE_URL}${config.KID_PROFILES.GET_BY_PARENT.replace(
            ':id',
            user.id
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!kidProfilesResponse.ok) {
          throw new Error('Failed to fetch kid profiles');
        }

        const kidProfilesData = await kidProfilesResponse.json();
        setKidProfiles(kidProfilesData);

        // If there are kid profiles, fetch game sessions for the first kid
        if (kidProfilesData.length > 0) {
          const gameSessionsResponse = await fetch(
            `${config.API_BASE_URL}${config.GAME_SESSIONS.GET_BY_KID.replace(
              ':id',
              kidProfilesData[0].id
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!gameSessionsResponse.ok) {
            throw new Error('Failed to fetch game sessions');
          }

          const gameSessionsData = await gameSessionsResponse.json();
          setGameSessions(gameSessionsData);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      setLoading(false);

      // For development/testing purposes only
      if (__DEV__) {
        setUserData({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student',
        });
        setKidProfiles([
          { id: 1, kid_name: 'Tommy', level: 2, score: 150 },
          { id: 2, kid_name: 'Sarah', level: 3, score: 240 },
        ]);
        setGameSessions([
          { id: 1, game: 'Puzzle Game', score: 35, session_date: '2025-03-27' },
          { id: 2, game: 'Math Challenge', score: 42, session_date: '2025-03-26' },
        ]);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LOGIN' }],
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSettings = () => {
    navigation.navigate('SETTINGS');
  };

  const navigateToGame = (gameType) => {
    navigation.navigate(gameType);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with user info and header buttons */}
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <Image source={require('../assets/cat.png')} style={styles.avatar} />
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.nameText}>
              {userData ? userData.name : 'Explorer'}
            </Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" color={colors.primary} size={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" color={colors.primary} size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress section */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Your Learning Journey</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% Complete</Text>
        </View>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Choose Your Adventure!</Text>

      {/* Game cards and recent activity */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.gameCardsContainer}>
        <View style={styles.gameCardsRow}>
          {/* Face Detection Game Card */}
          <TouchableOpacity
            style={[styles.gameCard, { backgroundColor: '#FFD6D6' }]}
            onPress={() => navigateToGame('FACE_DETECTION')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FF9999' }]}>
              <FontAwesome5 name="smile-beam" size={40} color="#FF5252" />
            </View>
            <Text style={styles.gameTitle}>Face Detection</Text>
            <Text style={styles.gameDescription}>
              Learn emotions through fun face games!
            </Text>
          </TouchableOpacity>

          {/* Sign Language Game Card */}
          <TouchableOpacity
            style={[styles.gameCard, { backgroundColor: '#D6E5FF' }]}
            onPress={() => navigateToGame('SIGN_LANGUAGE')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#99BBFF' }]}>
              <FontAwesome5 name="hands" size={40} color="#3366CC" />
            </View>
            <Text style={styles.gameTitle}>Sign Language</Text>
            <Text style={styles.gameDescription}>
              Learn to communicate with signs!
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameCardsRow}>
          {/* Phonics Game Card */}
          <TouchableOpacity
            style={[styles.gameCard, { backgroundColor: '#D8F5D6' }]}
            onPress={() => navigateToGame('PHONICS')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#A3E39E' }]}>
              <MaterialCommunityIcons
                name="alphabetical"
                size={40}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.gameTitle}>Phonics</Text>
            <Text style={styles.gameDescription}>
              Learn letter sounds and pronunciation!
            </Text>
          </TouchableOpacity>

          {/* Card Detection Game Card */}
          <TouchableOpacity
            style={[styles.gameCard, { backgroundColor: '#FFF0D6' }]}
            onPress={() => navigateToGame('CARD_DETECTION')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FFD699' }]}>
              <MaterialCommunityIcons name="cards" size={40} color="#FF9800" />
            </View>
            <Text style={styles.gameTitle}>Card Detection</Text>
            <Text style={styles.gameDescription}>
              Discover objects and learn new words!
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#FFD6D6' }]}>
              <FontAwesome5 name="smile-beam" size={20} color="#FF5252" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityName}>Face Game - Emotions</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
            <View style={styles.starContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#D6E5FF' }]}>
              <FontAwesome5 name="hands" size={20} color="#3366CC" />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityName}>Sign Language - Basics</Text>
              <Text style={styles.activityTime}>3 days ago</Text>
            </View>
            <View style={styles.starContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star-outline" size={16} color="#FFD700" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.scondary,
    fontFamily: fonts.Regular,
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  progressContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  progressBarContainer: {
    marginTop: 5,
  },
  progressBarBg: {
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: fonts.Medium,
    color: colors.scondary,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  gameCardsContainer: {
    flex: 1,
  },
  gameCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gameCard: {
    width: cardWidth,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.scondary,
    textAlign: 'center',
  },
  recentActivityContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.primary,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.scondary,
  },
  starContainer: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginTop: 10,
  },
});

export default KDashboard;