// SettingsScreen.jsx
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { colors } from "../utils/colors.js";
import { fonts } from "../utils/fonts.js";
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Sound Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={24} color={colors.primary} />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={soundEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setSoundEnabled(previousState => !previousState)}
              value={soundEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="musical-notes-outline" size={24} color={colors.primary} />
              <Text style={styles.settingText}>Background Music</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={musicEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setMusicEnabled(previousState => !previousState)}
              value={musicEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
              <Text style={styles.settingText}>Vibration</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={vibrationEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setVibrationEnabled(previousState => !previousState)}
              value={vibrationEnabled}
            />
          </View>
        </View>
        
        {/* Notification Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
              <Text style={styles.settingText}>Enable Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.aboutText}>App Version 1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            <Text style={styles.aboutText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.aboutText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    marginLeft: 20,
    color: colors.primary,
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    marginLeft: 15,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    marginLeft: 15,
  },
});