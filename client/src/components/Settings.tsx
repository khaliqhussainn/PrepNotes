import React from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const PRIMARY_COLOR = "#192841";
const SECONDARY_COLOR = "#2a3f63";
const ACCENT_COLOR = "#3e5785";
const TEXT_COLOR = "#ffffff";
const LIGHT_TEXT = "#e1e5ee";

const Settings = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <LinearGradient
      colors={[PRIMARY_COLOR, SECONDARY_COLOR]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name="notifications-outline" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionDescription}>Manage your notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#cbd5e1", true: ACCENT_COLOR }}
            thumbColor={notificationsEnabled ? PRIMARY_COLOR : "#f4f3f4"}
            style={styles.switch}
          />
        </View>

        <Pressable 
          style={styles.section}
          onPress={navigateToProfile}
          android_ripple={{ color: '#e2e8f0' }}
        >
          <View style={styles.sectionIconContainer}>
            <Ionicons name="person-outline" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Profile Settings</Text>
            <Text style={styles.sectionDescription}>Manage your profile</Text>
          </View>
          <Ionicons 
            name="chevron-forward-outline" 
            size={24} 
            color={PRIMARY_COLOR}
          />
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name="settings-outline" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <Text style={styles.sectionDescription}>Customize your experience</Text>
          </View>
          <Ionicons 
            name="chevron-forward-outline" 
            size={24} 
            color={PRIMARY_COLOR}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: TEXT_COLOR,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
});

export default Settings;