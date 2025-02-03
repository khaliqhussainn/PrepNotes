import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext"; // Import the useTheme hook

const GEMINI_API_KEY = "AIzaSyCvoVrIPhY9nfN7ykkV5n-BWfBlg36e3WU";

// Topic configurations with API endpoints and prompts
const topicConfig = {
  algorithms: {
    title: 'Algorithms & Data Structures',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about algorithms and data structures. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
  programming: {
    title: 'Programming Fundamentals',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about programming fundamentals. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
  databases: {
    title: 'Database Systems',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about database systems. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
  networking: {
    title: 'Computer Networks',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about computer networking. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
  C: {
    title: 'C Programming',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about c programming language. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
  python: {
    title: 'Python',
    triviaCategoryId: 18,
    aiPrompt: 'Create 20 multiple choice questions about python language. For each question, provide: 1) The question text 2) Four answer options 3) The correct answer 4) A brief explanation of why it\'s correct. Format as JSON array.',
  },
};

// Utility function to decode HTML entities (platform-agnostic)
const decodeHTMLEntities = (text) => {
  if (!text) return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

// Utility function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to fetch questions from Open Trivia DB
const fetchTriviaQuestions = async (category, amount = 20) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple&difficulty=medium`
    );
    const data = await response.json();

    if (data.response_code === 0) {
      return data.results.map(q => ({
        question: decodeHTMLEntities(q.question),
        options: shuffleArray([...q.incorrect_answers, q.correct_answer].map(decodeHTMLEntities)),
        correctAnswer: decodeHTMLEntities(q.correct_answer),
        explanation: 'This question was fetched from Open Trivia Database.',
        source: 'trivia_db'
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return null;
  }
};

// Function to generate questions using Gemini API
const generateAIQuestions = async (prompt) => {
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
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Extract the JSON array from the response
    const jsonStr = generatedContent.substring(
      generatedContent.indexOf('['),
      generatedContent.lastIndexOf(']') + 1
    );

    const questions = JSON.parse(jsonStr);

    return questions.map(q => ({
      ...q,
      options: shuffleArray(q.options),
      source: 'ai_generated'
    }));
  } catch (error) {
    console.error('Error generating AI questions:', error);
    return null;
  }
};

const QuizScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme(); // Get the current theme
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem('quizProgress');
      if (progress) {
        setUserProgress(JSON.parse(progress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (topicName, newScore) => {
    try {
      const updatedProgress = {
        ...userProgress,
        [topicName]: {
          lastScore: newScore,
          completedAt: new Date().toISOString(),
          attempts: (userProgress[topicName]?.attempts || 0) + 1,
          bestScore: Math.max(newScore, userProgress[topicName]?.bestScore || 0),
        },
      };
      await AsyncStorage.setItem('quizProgress', JSON.stringify(updatedProgress));
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const fetchQuestions = async (topicName) => {
    setLoading(true);
    setError(null);

    try {
      // First try to fetch from Trivia DB
      const triviaQuestions = await fetchTriviaQuestions(
        topicConfig[topicName].triviaCategoryId
      );

      if (triviaQuestions && triviaQuestions.length >= 20) {
        setQuestions(triviaQuestions);
      } else {
        // Fallback to Gemini-generated questions
        const aiQuestions = await generateAIQuestions(
          topicConfig[topicName].aiPrompt
        );

        if (aiQuestions) {
          setQuestions(aiQuestions);
        } else {
          throw new Error('Failed to fetch or generate questions');
        }
      }
    } catch (error) {
      setError('Failed to load questions. Please try again.');
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (topicName) => {
    setCurrentTopic(topicName);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    await fetchQuestions(topicName);
  };

  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    const currentQuestionData = questions[currentQuestion];

    if (selectedOption === currentQuestionData.correctAnswer) {
      setScore(score + 1);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const stopQuiz = () => {
    Alert.alert(
      "Stop Quiz",
      "Are you sure you want to stop? Your current progress will be saved.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Stop",
          onPress: finishQuiz
        }
      ]
    );
  };

  const finishQuiz = async () => {
    const finalScore = (score / questions.length) * 100;
    await saveProgress(currentTopic, finalScore);
    setShowResult(true);
  };

  if (!currentTopic) {
    return (
      <LinearGradient colors={isDarkMode ? ['#000', '#000'] : ['#0070F0', '#FFF']} style={styles(isDarkMode).container}>
        <SafeAreaView style={styles(isDarkMode).safeArea}>
          <ScrollView contentContainerStyle={styles(isDarkMode).scrollContainer}>
            <Text style={styles(isDarkMode).header}>Computer Science Topics</Text>
            {Object.entries(topicConfig).map(([topic, config]) => (
              <TouchableOpacity
                key={topic}
                style={styles(isDarkMode).topicButton}
                onPress={() => startQuiz(topic)}
              >
                <Text style={styles(isDarkMode).topicButtonText}>{config.title}</Text>
                {userProgress[topic] && (
                  <View style={styles(isDarkMode).progressContainer}>
                    <Text style={styles(isDarkMode).progressText}>
                      Last Score: {userProgress[topic].lastScore.toFixed(1)}%
                    </Text>
                    <Text style={styles(isDarkMode).progressText}>
                      Best Score: {userProgress[topic].bestScore?.toFixed(1) || 0}%
                    </Text>
                    <Text style={styles(isDarkMode).progressText}>
                      Attempts: {userProgress[topic].attempts}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showResult) {
    return (
      <LinearGradient colors={isDarkMode ? ['#1A1A1A', '#2A2A2A'] : ['#0070F0', '#FFF']} style={styles(isDarkMode).container}>
        <SafeAreaView style={styles(isDarkMode).safeArea}>
          <View style={styles(isDarkMode).centerContainer}>
            <Text style={styles(isDarkMode).header}>Quiz Complete!</Text>
            <Text style={styles(isDarkMode).resultText}>
              Final Score: {((score / questions.length) * 100).toFixed(1)}%
            </Text>
            <Text style={styles(isDarkMode).resultDetails}>
              Correct Answers: {score} out of {questions.length}
            </Text>
            <TouchableOpacity
              style={styles(isDarkMode).button}
              onPress={() => setCurrentTopic(null)}
            >
              <Text style={styles(isDarkMode).buttonText}>Back to Topics</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <LinearGradient colors={isDarkMode ? ['#1A1A1A', '#2A2A2A'] : ['#0070F0', '#FFF']} style={styles(isDarkMode).container}>
        <SafeAreaView style={styles(isDarkMode).safeArea}>
          <View style={styles(isDarkMode).centerContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? "#FFF" : "#0070F0"} />
            <Text style={styles(isDarkMode).loadingText}>Loading questions...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={isDarkMode ? ['#1A1A1A', '#2A2A2A'] : ['#0070F0', '#FFF']} style={styles(isDarkMode).container}>
        <SafeAreaView style={styles(isDarkMode).safeArea}>
          <View style={styles(isDarkMode).centerContainer}>
            <Text style={styles(isDarkMode).errorText}>{error}</Text>
            <TouchableOpacity
              style={styles(isDarkMode).button}
              onPress={() => startQuiz(currentTopic)}
            >
              <Text style={styles(isDarkMode).buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <LinearGradient colors={isDarkMode ? ['#1A1A1A', '#2A2A2A'] : ['#0070F0', '#FFF']} style={styles(isDarkMode).container}>
      <SafeAreaView style={styles(isDarkMode).safeArea}>
        <View style={styles(isDarkMode).quizHeader}>
          <Text style={styles(isDarkMode).questionCount}>
            Question {currentQuestion + 1}/{questions.length}
          </Text>
          <Text style={styles(isDarkMode).scoreText}>
            Current Score: {((score / (currentQuestion + 1)) * 100).toFixed(1)}%
          </Text>
        </View>

        <Text style={styles(isDarkMode).questionSource}>
          Source: {currentQuestionData.source === 'trivia_db' ? 'Trivia Database' : 'AI Generated'}
        </Text>
        <Text style={styles(isDarkMode).question}>{currentQuestionData.question}</Text>

        {currentQuestionData.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles(isDarkMode).optionButton,
              selectedAnswer && {
                backgroundColor: option === currentQuestionData.correctAnswer
                  ? '#90EE90'
                  : option === selectedAnswer && option !== currentQuestionData.correctAnswer
                    ? '#FFB6C1'
                    : isDarkMode ? '#333' : '#f0f0f0'
              }
            ]}
            onPress={() => !selectedAnswer && handleAnswer(option)}
            disabled={!!selectedAnswer}
          >
            <Text style={styles(isDarkMode).optionButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View style={styles(isDarkMode).explanationContainer}>
            <Text style={styles(isDarkMode).explanationText}>
              {currentQuestionData.explanation}
            </Text>
            <TouchableOpacity
              style={styles(isDarkMode).nextButton}
              onPress={nextQuestion}
            >
              <Text style={styles(isDarkMode).buttonText}>
                {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles(isDarkMode).stopButton}
              onPress={stopQuiz}
            >
              <Text style={styles(isDarkMode).buttonText}>Stop Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: isDark ? '#FFF' : '#0070F0',
  },
  loadingText: {
    fontSize: 16,
    color: isDark ? '#FFF' : '#0070F0',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: isDark ? '#FF6B6B' : '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  topicButton: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  topicButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#0070F0',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    color: isDark ? '#FFF' : '#0070F0',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#0070F0',
  },
  scoreText: {
    fontSize: 16,
    color: isDark ? '#FFF' : '#0070F0',
  },
  questionSource: {
    fontSize: 14,
    color: isDark ? '#FFF' : '#0070F0',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDark ? '#FFF' : '#0070F0',
  },
  optionButton: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionButtonText: {
    fontSize: 16,
    color: isDark ? '#FFF' : '#0070F0',
  },
  explanationContainer: {
    marginTop: 20,
  },
  explanationText: {
    fontSize: 16,
    color: isDark ? '#FFF' : '#0070F0',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: isDark ? '#0070F0' : '#0070F0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  stopButton: {
    backgroundColor: isDark ? '#FF6B6B' : '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: isDark ? '#FFF' : '#FFF',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: isDark ? '#FFF' : '#0070F0',
  },
  resultDetails: {
    fontSize: 16,
    color: isDark ? '#FFF' : '#0070F0',
    marginBottom: 20,
  },
  button: {
    backgroundColor: isDark ? '#0070F0' : '#0070F0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default QuizScreen;
