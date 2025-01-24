import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CourseCard = ({ title, description, onPress, gradient, icon }) => (
  <TouchableOpacity onPress={onPress} style={styles.courseCard}>
    <LinearGradient
      colors={gradient}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color="#FFFFFF" />
        </View>
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseDescription}>{description}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Semesters</Text>
        </View>
        <TouchableOpacity style={styles.learnMore}>
          {/* <Text style={styles.learnMoreText}>Learn More</Text> */}
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const MainScreen = ({ navigation }) => {
  const courses = [
    {
      title: "BCA",
      description: "Bachelor of Computer Applications",
      gradient: ["#192841", "#2c3e50"],
      icon: "desktop-outline",
    },
    {
      title: "B.TECH",
      description: "Bachelor of Technology",
      gradient: ["#192841", "#2c3e50"],
      icon: "construct-outline",
    },
    {
      title: "BSC",
      description: "Bachelor of Science",
      gradient: ["#192841", "#2c3e50"],
      icon: "flask-outline",
    },
    {
      title: "MCA",
      description: "Master of Computer Applications",
      gradient: ["#192841", "#2c3e50"],
      icon: "code-slash-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Explore Courses</Text>
        <Text style={styles.subtitle}>Find your perfect program</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            description={course.description}
            gradient={course.gradient}
            icon={course.icon}
            onPress={() => navigation.navigate(course.title)}
          />
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#192841",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  filterButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
  },
  courseCard: {
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    marginTop: 20,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  stat: {
    marginRight: 20,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  learnMoreText: {
    color: "#FFFFFF",
    marginRight: 4,
    fontSize: 14,
    fontWeight: "500",
  },
});
