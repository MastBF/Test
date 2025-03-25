import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MainMap from '../pages/MainMap'; 
import MainScreen from '../pages/MainScreen';
import ProfileScreen from '../pages/ProfileScreen';
// import MapScreen from '../pages/MapScreen';

const Tab = createBottomTabNavigator();

const Footer = () => {
  return (
    <Tab.Navigator
      initialRouteName="Shops"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 70,
          borderTopWidth: 0,
          borderTopRadius: 20,
          paddingBottom: 10,
          backgroundColor: '#161616',
          position: 'absolute',
          bottom: 0,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderTopColor: '#fff',
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          borderLeftColor: '#fff',
          borderRightColor: '#fff',
          width: '105%',
          overflow: 'hidden',
          transform: [{ translateX: '-2.5%' }]
        },
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
        tabBarHideOnKeyboard: true,
        animationEnabled: true,
      }}
    >

      <Tab.Screen
        name="MainMap"
        component={MainMap}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            const scale = focused ? 1.08 : 1;
            const animatedStyle = {
              transform: [{ scale: scale }],
            };
            return (
              <Animated.View style={animatedStyle}>
                <Feather name="map" size={23} color={color} />
              </Animated.View>
            );
          },
          tabBarLabel: 'Map',
        }}
      />

      <Tab.Screen
        name="Shops"
        component={MainScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            const scale = focused ? 1.08 : 1;
            const animatedStyle = {
              transform: [{ scale: scale }],
            };
            return (
              <Animated.View style={animatedStyle}>
                <Feather name="shopping-bag" size={23} color={color} />
              </Animated.View>
            );
          },
          tabBarLabel: 'Shops',
        }}
      />

      {/* Вкладка "Карта" */}



      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            const scale = focused ? 1.08 : 1;
            const animatedStyle = {
              transform: [{ scale: scale }],
            };
            return (
              <Animated.View style={animatedStyle}>
                <AntDesign name="user" size={23} color={color} />
              </Animated.View>
            );
          },
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Footer;
