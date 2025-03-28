// src/screen/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList, 
  RefreshControl, 
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import config from '../config/config';

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    fetchStudents();
    fetchRecentActivities();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you would fetch data from your API
      // For now, we'll use sample data
      const sampleStudents = [
        { id: 1, name: 'Emily Chen', level: 3, progress: 75, avatarColor: '#FFD700' },
        { id: 2, name: 'Michael Johnson', level: 2, progress: 45, avatarColor: '#87CEEB' },
        { id: 3, name: 'Sophia Martinez', level: 4, progress: 90, avatarColor: '#98FB98' },
        { id: 4, name: 'Jackson Lee', level: 1, progress: 30, avatarColor: '#FFA07A' },
        { id: 5, name: 'Olivia Taylor', level: 3, progress: 60, avatarColor: '#DDA0DD' },
      ];
      
      setStudents(sampleStudents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load students data');
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // In a real app, you would fetch data from your API
      // For now, we'll use sample data
      const sampleActivities = [
        { id: 1, student: 'Emily Chen', activity: 'Completed Face Detection Game', score: 95, date: '2 hours ago' },
        { id: 2, student: 'Michael Johnson', activity: 'Started Phonics Game', score: null, date: '4 hours ago' },
        { id: 3, student: 'Sophia Martinez', activity: 'Leveled up to Level 4', score: null, date: 'Yesterday' },
        { id: 4, student: 'Jackson Lee', activity: 'Completed Sign Language Game', score: 78, date: 'Yesterday' },
        { id: 5, student: 'Olivia Taylor', activity: 'Earned "Quick Learner" badge', score: null, date: '2 days ago' },
      ];
      
      setActivities(sampleActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchStudents(), fetchRecentActivities()])
      .finally(() => setRefreshing(false));
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.reset({
                index: 0,
                routes: [{ name: 'HOME' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const handleSettings = () => {
    navigation.navigate('SETTINGS');
  };

  const handleViewStudentDetails = (student) => {
    Alert.alert(
      `${student.name}'s Details`,
      `Level: ${student.level}\nProgress: ${student.progress}%`,
      [
        {
          text: 'Close',
          style: 'cancel'
        },
        {
          text: 'View Full Profile',
          onPress: () => console.log(`View full profile for ${student.name}`)
        }
      ]
    );
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => handleViewStudentDetails(item)}
    >
      <View style={[styles.studentAvatar, { backgroundColor: item.avatarColor }]}>
        <Text style={styles.studentInitial}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentLevel}>Level {item.level}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}% Complete</Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityStudent}>{item.student}</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
      <Text style={styles.activityText}>{item.activity}</Text>
      {item.score !== null && (
        <Text style={styles.activityScore}>Score: {item.score}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{user?.name || 'Teacher'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>67%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Students</Text>
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.studentsList}
          />
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Students</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.map(item => renderActivityItem({ item }))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Activities</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-outline" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Add Student</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="stats-chart-outline" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Progress Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  nameText: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginTop: 5,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  studentsList: {
    paddingRight: 20,
  },
  studentCard: {
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentInitial: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 4,
  },
  studentLevel: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.gray,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginRight: 5,
  },
  activityItem: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  activityStudent: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  activityText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginBottom: 5,
  },
  activityScore: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default TeacherDashboard;