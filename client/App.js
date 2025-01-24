import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import Firebase from './firebase';
import "./globals.css";

export default function App() {
  return (
    <>
      {/* <Firebase /> */}
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </>
  );
}

