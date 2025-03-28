// src/screen/ParentDashboard.jsx
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
  ActivityIndicator,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import config from '../config/config';

const ParentDashboard = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isChildModalVisible, setIsChildModalVisible] = useState(false);

  useEffect(() => {
    loadUserData();
    fetchChildren();
    fetchActivities();
    fetchRecommendations();
  }, []);

  // Load user data from AsyncStorage
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

  // Fetch children data
  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      
      // Sample data for demonstration
      const sampleChildren = [
        { 
          id: 1, 
          name: 'Sophia', 
          age: 6, 
          avatar: null, 
          level: 3, 
          progress: 75,
          strengths: ['Sign Language', 'Face Recognition'],
          weaknesses: ['Phonics'],
          lastActive: '2 hours ago',
          teacherName: 'Ms. Johnson',
          streak: 5, // days in a row
          avatarColor: '#FFD700'
        },
        { 
          id: 2, 
          name: 'Ethan', 
          age: 4, 
          avatar: null, 
          level: 1, 
          progress: 30,
          strengths: ['Card Detection'],
          weaknesses: ['Sign Language', 'Phonics'],
          lastActive: 'Yesterday',
          teacherName: 'Mr. Williams',
          streak: 2, // days in a row
          avatarColor: '#87CEEB'
        }
      ];
      
      setChildren(sampleChildren);
      // Set the first child as selected by default
      if (sampleChildren.length > 0 && !selectedChild) {
        setSelectedChild(sampleChildren[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching children:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load children data');
    }
  };

  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      // Sample data for demonstration
      const sampleActivities = [
        { id: 1, child: 'Sophia', activity: 'Completed Face Detection Game', score: 95, date: '2 hours ago' },
        { id: 2, child: 'Ethan', activity: 'Started Phonics Game', score: null, date: '1 day ago' },
        { id: 3, child: 'Sophia', activity: 'Earned "Quick Learner" badge', score: null, date: '2 days ago' },
        { id: 4, child: 'Ethan', activity: 'Completed Card Detection Game', score: 70, date: '3 days ago' },
        { id: 5, child: 'Sophia', activity: 'Leveled up to Level 3', score: null, date: '5 days ago' },
      ];
      
      setActivities(sampleActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch game recommendations
  const fetchRecommendations = async () => {
    try {
      // Sample data for demonstration
      const sampleRecommendations = [
        { 
          id: 1, 
          title: 'Phonics Game', 
          description: 'Helps improve sound recognition and pronunciation', 
          icon: 'mic-outline',
          route: 'PHONICS',
          recommended: ['Sophia', 'Ethan']
        },
        { 
          id: 2, 
          title: 'Sign Language Game', 
          description: 'Learn basic sign language in a fun way', 
          icon: 'hand-left-outline',
          route: 'SIGN_LANGUAGE',
          recommended: ['Ethan']
        },
        { 
          id: 3, 
          title: 'Face Detection Game', 
          description: 'Helps with facial expression recognition', 
          icon: 'happy-outline',
          route: 'FACE_DETECTION',
          recommended: ['Sophia']
        },
        { 
          id: 4, 
          title: 'Card Detection Game', 
          description: 'Improves object recognition skills', 
          icon: 'apps-outline',
          route: 'CARD_DETECTION',
          recommended: ['Sophia', 'Ethan']
        },
      ];
      
      setRecommendations(sampleRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchChildren(), fetchActivities(), fetchRecommendations()])
      .finally(() => setRefreshing(false));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
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

  // Handle settings
  const handleSettings = () => {
    navigation.navigate('SETTINGS');
  };

  // Handle child selection
  const handleSelectChild = (child) => {
    setSelectedChild(child);
    setIsChildModalVisible(false);
  };

  // Handle game selection
  const handleGameSelect = (game) => {
    if (!selectedChild) {
      Alert.alert('Select a Child', 'Please select a child first before starting a game.');
      return;
    }
    
    Alert.alert(
      `Start ${game.title}`,
      `Would you like to start ${game.title} for ${selectedChild.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Game',
          onPress: () => navigation.navigate(game.route, { childId: selectedChild.id })
        }
      ]
    );
  };

  // Handle contact teacher
  const handleContactTeacher = () => {
    if (!selectedChild) {
      Alert.alert('Select a Child', 'Please select a child first.');
      return;
    }
    
    Alert.alert(
      'Contact Teacher',
      `Send a message to ${selectedChild.teacherName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Message',
          onPress: () => console.log(`Messaging teacher for ${selectedChild.name}`)
        }
      ]
    );
  };

  // Render child item for the modal
  const renderChildItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.childSelectItem, 
        selectedChild?.id === item.id && styles.selectedChildItem
      ]}
      onPress={() => handleSelectChild(item)}
    >
      <View style={[styles.childAvatar, { backgroundColor: item.avatarColor }]}>
        <Text style={styles.childInitial}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.childSelectInfo}>
        <Text style={styles.childSelectName}>{item.name}</Text>
        <Text style={styles.childSelectAge}>{item.age} years old</Text>
      </View>
      {selectedChild?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  // Render activity item
  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityChild}>{item.child}</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
      <Text style={styles.activityText}>{item.activity}</Text>
      {item.score !== null && (
        <Text style={styles.activityScore}>Score: {item.score}</Text>
      )}
    </View>
  );

  // Render recommendation item
  const renderRecommendationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recommendationItem}
      onPress={() => handleGameSelect(item)}
    >
      <View style={styles.recommendationIcon}>
        <Ionicons name={item.icon} size={30} color={colors.white} />
      </View>
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationTitle}>{item.title}</Text>
        <Text style={styles.recommendationDescription}>{item.description}</Text>
        {selectedChild && item.recommended.includes(selectedChild.name) && (
          <View style={styles.recommendedTag}>
            <Text style={styles.recommendedText}>Recommended for {selectedChild.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Loading state
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
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.nameText}>{user?.name || 'Parent'}</Text>
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
        {/* Child Selector */}
        <View style={styles.childSelectorContainer}>
          <Text style={styles.sectionTitle}>Child Profile</Text>
          
          <TouchableOpacity 
            style={styles.childSelector}
            onPress={() => setIsChildModalVisible(true)}
          >
            {selectedChild ? (
              <>
                <View style={[styles.childAvatar, { backgroundColor: selectedChild.avatarColor }]}>
                  <Text style={styles.childInitial}>{selectedChild.name.charAt(0)}</Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{selectedChild.name}</Text>
                  <Text style={styles.childAge}>{selectedChild.age} years old • Level {selectedChild.level}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.selectChildText}>Select a child</Text>
            )}
            <Ionicons name="chevron-down" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Child Stats */}
        {selectedChild && (
          <View style={styles.childStatsContainer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Learning Progress</Text>
                <Text style={styles.progressPercentage}>{selectedChild.progress}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${selectedChild.progress}%` }]} />
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color={colors.primary} />
                <Text style={styles.statValue}>{selectedChild.streak} days</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color={colors.primary} />
                <Text style={styles.statValue}>Level {selectedChild.level}</Text>
                <Text style={styles.statLabel}>Current Level</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={24} color={colors.primary} />
                <Text style={styles.statValue}>{selectedChild.lastActive}</Text>
                <Text style={styles.statLabel}>Last Active</Text>
              </View>
            </View>
            
            <View style={styles.strengthWeaknessContainer}>
              <View style={styles.strengthsContainer}>
                <Text style={styles.strengthsTitle}>Strengths</Text>
                {selectedChild.strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <Ionicons name="checkmark-circle" size={16} color="green" />
                    <Text style={styles.strengthText}>{strength}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.weaknessesContainer}>
                <Text style={styles.weaknessesTitle}>Areas for Improvement</Text>
                {selectedChild.weaknesses.map((weakness, index) => (
                  <View key={index} style={styles.weaknessItem}>
                    <Ionicons name="alert-circle" size={16} color="orange" />
                    <Text style={styles.weaknessText}>{weakness}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.teacherInfoContainer}>
              <Text style={styles.teacherLabel}>Teacher</Text>
              <Text style={styles.teacherName}>{selectedChild.teacherName}</Text>
              <TouchableOpacity 
                style={styles.contactTeacherButton}
                onPress={handleContactTeacher}
              >
                <Text style={styles.contactTeacherText}>Contact Teacher</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Game Recommendations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended Games</Text>
          <FlatList
            data={recommendations}
            renderItem={renderRecommendationItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsList}
          />
        </View>

        {/* Recent Activities */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {activities.map(item => (
            <View key={item.id}>{renderActivityItem({ item })}</View>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Activities</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome5 name="book-reader" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Progress Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Messages</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Child Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChildModalVisible}
        onRequestClose={() => setIsChildModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Child</Text>
              <TouchableOpacity onPress={() => setIsChildModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={children}
              renderItem={renderChildItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.modalListContainer}
            />
            
            <TouchableOpacity style={styles.addChildButton}>
              <Ionicons name="add" size={20} color={colors.white} />
              <Text style={styles.addChildText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  childSelectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  childInitial: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  childAge: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  selectChildText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    flex: 1,
  },
  childStatsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  progressPercentage: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.gray,
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  statValue: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginTop: 3,
  },
  strengthWeaknessContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  strengthsContainer: {
    flex: 1,
    marginRight: 10,
  },
  weaknessesContainer: {
    flex: 1,
    marginLeft: 10,
  },
  strengthsTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  weaknessesTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  strengthText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginLeft: 5,
  },
  weaknessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weaknessText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginLeft: 5,
  },
  teacherInfoContainer: {
    backgroundColor: colors.gray,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  teacherLabel: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  teacherName: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  contactTeacherButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  contactTeacherText: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  recommendationsList: {
    paddingRight: 20,
  },
  recommendationItem: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginBottom: 5,
  },
  recommendedTag: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  recommendedText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.primary,
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
  activityChild: {
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  modalListContainer: {
    paddingBottom: 20,
  },
  childSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  selectedChildItem: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  childSelectInfo: {
    flex: 1,
  },
  childSelectName: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  childSelectAge: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  addChildButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addChildText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginLeft: 10,
  }
});

export default ParentDashboard;