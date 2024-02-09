/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {styles} from '../utils/styles';
import {MainStackNavigator, ContactStackNavigator} from './StackNavigator';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarStyle: {}}}>
      <Tab.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          tabBarLabelStyle: {
            color: 'white',
            fontWeight: 'normal',
            fontSize: 11,
          }, // Arka plan rengi

          tabBarLabel: 'Anasayfa',
          tabBarShowLabel: false,
          headerShown: false,

          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,

            backgroundColor: '#0a2f35',
            height: 90,
            borderRadius: 15,
            ...styles.bottomNavBarShadow,
          },
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../assets/images/home_icon.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? 'yellow' : 'gray',
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ContactStackNavigator}
        options={{
          tabBarLabelStyle: {
            color: 'white',
            fontWeight: 'normal',
            fontSize: 11,
          },

          tabBarLabel: 'Profile',
          tabBarShowLabel: false,
          headerTitle: 'Profile',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            backgroundColor: '#0a2f35',
            height: 90,
            borderRadius: 15,
            ...styles.bottomNavBarShadow,
          },
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../assets/images/profile_icon.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? 'yellow' : 'gray',
                  }}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
