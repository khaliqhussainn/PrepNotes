import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet, Linking, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const LeftSidebar = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        imageUrl: currentUser.photoURL || "../../assets/icons/profile-placeholder.svg",
      });
    }
  }, [auth.currentUser]);

  const handleSocialMediaPress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/logo.jpg")}
                style={styles.logo}
                alt="App Logo"
              />
            </View>
            <Text style={styles.appName}>My App</Text>
          </View>

          {/* User Profile Section */}
          {user && (
            <View style={styles.userInfo}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.profileImage}
                  alt="profile"
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          )}

          {/* Navigation Links */}
          <View style={styles.navLinksContainer}>
            <Pressable
              style={({pressed}) => [styles.navLink, pressed && styles.navLinkPressed]}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person-outline" size={24} color="#fff" />
              <Text style={styles.navLinkText}>Profile</Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [styles.navLink, pressed && styles.navLinkPressed]}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
              <Text style={styles.navLinkText}>Settings</Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [styles.navLink, pressed && styles.navLinkPressed]}
              onPress={() => navigation.navigate("Help")}
            >
              <Ionicons name="help-outline" size={24} color="#fff" />
              <Text style={styles.navLinkText}>Help</Text>
            </Pressable>
          </View>

          {/* Developer Mention Section */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Developed by Khalique Hussain</Text>
              <Text style={styles.footerSubtext}>for any queries contact me at-</Text>

              {/* Social Media Icons */}
              <View style={styles.socialMediaIcons}>
                <Pressable 
                  style={styles.socialIcon}
                  onPress={() => handleSocialMediaPress("https://facebook.com")}
                >
                  <FontAwesome name="facebook" size={24} color="#3b5998" />
                </Pressable>
                <Pressable 
                  style={styles.socialIcon}
                  onPress={() => handleSocialMediaPress("https://x.com/KhaliqHussainnn")}
                >
                  <FontAwesome name="twitter" size={24} color="#1da1f2" />
                </Pressable>
                <Pressable 
                  style={styles.socialIcon}
                  onPress={() => handleSocialMediaPress("https://www.instagram.com/khaliqhussain_/")}
                >
                  <FontAwesome name="instagram" size={24} color="#e1306c" />
                </Pressable>
                <Pressable 
                  style={styles.socialIcon}
                  onPress={() => handleSocialMediaPress("http://linkedin.com/in/khaliquehussain7")}
                >
                  <FontAwesome name="linkedin" size={24} color="#0077b5" />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    flex: 1,
    backgroundColor: "#192841",
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    paddingBottom: 50,

  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    flexGrow: 1, // Ensures content can grow and be scrollable
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4EBD0",
    marginTop: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  profileImageContainer: {
    padding: 3,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F4EBD0",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(244, 235, 208, 0.7)",
  },
  navLinksContainer: {
    gap: 12,
    marginBottom: 36, // Added margin to ensure space before footer
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  navLinkPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ scale: 0.98 }],
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F4EBD0",
    marginLeft: 12,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 24,
  },
  footerContent: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F4EBD0",
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: "rgba(244, 235, 208, 0.7)",
    marginBottom: 16,
  },
  socialMediaIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialIcon: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default LeftSidebar;