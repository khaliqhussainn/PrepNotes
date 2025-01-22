import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

// Constants
const API_URL = "http://192.168.1.37:5000/api";
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const INITIAL_FORM_STATE = {
  title: '',
  year: '',
  type: '',
  subject: '',
  course: '',
  folder: '',
};

const YEAR_MAPPING = {
  '1st Year': '2023',
  '2nd Year': '2024',
  '3rd Year': '2025',
};

const ResourcesScreen = () => {
  // State Management
  const [resources, setResources] = useState({ notes: {}, questions: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Fetch Resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/files`, {
        params: { year: YEAR_MAPPING[selectedYear] },
      });
      setResources(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch resources';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchResources();
    }, [selectedYear])
  );

  // Handle File Opening
  const handleFileOpen = async (fileUrl) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);

      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert(
          'Cannot Open File',
          'Your device doesn\'t support opening this type of file.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert(
        'Error',
        'Unable to open the file. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  // Form Input Handler
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Validate Form
  const validateForm = () => {
    const requiredFields = ['folder', 'type'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in the following fields: ${missingFields.join(', ')}`,
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // File Upload Handler
  const handleFileUpload = async () => {
    if (!validateForm()) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_FILE_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const form = new FormData();
      form.append('file', {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        type: file.mimeType,
        name: file.name,
      });

      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      });

      await axios.post(`${API_URL}/files`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: (data) => data,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      Alert.alert('Success', 'File uploaded successfully');
      setFormData(INITIAL_FORM_STATE);
      fetchResources();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      Alert.alert('Error', errorMessage);
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Render File Item
  const renderFileItem = useCallback(({ item: file }) => (
    <TouchableOpacity
      key={file.id}
      style={styles.fileItem}
      onPress={() => handleFileOpen(file.url)}
      activeOpacity={0.7}
    >
      <View style={styles.fileContent}>
        <View style={styles.fileHeader}>
          <MaterialIcons
            name={file.extension?.toUpperCase() === 'PDF' ? 'picture-as-pdf' : 'description'}
            size={24}
            color="rgba(255,255,255,0.1"
            style={styles.fileIcon}
          />
          <Text style={styles.fileName} numberOfLines={1}>
            {file.title || 'Untitled'}
          </Text>
          <View style={styles.fileTypeBadge}>
            <Text style={styles.fileType}>{file.extension}</Text>
          </View>
        </View>

        <View style={styles.fileDetails}>
          {file.subject && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{file.subject}</Text>
            </View>
          )}
          {file.year && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{file.year}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  // Render Input Field
  const renderInput = useCallback(({ placeholder, value, key, required = false }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, formData[key] && styles.inputFilled]}
        placeholder={`${placeholder}${required ? ' *' : ''}`}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={(text) => handleInputChange(key, text)}
      />
    </View>
  ), [formData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchResources}
              colors={['#6366f1']}
            />
          }
        >
          <View style={styles.yearFilterContainer}>
            <TouchableOpacity
              style={[styles.yearFilterButton, selectedYear === '1st Year' && styles.yearFilterButtonSelected]}
              onPress={() => setSelectedYear('1st Year')}
            >
              <Text style={styles.yearFilterButtonText}>1st Year</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.yearFilterButton, selectedYear === '2nd Year' && styles.yearFilterButtonSelected]}
              onPress={() => setSelectedYear('2nd Year')}
            >
              <Text style={styles.yearFilterButtonText}>2nd Year</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.yearFilterButton, selectedYear === '3rd Year' && styles.yearFilterButtonSelected]}
              onPress={() => setSelectedYear('3rd Year')}
            >
              <Text style={styles.yearFilterButtonText}>3rd Year</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>Upload New Document</Text>
            <View style={styles.formContainer}>
              {renderInput({ placeholder: 'Document Title', value: formData.title, key: 'title' })}
              {renderInput({ placeholder: 'Year', value: formData.year, key: 'year' })}
              {renderInput({ placeholder: 'Type (notes/questions)', value: formData.type, key: 'type', required: true })}
              {renderInput({ placeholder: 'Subject', value: formData.subject, key: 'subject' })}
              {renderInput({ placeholder: 'Course', value: formData.course, key: 'course' })}
              {renderInput({ placeholder: 'Folder Name', value: formData.folder, key: 'folder', required: true })}

              <TouchableOpacity
                style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
                onPress={handleFileUpload}
                disabled={uploading}
              >
                <View style={styles.uploadButtonContent}>
                  {uploading && (
                    <ActivityIndicator size="small" color="#ffffff" style={styles.uploadingSpinner} />
                  )}
                  <Text style={styles.uploadButtonText}>
                    {uploading ? 'Uploading...' : 'Select & Upload Document'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {Object.entries(resources).map(([section, folders]) => (
            <View key={section} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Text>
              {Object.keys(folders).length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="folder-open" size={48} color="#94a3b8" />
                  <Text style={styles.emptyText}>No {section} available</Text>
                </View>
              ) : (
                Object.entries(folders).map(([folderName, files]) => (
                  <View key={folderName} style={styles.folderContainer}>
                    <View style={styles.folderHeader}>
                      <MaterialIcons name="folder" size={24} color="rgba(255,255,255,0.1" />
                      <Text style={styles.folderTitle}>{folderName}</Text>
                    </View>
                    <View style={styles.filesGrid}>
                      {files.map(file => renderFileItem({ item: file }))}
                    </View>
                  </View>
                ))
              )}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  yearFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  yearFilterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  yearFilterButtonSelected: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
  },
  yearFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  uploadSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  inputFilled: {
    backgroundColor: '#ffffff',
    borderColor: '#6366f1',
  },
  uploadButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadButtonDisabled: {
    backgroundColor: '#c7d2fe',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingSpinner: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  folderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  filesGrid: {
    gap: 12,
  },
  fileItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  fileContent: {
    padding: 16,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  fileTypeBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fileType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.1',
    fontWeight: '500',
  },
  fileDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  fileSubject: {
    fontSize: 14,
    color: "#64748b",
  },
  fileYear: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});

export default ResourcesScreen;
