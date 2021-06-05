/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// An ErrorBoundary Hoc can be included to handle all errros and display at one place

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import commonStyle from './commonStyles';
import Login from './Views/Login';
import Home from './Views/Home';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [authenticatedUser, setUserAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [authenticatedUser]);

  const checkAuth = () =>
    AsyncStorage.getItem('user', (e, data) => {
      const parsedData = data && JSON.stringify(data);
      const exists =
        parsedData &&
        parsedData['email'] !== '' &&
        parsedData['password'] !== '';
      setUserAuth(exists);
    });

  const onLoginSuccess = () => setUserAuth(true);

  const onLogoutSuccess = () => setUserAuth(false);

  const navigateUser = () =>
    authenticatedUser ? (
      <Home logout={onLogoutSuccess} />
    ) : (
      <Login onLoginSuccess={onLoginSuccess} />
    );

  return (
    <SafeAreaView style={commonStyle.parentContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={commonStyle.scrollContainer}>
        <View style={commonStyle.viewContainer}>{navigateUser()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
