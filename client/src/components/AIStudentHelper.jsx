import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";

const { width, height } = Dimensions.get("window");

const GEMINI_API_KEY = "AIzaSyCvoVrIPhY9nfN7ykkV5n-BWfBlg36e3WU";

const AIStudentHelper = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage = { text: msg, sender: "user" };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setMsg("");

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Full API Response:", data);

      let reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      reply = reply.replace(/\*/g, "");

      const geminiMessage = { text: reply, sender: "gemini" };
      setMessages((prevMessages) => [geminiMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Error occurred", sender: "gemini" };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.geminiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === "user"
            ? styles.userMessageText
            : styles.geminiMessageText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#fff" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Docs AI</Text>
          </View>

          {messages.length === 0 && (
            <Animated.View
              style={[styles.welcomeContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.welcomeText}>Ask Your Query</Text>
              <Text style={styles.subWelcomeText}>
                Your AI Student Assistant
              </Text>
            </Animated.View>
          )}

          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.messagesContainer}
              inverted
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={msg}
                onChangeText={setMsg}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleButtonClick}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#192841", // Deepened base background color
    },
    safeArea: {
      flex: 1,
      width: width,
      height: height,
    },
    header: {
      paddingVertical: 15,
      alignItems: "center",
      backgroundColor: "rgba(25, 40, 65, 0.7)", // Slightly darker header
    },
    headerText: {
      color: "#4ECDC4", // Accent color for text
      fontSize: 24,
      fontWeight: "bold",
    },
    welcomeContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
    },
    welcomeText: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#4ECDC4", // Consistent accent color
      marginBottom: 10,
    },
    subWelcomeText: {
      fontSize: 18,
      color: "rgba(78, 205, 196, 0.7)", // Lighter version of accent color
    },
    keyboardContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    messagesContainer: {
      paddingHorizontal: 15,
      paddingBottom: 20,
    },
    message: {
      maxWidth: "80%",
      padding: 15,
      borderRadius: 20,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "rgba(25, 40, 65, 0.9)", // Dark blue for user messages
    },
    geminiMessage: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(78, 205, 196, 0.8)", // Accent color for AI messages
    },
    messageText: {
      fontSize: 16,
      color: "white",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: "rgba(25, 40, 65, 0.3)", // Consistent dark background
    },
    input: {
      flex: 1,
      maxHeight: 100,
      backgroundColor: "rgba(78, 205, 196, 0.2)", // Accent color with transparency
      color: "white",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 10,
      fontSize: 16,
    },
    sendButton: {
      backgroundColor: "rgba(78, 205, 196, 0.8)", // Accent color for send button
      borderRadius: 25,
      padding: 12,
      width: 70,
      alignItems: "center",
    },
    sendButtonText: {
      color: "#192841", // Dark text on accent background
      fontWeight: "bold",
    },
  });

export default AIStudentHelper;
