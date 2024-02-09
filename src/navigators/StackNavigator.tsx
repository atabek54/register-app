import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Contact from '../screens/profile';
import Home from '../screens/home';

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
  headerShown: false, // Navbarı gizlemek için ekledik
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Dashboard" component={Home} />
      <Stack.Screen name="Profile" component={Contact} />
    </Stack.Navigator>
  );
};

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Profile" component={Contact} />
    </Stack.Navigator>
  );
};

export {MainStackNavigator, ContactStackNavigator};
