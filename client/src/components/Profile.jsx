import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";

// Updated color scheme
const PRIMARY_COLOR = "#0070F0";
const SECONDARY_COLOR = "#4B8FB3";
const ACCENT_COLOR = "#3A7DA1";
const BACKGROUND_COLOR_LIGHT = "#FFFFFF";
const BACKGROUND_COLOR_DARK = "#000000";
const TEXT_DARK = "#2C3E50";
const TEXT_LIGHT = "#607D8B";
const TEXT_COLOR_DARK = "#FFFFFF";
const TEXT_COLOR_LIGHT = "#000000";

const Profile = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [image, setImage] = useState(null);

  const gradientColors = isDarkMode ? ["#000000", "#000000"] : ["#0070F0", "#62B1DD"];
  const gradientLocations = [0, 0.5, 1];
  const gradientStart = { x: 0, y: 0 };
  const gradientEnd = { x: 1, y: 1 };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
        imageUrl: currentUser.photoURL || "../../assets/profile-photo.jpg",
      });
      setName(currentUser.displayName || "");
      setCourse("");
    }
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Auth");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdateProfile = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      updateProfile(currentUser, {
        displayName: name,
        photoURL: image ? image : user.imageUrl,
      })
        .then(() => {
          setUser({
            name: name,
            email: currentUser.email,
            imageUrl: image ? image : user.imageUrl,
          });
          Alert.alert("Success", "Profile updated successfully!");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles(isDarkMode).safeArea}>
      <ScrollView
        contentContainerStyle={styles(isDarkMode).scrollViewContent}
        showsVerticalScrollIndicator={false}
        style={styles(isDarkMode).container}
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={styles(isDarkMode).header}
        >
          <Text style={styles(isDarkMode).title}>Profile</Text>
          <Text style={styles(isDarkMode).subtitle}>Manage your profile information</Text>
        </LinearGradient>

        <View style={styles(isDarkMode).contentContainer}>
          <View style={styles(isDarkMode).card}>
            <View style={styles(isDarkMode).userInfo}>
              <Pressable onPress={pickImage} style={styles(isDarkMode).imageContainer}>
                <Image
                  source={{ uri: image ? image : user?.imageUrl }}
                  style={styles(isDarkMode).profileImage}
                  alt="profile"
                />
                <View style={styles(isDarkMode).imageOverlay}>
                  <Ionicons name="camera" size={24} color={isDarkMode ? TEXT_COLOR_DARK : BACKGROUND_COLOR_LIGHT} />
                </View>
              </Pressable>
              <View style={styles(isDarkMode).userDetails}>
                <Text style={styles(isDarkMode).userName}>{user?.name}</Text>
                <Text style={styles(isDarkMode).userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles(isDarkMode).inputContainer}>
              <Text style={styles(isDarkMode).inputLabel}>Full Name</Text>
              <TextInput
                style={styles(isDarkMode).input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={TEXT_LIGHT}
              />

              <Text style={styles(isDarkMode).inputLabel}>Course</Text>
              <TextInput
                style={styles(isDarkMode).input}
                placeholder="Enter your course"
                value={course}
                onChangeText={setCourse}
                placeholderTextColor={TEXT_LIGHT}
              />

              <Pressable
                style={({ pressed }) => [
                  styles(isDarkMode).saveButton,
                  pressed && styles(isDarkMode).buttonPressed,
                ]}
                onPress={handleUpdateProfile}
              >
                <LinearGradient
              colors={isDarkMode ? ["#0070F0", "#0070F0"] : ["#0070F0", "#62B1DD"]}
              start={gradientStart}
                  end={gradientEnd}
                  style={styles(isDarkMode).gradientButton}
                >
                  <Text style={styles(isDarkMode).saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          <View style={styles(isDarkMode).card}>
            <Text style={styles(isDarkMode).sectionTitle}>Quick Actions</Text>
            <View style={styles(isDarkMode).optionsContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles(isDarkMode).option,
                  pressed && styles(isDarkMode).optionPressed,
                ]}
                onPress={() => navigation.navigate("Help")}
              >
                <View style={[styles(isDarkMode).optionIcon, { backgroundColor: PRIMARY_COLOR }]}>
                  <Ionicons name="help-circle" size={24} color={isDarkMode ? TEXT_COLOR_DARK : BACKGROUND_COLOR_LIGHT} />
                </View>
                <View style={styles(isDarkMode).optionContent}>
                  <Text style={styles(isDarkMode).optionTitle}>Help & Support</Text>
                  <Text style={styles(isDarkMode).optionDescription}>
                    Get assistance and answers to your questions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={PRIMARY_COLOR} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles(isDarkMode).option,
                  pressed && styles(isDarkMode).optionPressed,
                ]}
                onPress={handleLogout}
              >
                <View style={[styles(isDarkMode).optionIcon, { backgroundColor: "#FF5757" }]}>
                  <Ionicons name="log-out" size={24} color={isDarkMode ? TEXT_COLOR_DARK : BACKGROUND_COLOR_LIGHT} />
                </View>
                <View style={styles(isDarkMode).optionContent}>
                  <Text style={[styles(isDarkMode).optionTitle, styles(isDarkMode).logoutText]}>
                    Logout
                  </Text>
                  <Text style={styles(isDarkMode).optionDescription}>
                    Sign out from your account
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FF5757" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: isDark ? TEXT_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.6)",
  },
  card: {
    backgroundColor: isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: isDark ? "#333333" : "#F0F0F0",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: PRIMARY_COLOR,
  },
  imageOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userDetails: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: isDark ? TEXT_COLOR_DARK : TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: isDark ? TEXT_COLOR_DARK : TEXT_LIGHT,
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: isDark ? TEXT_COLOR_DARK : TEXT_DARK,
    marginBottom: -4,
  },
  input: {
    backgroundColor: isDark ? "#333333" : "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? TEXT_COLOR_DARK : TEXT_DARK,
    borderWidth: 1,
    borderColor: isDark ? "#444444" : "#E2E8F0",
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 16,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: isDark ? TEXT_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: isDark ? TEXT_COLOR_DARK : TEXT_DARK,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: isDark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? "#444444" : "#E2E8F0",
  },
  optionPressed: {
    backgroundColor: isDark ? "#444444" : "#F7FAFC",
    transform: [{ scale: 0.98 }],
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: isDark ? TEXT_COLOR_DARK : TEXT_DARK,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: isDark ? TEXT_COLOR_DARK : TEXT_LIGHT,
  },
  logoutText: {
    color: "#FF5757",
  },
});

export default Profile;
