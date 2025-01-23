import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../HomeScreen";
import Main from "../MainScreen";
import Bca from "../courses/main/Bca";
import Bsc from "../courses/main/Bsc";
import Btech from "../courses/main/Btech";
import firebase from "../../firebase";
import LeftSidebar from "../components/LeftSideBar";
import Settings from "../components/Settings";
import Help from "../components/Help";
import Profile from "../components/Profile";
import StudyPlanner from "../components/StudyPlanner";
import GroupChat from "../components/GroupChat";
import AIStudentHelper from "../components/AIStudentHelper";
import Roadmap from "../components/Roadmap";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Firebase" component={firebase} options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeftSidebar"
          component={LeftSidebar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Courses"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BCA" options={{ headerShown: false }} component={Bca} />
        <Stack.Screen name="BSC" options={{ headerShown: false }} component={Bca} />
        <Stack.Screen name="BTECH" options={{ headerShown: false }} component={Btech} />
        {/* <Stack.Screen name="LeftSidebar" component={LeftSidebar} /> */}
        <Stack.Screen name="Settings" options={{ headerShown: false }} component={Settings} />
        <Stack.Screen name="Help" options={{ headerShown: false }} component={Help} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} component={Profile} />
        <Stack.Screen name="StudyPlanner" options={{ headerShown: false }} component={StudyPlanner} />
        <Stack.Screen name="GroupChat" options={{ headerShown: false }} component={GroupChat} />
        <Stack.Screen name="AIStudentHelper" options={{ headerShown: false }} component={AIStudentHelper} />
        <Stack.Screen name="Roadmap" options={{ headerShown: false }} component={Roadmap} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
