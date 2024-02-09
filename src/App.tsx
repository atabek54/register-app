/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import DrawerNavigator from './navigators/DrawerNavigator';
import AuthScreen from './screens/auth'; // AuthScreen'ı içe aktardık
import SQLite from 'react-native-sqlite-2';
import {initializeDatabase} from './services/database';
import {UserProvider, useUser} from './context/user_context';
import {deleteUser, getUser} from './services/async_storage';

const App: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Kullanıcı giriş yaptı mı?
  const {user} = useUser();

  useEffect(() => {
    initializeDatabase();
    setUserLoggedIn(false);
    const getToken = async () => {
      const token = await getUser();
      console.log('Token: ' + token);
    };
    getToken();
  }, []);
  return (
    <UserProvider>
      <NavigationContainer>
        {userLoggedIn ? (
          <DrawerNavigator />
        ) : (
          <AuthScreen setUserLoggedIn={setUserLoggedIn} /> // AuthScreen bileşenine setUserLoggedIn prop'unu geçirdik
        )}
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
