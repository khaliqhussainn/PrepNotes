import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import LeftSidebar from "./components/LeftSideBar";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signOut } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import StudyPlanner from './components/StudyPlanner'; // Import the StudyPlanner component
import Navbar from "./components/Navbar";
import GroupChat from "./components/GroupChat"; // Import the GroupChat component

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const courses = [
    {
      id: 1,
      name: "Courses",
      image: "https://link-to-react-native-image.jpg",
      link: "Courses",
      icon: "book-outline",
    },
    {
      id: 2,
      name: "Roadmaps",
      image: "https://link-to-js-image.jpg",
      link: "Roadmaps",
      icon: "map-outline",
    },
    {
      id: 3,
      name: "JHU Entrance PYQ",
      image: "https://link-to-firebase-image.jpg",
      link: "Entrance",
      icon: "school-outline",
    },
    {
      id: 4,
      name: "Study Planner",
      image: "https://link-to-study-planner-image.jpg",
      link: "StudyPlanner",
      icon: "calendar-outline",
    },
    {
      id: 5,
      name: "Group Chat",
      image: "https://link-to-group-chat-image.jpg",
      link: "GroupChat",
      icon: "chatbubbles-outline",
    },
  ];

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
      });
    }
  }, []);

  const renderCourse = ({ item }) => (
    <Pressable
      style={styles.courseContainer}
      onPress={() => navigation.navigate(item.link)}
    >
      <View style={styles.courseIconContainer}>
        <Ionicons name={item.icon} size={40} color="#fff" />
      </View>
      <Text style={styles.courseName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      {isSidebarOpen && (
        <LeftSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={user}
          navigation={navigation}
        />
      )}

      <View style={[styles.mainContent, isSidebarOpen && styles.dimmedContent]}>
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.coursesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={styles.bottomButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Profile</Text>
        </Pressable>

        <Pressable
          style={styles.bottomButton}
          onPress={() => navigation.navigate("Help")}
        >
          <Ionicons name="help-outline" size={24} color="white" />
          <Text style={styles.bottomButtonText}>Help</Text>
        </Pressable>
      </View>

      {/* Floating Action Button for Group Chat */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("GroupChat")}
      >
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#192841",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  topButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  iconButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
  dimmedContent: {
    opacity: 0.3,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  coursesList: {
    padding: 16,
    gap: 16,
  },
  courseContainer: {
    backgroundColor: "#192841",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    width: width - 32,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  courseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  courseName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#192841",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  bottomButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#192841",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
