import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
  Animated,
} from "react-native";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

const LeftSidebar = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState("Profile");
  const [showQuickStats, setShowQuickStats] = useState(false);
  const quickStatsAnim = new Animated.Value(0);

  const BLUE_COLOR = "#0070F0"; // Consistent blue color

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        imageUrl: currentUser.photoURL || "../../assets/icons/profile-placeholder.svg",
        role: "Student",
        joinDate: "Jan 2024",
      });
    }
  }, [auth.currentUser]);

  const toggleQuickStats = () => {
    setShowQuickStats(!showQuickStats);
    Animated.spring(quickStatsAnim, {
      toValue: showQuickStats ? 0 : 1,
      tension: 20,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const handleSocialMediaPress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const quickStats = [
    { icon: "time-outline", label: "Study Time", value: "12h 30m" },
    { icon: "trophy-outline", label: "Achievements", value: "15" },
    { icon: "star-outline", label: "Rating", value: "4.8" },
  ];

  const getStyles = (isDark) => StyleSheet.create({
    container: {
      height: "100%",
      paddingBottom: 120,
    },
    sidebar: {
      flex: 1,
      borderBottomRightRadius: 30,
      shadowColor: isDark ? "#000000" : "#62B1DD",
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 12,
      elevation: 15,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 64,
      flexGrow: 1,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logoWrapper: {
      padding: 4,
      borderRadius: 50,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    logoGradient: {
      padding: 3,
      borderRadius: 47,
    },
    logo: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 3,
      borderColor: isDark ? "#FFFFFF" : "#FFF",
    },
    appName: {
      fontSize: 32,
      fontWeight: "800",
      color: BLUE_COLOR, // Use consistent blue color
      marginTop: 16,
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    userInfoContainer: {
      marginBottom: 16,
      borderRadius: 20,
      shadowColor: isDark ? "#000000" : "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    profileImageContainer: {
      position: "relative",
      padding: 3,
      borderRadius: 36,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)",
    },
    profileImage: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: isDark ? "#FFFFFF" : "#FFF",
    },
    statusIndicator: {
      position: "absolute",
      bottom: 3,
      right: 3,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#4CAF50",
      borderWidth: 2,
      borderColor: isDark ? "#FFFFFF" : "#FFF",
    },
    userDetails: {
      flex: 1,
      marginLeft: 16,
    },
    userName: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#FFF",
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: isDark ? "#FFFFFF" : "#FFF",
      marginBottom: 6,
      opacity: 0.9,
    },
    roleContainer: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: "flex-start",
    },
    userRole: {
      fontSize: 12,
      color: isDark ? "#FFFFFF" : "#000000",
      fontWeight: "500",
    },
    quickStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
      overflow: "hidden",
      gap: 12,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? "#FFFFFF" : "#000000",
      marginTop: 4,
      opacity: 0.9,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: BLUE_COLOR, // Use consistent blue color
      marginTop: 8,
    },
    navLinksContainer: {
      gap: 16,
      marginBottom: 36,
    },
    navLink: {
      borderRadius: 16,
      shadowColor: isDark ? "#000000" : "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    navLinkGradient: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    navLinkActive: {
      transform: [{ scale: 1.02 }],
    },
    navLinkText: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#FFF",
      marginLeft: 12,
      flex: 1,
    },
    navLinkTextActive: {
      color: "#FFF", // Use consistent blue color
    },
    footer: {
      marginTop: "auto",
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
      paddingTop: 24,
    },
    footerContent: {
      alignItems: "center",
      padding: 24,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    footerText: {
      fontSize: 18,
      fontWeight: "700",
      color: BLUE_COLOR, // Use consistent blue color
      marginBottom: 8,
    },
    footerSubtext: {
      fontSize: 14,
      color: isDark ? "#FFFFFF" : "#000000",
      marginBottom: 20,
      opacity: 0.9,
    },
    socialMediaIcons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    socialIcon: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    },
    socialIconPressed: {
      transform: [{ scale: 0.95 }],
    },
    pressed: {
      opacity: 0.8,
    },
  });

  const styles = getStyles(isDarkMode);

  return (
    <LinearGradient
      colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#FFFFFF", "#62B1DD"]}
      locations={[0, 0.95]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.sidebar}
      >
        {/* Logo and App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <LinearGradient
              colors={isDarkMode ? ["#2A2A2A", "#3A3A3A"] : ["#0070F0", "#62B1DD"]}
              style={styles.logoGradient}
            >
              <Image
                source={require("../../assets/logo.jpg")}
                style={styles.logo}
                alt="App Logo"
              />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>Prep Notes</Text>
        </View>

        {/* User Profile Section */}
        {user && (
          <Pressable
            onPress={toggleQuickStats}
            style={({ pressed }) => [
              styles.userInfoContainer,
              pressed && styles.pressed
            ]}
          >
            <LinearGradient
              colors={isDarkMode ? ["#2A2A2A", "#3A3A3A"] : ["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userInfo}
            >
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.profileImage}
                  alt="profile"
                />
                <View style={styles.statusIndicator} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.roleContainer}>
                  <Text style={styles.userRole}>
                    {user.role} • Since {user.joinDate}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        )}

        {/* Quick Stats Section */}
        <Animated.View
          style={[
            styles.quickStats,
            {
              height: quickStatsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 130],
              }),
              opacity: quickStatsAnim,
              transform: [{
                scale: quickStatsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              }],
            },
          ]}
        >
          {quickStats.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={isDarkMode ? ["#2A2A2A", "#3A3A3A"] : ["#0070F0", "#62B1DD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statItem}
            >
              <Ionicons name={stat.icon} size={24} color={isDarkMode ? "#FFFFFF" : "#FFF"} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </LinearGradient>
          ))}
        </Animated.View>

        {/* Navigation Links */}
        <View style={styles.navLinksContainer}>
          {[
            { name: "Profile", icon: "person-outline" },
            { name: "Settings", icon: "settings-outline" },
            { name: "Help", icon: "help-circle-outline" },
          ].map((link) => (
            <Pressable
              key={link.name}
              style={({ pressed }) => [
                styles.navLink,
                activeLink === link.name && styles.navLinkActive,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setActiveLink(link.name);
                navigation.navigate(link.name);
              }}
            >
              <LinearGradient
                colors={isDarkMode ? ["#2A2A2A", "#3A3A3A"] : ["#0070F0", "#62B1DD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.navLinkGradient}
              >
                <Ionicons
                  name={link.icon}
                  size={24}
                  color={isDarkMode ? "#FFFFFF" : "#FFF"}
                />
                <Text style={[styles.navLinkText, activeLink === link.name && styles.navLinkTextActive]}>
                  {link.name}
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Follow Us</Text>
            <Text style={styles.footerSubtext}>Stay connected with us on social media</Text>
            <View style={styles.socialMediaIcons}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialIcon,
                  pressed && styles.socialIconPressed,
                ]}
                onPress={() => handleSocialMediaPress("https://facebook.com")}
              >
                <FontAwesome name="facebook" size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.socialIcon,
                  pressed && styles.socialIconPressed,
                ]}
                onPress={() => handleSocialMediaPress("https://twitter.com")}
              >
                <FontAwesome name="twitter" size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.socialIcon,
                  pressed && styles.socialIconPressed,
                ]}
                onPress={() => handleSocialMediaPress("https://instagram.com")}
              >
                <FontAwesome name="instagram" size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LeftSidebar;