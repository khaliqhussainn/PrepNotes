import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const careerRoadmaps = {
  "Data Scientist": [
    {
      stage: "Foundations",
      skills: ["Statistics", "Mathematics", "Probability"],
      color: "#3498db",
    },
    { stage: "Programming", skills: ["Python", "R", "SQL"], color: "#2ecc71" },
    {
      stage: "Machine Learning",
      skills: ["TensorFlow", "PyTorch", "Scikit-learn"],
      color: "#9b59b6",
    },
    {
      stage: "Advanced Analytics",
      skills: ["Deep Learning", "NLP", "Big Data"],
      color: "#34495e",
    },
  ],
  "Data Analyst": [
    {
      stage: "Foundations",
      skills: ["Excel", "Statistics", "Business Logic"],
      color: "#e74c3c",
    },
    {
      stage: "Data Tools",
      skills: ["Tableau", "Power BI", "SQL"],
      color: "#f39c12",
    },
    {
      stage: "Programming",
      skills: ["Python", "R", "Data Cleaning"],
      color: "#16a085",
    },
    {
      stage: "Advanced Analytics",
      skills: ["Predictive Modeling", "A/B Testing", "Dashboards"],
      color: "#2980b9",
    },
  ],
  "Software Engineer": [
    {
      stage: "Programming Basics",
      skills: ["HTML", "CSS", "JavaScript"],
      color: "#8e44ad",
    },
    {
      stage: "Frontend",
      skills: ["React", "Vue", "Angular"],
      color: "#e67e22",
    },
    {
      stage: "Backend",
      skills: ["Node.js", "Python", "Java"],
      color: "#27ae60",
    },
    {
      stage: "Full Stack",
      skills: ["Microservices", "Docker", "Cloud"],
      color: "#2c3e50",
    },
  ],
  "Cloud Architect": [
    {
      stage: "Cloud Fundamentals",
      skills: ["Network Basics", "Linux", "Virtualization"],
      color: "#d35400",
    },
    {
      stage: "Cloud Platforms",
      skills: ["AWS", "Azure", "GCP"],
      color: "#1abc9c",
    },
    {
      stage: "Advanced Architecture",
      skills: ["Kubernetes", "Terraform", "Security"],
      color: "#34495e",
    },
    {
      stage: "Cloud Strategy",
      skills: ["Cost Optimization", "Governance", "Migration"],
      color: "#16a085",
    },
  ],
  "Cybersecurity Specialist": [
    {
      stage: "Security Foundations",
      skills: ["Networking", "OS Security", "Ethics"],
      color: "#c0392b",
    },
    {
      stage: "Ethical Hacking",
      skills: ["Penetration Testing", "Cryptography", "Network Security"],
      color: "#e74c3c",
    },
    {
      stage: "Advanced Security",
      skills: ["Threat Analysis", "Incident Response", "Forensics"],
      color: "#2980b9",
    },
    {
      stage: "Specializations",
      skills: ["Cloud Security", "IoT Security", "Compliance"],
      color: "#8e44ad",
    },
  ],
  "Product Manager": [
    {
      stage: "Product Basics",
      skills: ["Design Thinking", "User Research", "Agile"],
      color: "#f1c40f",
    },
    {
      stage: "Product Strategy",
      skills: ["Market Analysis", "Business Models", "KPIs"],
      color: "#e67e22",
    },
    {
      stage: "Technical Skills",
      skills: ["Data Analysis", "Basic Coding", "UX Principles"],
      color: "#2ecc71",
    },
    {
      stage: "Leadership",
      skills: ["Team Management", "Communication", "Stakeholder Management"],
      color: "#3498db",
    },
  ],
};

const RoadmapComponent = () => {
  const [selectedCareer, setSelectedCareer] = useState("Data Scientist");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4c669f" barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Text style={styles.title}>Career Pathways</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.careerSelector}
      >
        {Object.keys(careerRoadmaps).map((career) => (
          <TouchableOpacity
            key={career}
            style={[
              styles.careerButton,
              selectedCareer === career && styles.selectedCareerButton,
            ]}
            onPress={() => setSelectedCareer(career)}
          >
            <Text
              style={[
                styles.careerButtonText,
                selectedCareer === career && styles.selectedCareerButtonText,
              ]}
            >
              {career}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.roadmapContainer}>
        <Text style={styles.roadmapTitle}>{selectedCareer} Journey</Text>
        <ScrollView
          style={styles.timelineContainer}
          showsVerticalScrollIndicator={false}
        >
          {careerRoadmaps[selectedCareer].map((stage, index) => (
            <View key={index} style={styles.timelineItem}>
              <View
                style={styles.timelineConnector(
                  index,
                  careerRoadmaps[selectedCareer].length
                )}
              />
              <View
                style={[styles.stageCircle, { backgroundColor: stage.color }]}
              >
                <Text style={styles.stageNumber}>{index + 1}</Text>
              </View>
              <View style={styles.stageContent}>
                <Text style={styles.stageTitle}>{stage.stage}</Text>
                {stage.skills.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={styles.skillItem}>
                    • {skill}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  headerBackground: {
    backgroundColor: "#4c669f",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
  },
  careerSelector: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    height: 0,
  },
  careerButton: {
    backgroundColor: "#e7e7e7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 5,
    width: width * 0.4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    height: 50,
  },
  selectedCareerButton: {
    backgroundColor: "#3498db",
  },
  careerButtonText: {
    fontWeight: "bold",
    color: "#2c3e50",
    fontSize: 14,
  },
  selectedCareerButtonText: {
    color: "white",
  },
  roadmapContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 10,
  },
  roadmapTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },
  timelineContainer: {
    paddingHorizontal: 10,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  timelineConnector: (index, total) => ({
    position: "absolute",
    left: 25,
    top: index === 0 ? 30 : 0,
    bottom: index === total - 1 ? 30 : 0,
    width: 2,
    backgroundColor: "#e0e0e0",
  }),
  stageCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  stageContent: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  skillItem: {
    marginBottom: 4,
    color: "#34495e",
    fontSize: 13,
  },
});

export default RoadmapComponent;
