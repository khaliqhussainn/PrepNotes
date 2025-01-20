import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = "http://192.168.1.37:5000/api";

const ResourcesScreen = () => {
  const [resources, setResources] = useState({ notes: {}, questions: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    type: "",
    subject: "",
    course: "",
    folder: "",
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/files`);
      setResources(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch resources");
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchResources();
    }, [])
  );

  const pickAndUploadDocument = async () => {
    try {
      if (!formData.folder) {
        Alert.alert("Error", "Please specify a folder name");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const form = new FormData();
      form.append("file", {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        type: file.mimeType,
        name: file.name,
      });

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      });

      await axios.post(`${API_URL}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data, headers) => {
          return data;
        },
      });

      Alert.alert("Success", "File uploaded successfully");
      setFormData({
        title: "",
        year: "",
        type: "",
        subject: "",
        course: "",
        folder: "",
      });
      fetchResources();
    } catch (error) {
      Alert.alert("Error", "Failed to upload file");
      console.error("File upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${API_URL}/files/${fileId}`);
      fetchResources();
      Alert.alert("Success", "File deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete file");
      console.error("Delete error:", error);
    }
  };

  const renderFileItem = (file) => (
    <TouchableOpacity
      key={file.id}
      style={styles.fileItem}
      onPress={() => Linking.openURL(file.url)}
    >
      <View style={styles.fileItemContent}>
        <View style={styles.fileIconContainer}>
          <MaterialIcons 
            name={file.extension === "PDF" ? "picture-as-pdf" : "description"} 
            size={24} 
            color="#0067cc" 
          />
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{file.title || "Untitled"}</Text>
          <Text style={styles.fileInfo}>
            {file.subject && `${file.subject} • `}
            {file.year && `${file.year} • `}
            {file.extension}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete File",
              "Are you sure you want to delete this file?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => deleteFile(file.id), style: "destructive" }
              ]
            );
          }}
        >
          <MaterialIcons name="delete" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0067cc" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchResources} />}
    >
      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Upload New Document</Text>
        <TextInput
          style={styles.input}
          placeholder="Title (optional)"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Year"
          value={formData.year}
          onChangeText={(text) => setFormData({ ...formData, year: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Type (notes/questions)"
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={formData.subject}
          onChangeText={(text) => setFormData({ ...formData, subject: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Course"
          value={formData.course}
          onChangeText={(text) => setFormData({ ...formData, course: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Folder (required)"
          value={formData.folder}
          onChangeText={(text) => setFormData({ ...formData, folder: text })}
        />
        <TouchableOpacity 
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]} 
          onPress={pickAndUploadDocument}
          disabled={uploading}
        >
          <Text style={styles.uploadButtonText}>
            {uploading ? "Uploading..." : "Pick & Upload Document"}
          </Text>
        </TouchableOpacity>
      </View>

      {Object.entries(resources).map(([section, folders]) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.charAt(0).toUpperCase() + section.slice(1)}</Text>
          {Object.keys(folders).length === 0 ? (
            <Text style={styles.emptyText}>No {section} available</Text>
          ) : (
            Object.entries(folders).map(([folderName, files]) => (
              <View key={folderName} style={styles.folderContainer}>
                <Text style={styles.folderTitle}>{folderName}</Text>
                {files.map(renderFileItem)}
              </View>
            ))
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 15,
    marginBottom: 10,
  },
  uploadSection: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    margin: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  folderContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  fileItem: {
    marginBottom: 8,
  },
  fileItemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 6,
  },
  fileIconContainer: {
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  fileInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0067cc',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  uploadButton: {
    backgroundColor: '#0067cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: '#99c2ea',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    paddingVertical: 20,
  },
});

export default ResourcesScreen;
