import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from '@firebase/database';
import { getAuth } from '@firebase/auth';
import Navbar from './Navbar';

const GroupChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(new Set());
  const [showUsersModal, setShowUsersModal] = useState(false);
  const flatListRef = useRef();
  const auth = getAuth();
  const database = getDatabase();
  const MESSAGES_LIMIT = 50;

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const messagesQuery = query(
      messagesRef,
      orderByChild("timestamp"),
      limitToLast(MESSAGES_LIMIT)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, msg]) => ({
            id,
            ...msg,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const uniqueUsers = new Set(messageList.map((msg) => msg.userEmail));
        setUsers(uniqueUsers);
        setMessages(messageList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    if (message.trim() && auth.currentUser) {
      const messagesRef = ref(database, "messages");
      push(messagesRef, {
        text: message.trim(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: Date.now(),
        displayName:
          auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        photoURL: auth.currentUser.photoURL,
      });
      setMessage("");
    }
  };

  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return (
        "Yesterday " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const ProfileImage = ({ user, size = 40 }) => (
    <View style={[styles.profileImage, { width: size, height: size }]}>
      {user.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={[styles.profileImage, { width: size, height: size }]}
        />
      ) : (
        <Text style={styles.profileInitials}>
          {getInitials(user.userEmail)}
        </Text>
      )}
    </View>
  );

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.userId === auth.currentUser?.uid;
    const showDateHeader =
      index === 0 ||
      new Date(item.timestamp).toDateString() !==
        new Date(messages[index - 1].timestamp).toDateString();

    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageRow,
            isCurrentUser ? styles.currentUserRow : styles.otherUserRow,
          ]}
        >
          {!isCurrentUser && <ProfileImage user={item} size={32} />}
          <View
            style={[
              styles.messageContainer,
              isCurrentUser
                ? styles.currentUserMessage
                : styles.otherUserMessage,
            ]}
          >
            {!isCurrentUser && (
              <Text style={styles.userName}>
                {item.displayName || item.userEmail.split("@")[0]}
              </Text>
            )}
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const UsersModal = () => (
    <Modal
      visible={showUsersModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUsersModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Active Users ({users.size})</Text>
          <FlatList
            data={Array.from(users)}
            renderItem={({ item }) => (
              <View style={styles.modalUserItem}>
                <ProfileImage user={{ userEmail: item }} size={40} />
                <Text style={styles.modalUserName}>{item.split("@")[0]}</Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowUsersModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => setShowUsersModal(true)}
          >
            <ProfileImage
              user={{ userEmail: auth.currentUser.email }}
              size={32}
            />
            <View style={styles.userInfo}>
              <Text style={styles.currentUserName}>
                {auth.currentUser.displayName ||
                  auth.currentUser.email.split("@")[0]}
              </Text>
              <View style={styles.onlineIndicator} />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No messages yet. Start the conversation!
            </Text>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <UsersModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#192841",
  },
  container: {
    flex: 1,
    backgroundColor: "#192841",
  },
  header: {
    padding: 12,
    backgroundColor: "#152238",
    borderBottomWidth: 1,
    borderBottomColor: "#1e3a8a",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  userInfo: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  currentUserName: {
    color: "#F4EBD0",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  profileImage: {
    borderRadius: 20,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileInitials: {
    color: "#F4EBD0",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  currentUserRow: {
    justifyContent: "flex-end",
  },
  otherUserRow: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "75%",
    marginHorizontal: 8,
  },
  currentUserMessage: {
    backgroundColor: "#1e3a8a",
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: "#152238",
    borderBottomLeftRadius: 4,
  },
  userName: {
    color: "#F4EBD0",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  messageText: {
    color: "#F4EBD0",
    fontSize: 16,
  },
  timestamp: {
    color: "#888",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateHeaderText: {
    color: "#888",
    fontSize: 12,
    backgroundColor: "#152238",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#152238",
  },
  input: {
    flex: 1,
    backgroundColor: "#192841",
    color: "#F4EBD0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#1e3a8a",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#152238",
  },
  sendButtonText: {
    color: "#F4EBD0",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#192841",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: "#F4EBD0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalUserItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#152238",
  },
  modalUserName: {
    color: "#F4EBD0",
    fontSize: 16,
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: "#1e3a8a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "#F4EBD0",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default GroupChat;
