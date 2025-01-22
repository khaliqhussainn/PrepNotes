// Navbar.js
import React, { useState , useEffect} from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import LeftSidebar from "./LeftSideBar";

const Navbar = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
  

useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "User",
        email: currentUser.email,
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      navigation.replace("Auth");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

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
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.menuButton}
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Ionicons name="menu-outline" size={30} color="#fff" />
        </Pressable>
        <View style={styles.topButtons}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.navigate("Courses")}
          >
            <Ionicons name="book-outline" size={24} color="white" />
            <Text style={styles.iconButtonText}>Courses</Text>
          </Pressable>

          <Pressable style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.iconButtonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
      {isSidebarOpen && (
        <LeftSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={user}
          navigation={navigation}
        />
      )}
    </>
  );
};

export default Navbar;

const styles = StyleSheet.create({
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
});
