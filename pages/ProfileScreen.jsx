import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal, Image, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import imageProfile from '../assets/images/Profile/images.jpg';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

import HOC from '../components/HOC';

const ProfileScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const plans = ['Starter', 'Pro', 'Premium'];

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(false);
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
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={imageProfile} style={styles.profileImage} />
        </View>
        <Text style={styles.coinsText}>300</Text>
        <Text style={styles.coinsAvailableText}>Coins Available</Text>

        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          <TouchableOpacity style={styles.cardContainer}>
            <Icon name="cc-visa" type="font-awesome" color="#fff" size={24} />
            <Text style={styles.cardText}>card ending with 4964</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCardContainer}>
            <View style={styles.cardPart}>
            <Icon name="credit-card-plus" type="material-community" color="#fff" size={24} />
            <Text style={styles.addCardText}>Add New Card</Text>
            </View>
            <Icon name='right' type='antdesign' color='#fff' size={20}/>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan}
                  style={styles.modalItem}
                  onPress={() => handlePlanChange(plan)}
                >
                  <Text style={styles.modalItemText}>{plan}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
      
      <View style={styles.planContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.planPicker}>
          <Text style={styles.planText}>{selectedPlan}</Text>
          <Icon name="down" type="antdesign" color="#fff" size={20} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.progressText}>0.0/19999.0</Text>
      </View>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444',
  },
  cardPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsText: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'RobotoBold',
  },
  coinsAvailableText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'RobotoRegular',
  },
  paymentMethodsContainer: {
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 10,
    borderColor: '#2E2E2E',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'RobotoLight',
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
    // backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    height: 70,
    justifyContent: 'space-between',
  },
  addCardText: {
    color: '#fff',
    marginLeft: 10,
  },
  planContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 10,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  planPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  planText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoBold',
  },
  progressBar: {
    width: '90%',
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '5%',
    height: '100%',
    backgroundColor: '#EC6C4F',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'RobotoRegular',
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
