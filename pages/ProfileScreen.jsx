import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Image, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import imageProfile from '../assets/images/Profile/images.jpg';
import * as Font from 'expo-font';

import HOC from '../components/HOC';

const ProfileScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const animationHeight = useRef(new Animated.Value(0)).current;

  const settings = [
    { name: 'Profile', icon: 'user', type: 'font-awesome' },
    { name: 'Notifications', icon: 'bell', type: 'font-awesome' },
    { name: 'Card', icon: 'credit-card', type: 'font-awesome' },
    { name: 'Security', icon: 'lock', type: 'font-awesome' },
  ];

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(false);
  };

  const toggleCardSection = () => {
    const newHeight = isCardExpanded ? 0 : 150; // Adjust the value based on the content height
    setIsCardExpanded(!isCardExpanded);

    Animated.timing(animationHeight, {
      toValue: newHeight,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
        RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={imageProfile} style={styles.profileImage} />
        </View>
        <Text style={styles.username}>James Smith</Text>

        <View style={styles.settingsList}>
          {settings.map((setting, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={setting.name === 'Card' ? toggleCardSection : null}
            >
              <View style={styles.settingPart}>
                <Icon name={setting.icon} type={setting.type} color="#fff" size={24} />
                <Text style={styles.settingText}>{setting.name}</Text>
              </View>
              {setting.name === 'Card' && (
                <Icon name={isCardExpanded ? 'up' : 'down'} type="antdesign" color="#fff" size={20} />
              )}
            </TouchableOpacity>
          ))}
        </View>


        {/* <View style={styles.cardSection}>
          <TouchableOpacity style={styles.cardContainer}>
            <Icon name="cc-visa" type="font-awesome" color="#fff" size={24} />
            <Text style={styles.cardText}>card ending with 4964</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCardContainer}>
            <View style={styles.cardPart}>
              <Icon name="credit-card-plus" type="material-community" color="#fff" size={24} />
              <Text style={styles.addCardText}>Add New Card</Text>
            </View>
            <Icon name='right' type='antdesign' color='#fff' size={20} />
          </TouchableOpacity>
        </View> */}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: '15%',
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RobotoBold',
  },
  settingsList: {
    width: '100%',
    backgroundColor: '#333',
    height: '50%',
    borderRadius: 30,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#444',
    padding: 15,
    // borderRadius: 10,
    // marginBottom: 10,
    // borderRadius: 30,
    height: 70,
  },
  settingPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'RobotoRegular',
  },
  cardSection: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    height: 70,
  },
  cardText: {
    color: '#fff',
    marginLeft: 10,
  },
  addCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    height: 70,
    justifyContent: 'space-between',
  },
  addCardText: {
    color: '#fff',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HOC(ProfileScreen);
