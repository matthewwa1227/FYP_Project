// src/screen/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  RefreshControl, 
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import config from '../config/config';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUserData();
    fetchUsers();
    fetchStats();
    fetchRecentActivity();
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, you would fetch data from your API
      // For now, we'll use sample data
      const sampleUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', lastActive: '2 hours ago', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', lastActive: '1 day ago', status: 'active' },
        { id: 3, name: 'Ethan Brown', email: 'ethan@example.com', role: 'student', lastActive: '3 days ago', status: 'inactive' },
        { id: 4, name: 'Olivia Johnson', email: 'olivia@example.com', role: 'teacher', lastActive: '5 hours ago', status: 'active' },
        { id: 5, name: 'William Davis', email: 'william@example.com', role: 'student', lastActive: '1 week ago', status: 'inactive' },
        { id: 6, name: 'Sophia Wilson', email: 'sophia@example.com', role: 'student', lastActive: '2 days ago', status: 'active' },
        { id: 7, name: 'James Taylor', email: 'james@example.com', role: 'teacher', lastActive: '1 day ago', status: 'active' },
        { id: 8, name: 'Emma Martinez', email: 'emma@example.com', role: 'student', lastActive: '6 hours ago', status: 'active' },
      ];
      
      setUsers(sampleUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load users data');
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, you would fetch data from your API
      // For now, we'll use calculated sample data
      const sampleStats = {
        totalUsers: 8,
        students: 4,
        teachers: 3,
        admins: 1,
        activeUsers: 6
      };
      
      setStats(sampleStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // In a real app, you would fetch data from your API
      // For now, we'll use sample data
      const sampleActivity = [
        { id: 1, user: 'John Doe', action: 'Updated user permissions', timestamp: '2 hours ago' },
        { id: 2, user: 'Jane Smith', action: 'Created a new class', timestamp: '1 day ago' },
        { id: 3, user: 'Ethan Brown', action: 'Completed Face Detection Game', timestamp: '3 days ago' },
        { id: 4, user: 'System', action: 'Backup completed', timestamp: '5 days ago' },
        { id: 5, user: 'Olivia Johnson', action: 'Added new student', timestamp: '1 week ago' },
      ];
      
      setRecentActivity(sampleActivity);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchUsers(), fetchStats(), fetchRecentActivity()])
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

  const handleUserAction = (user, action) => {
    switch(action) {
      case 'edit':
        Alert.alert(
          'Edit User',
          `Would you like to edit ${user.name}'s information?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Edit', onPress: () => console.log(`Edit user ${user.id}`) }
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                // In a real app, you would call an API to delete the user
                console.log(`Delete user ${user.id}`);
                // Then update the local state
                setUsers(users.filter(u => u.id !== user.id));
                // Update stats
                setStats({
                  ...stats,
                  totalUsers: stats.totalUsers - 1,
                  [user.role + 's']: stats[user.role + 's'] - 1,
                  activeUsers: user.status === 'active' ? stats.activeUsers - 1 : stats.activeUsers
                });
              } 
            }
          ]
        );
        break;
      case 'status':
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        // In a real app, you would call an API to update the user's status
        console.log(`Update user ${user.id} status to ${newStatus}`);
        // Then update the local state
        setUsers(users.map(u => u.id === user.id ? {...u, status: newStatus} : u));
        // Update stats
        setStats({
          ...stats,
          activeUsers: newStatus === 'active' ? stats.activeUsers + 1 : stats.activeUsers - 1
        });
        break;
    }
  };

  const filteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesRole;
    });
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#FF5733';
      case 'teacher': return '#33A1FF';
      case 'student': return '#33FF57';
      default: return colors.secondary;
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userCardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userInitialContainer}>
            <Text style={styles.userInitial}>{item.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        <View style={[styles.roleTag, { backgroundColor: getRoleColor(item.role) }]}>
          <Text style={styles.roleText}>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</Text>
        </View>
      </View>
      
      <View style={styles.userCardFooter}>
        <View style={styles.userStatus}>
          <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#33FF57' : '#FF5733' }]} />
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
          <Text style={styles.lastActiveText}>Last active: {item.lastActive}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUserAction(item, 'edit')}
          >
            <FontAwesome name="edit" size={16} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUserAction(item, 'status')}
          >
            <Ionicons 
              name={item.status === 'active' ? 'toggle-outline' : 'toggle-off-outline'} 
              size={16} 
              color={item.status === 'active' ? '#33FF57' : '#FF5733'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUserAction(item, 'delete')}
          >
            <FontAwesome name="trash" size={16} color="#FF5733" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityUser}>{item.user}</Text>
        <Text style={styles.activityTime}>{item.timestamp}</Text>
      </View>
      <Text style={styles.activityAction}>{item.action}</Text>
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
          <Text style={styles.nameText}>{user?.name || 'Admin'}</Text>
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
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.students}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.teachers}</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Management</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="filter" size={20} color={colors.primary} />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.secondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
          
          {filteredUsers().length > 0 ? (
            filteredUsers().map(user => renderUserItem({ item: user }))
          ) : (
            <Text style={styles.noResultsText}>No users found matching your criteria</Text>
          )}
          
          <TouchableOpacity style={styles.addUserButton}>
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.addUserText}>Add New User</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map(item => renderActivityItem({ item }))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View Full Activity Log</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionBlock}>
            <Ionicons name="analytics-outline" size={24} color={colors.white} />
            <Text style={styles.actionBlockText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBlock}>
            <Ionicons name="settings-outline" size={24} color={colors.white} />
            <Text style={styles.actionBlockText}>System Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBlock}>
            <Ionicons name="cloud-download-outline" size={24} color={colors.white} />
            <Text style={styles.actionBlockText}>Backups</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBlock}>
            <Ionicons name="help-buoy-outline" size={24} color={colors.white} />
            <Text style={styles.actionBlockText}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Users</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Role</Text>
            <View style={styles.roleFilters}>
              <TouchableOpacity 
                style={[styles.roleFilter, filterRole === 'all' && styles.roleFilterActive]}
                onPress={() => setFilterRole('all')}
              >
                <Text style={[styles.roleFilterText, filterRole === 'all' && styles.roleFilterTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleFilter, filterRole === 'admin' && styles.roleFilterActive]}
                onPress={() => setFilterRole('admin')}
              >
                <Text style={[styles.roleFilterText, filterRole === 'admin' && styles.roleFilterTextActive]}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleFilter, filterRole === 'teacher' && styles.roleFilterActive]}
                onPress={() => setFilterRole('teacher')}
              >
                <Text style={[styles.roleFilterText, filterRole === 'teacher' && styles.roleFilterTextActive]}>Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleFilter, filterRole === 'student' && styles.roleFilterActive]}
                onPress={() => setFilterRole('student')}
              >
                <Text style={[styles.roleFilterText, filterRole === 'student' && styles.roleFilterTextActive]}>Student</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.applyFilterButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyFilterText}>Apply Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resetFilterButton}
              onPress={() => {
                setFilterRole('all');
                setSearchQuery('');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.resetFilterText}>Reset Filters</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  userName: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  userCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginRight: 10,
  },
  lastActiveText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  addUserButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  addUserText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginLeft: 10,
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
  activityUser: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  activityAction: {
    fontSize: 14,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionBlock: {
    width: (width - 60) / 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBlockText: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginTop: 5,
    textAlign: 'center',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  modalLabel: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
  },
  roleFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  roleFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 10,
    marginBottom: 10,
  },
  roleFilterActive: {
    backgroundColor: colors.primary,
  },
  roleFilterText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  roleFilterTextActive: {
    color: colors.white,
  },
  applyFilterButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyFilterText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  resetFilterButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  resetFilterText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
});

export default AdminDashboard;