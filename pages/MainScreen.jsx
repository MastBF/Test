import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { BASE_URL } from '../utils/requests';
import { RFPercentage } from 'react-native-responsive-fontsize';
import HOC from '../components/HOC';
import image1 from '../assets/images/MainImg/image1.png';
import image2 from '../assets/images/MainImg/image2.png';
import image3 from '../assets/images/MainImg/image3.png';
import AlertScreen from '@/components/AlertScreen';
import ProductScreen from './ProductScreen';

const { width, height } = Dimensions.get('window');

const CoffeeMusicScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const textInputRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [shops, setShops] = useState([
    {
      id: 1,
      name: 'Starbucks',
      nearest: '1.2 km',
      imagePath: '../assets/images/MainImg/image1.png',
    },
    {
      id: 2,
      name: 'Coffee Bean',
      nearest: '1.5 km',
      imagePath: '../assets/images/MainImg/image2.png',
    },
    {
      id: 3,
      name: 'Costa Coffee',
      nearest: '2.0 km',
      imagePath: '../assets/images/MainImg/image3.png',
    },
  ]);
  const [activeShops, setActiveShops] = useState(false);
  const [location, setLocation] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openShop, setOpenShop] = useState(false);
  const [id, setId] = useState(null);

  // Функция фокуса на TextInput
  const focusTextInput = () => {
    navigation.navigate('Main');
    textInputRef.current?.focus();
  };

  // Функция закрытия AlertScreen
  const onClose = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error("Token not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error getting token from AsyncStorage:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  const fetchShops = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
    if (!location) {
      console.error("No location found");
      return;
    }
    try {
      setLoading(true);
      const { latitude, longitude } = location.coords;
      console.log(latitude, longitude);
      const response = await axios.get(`${BASE_URL}/api/v1/Company/nearest/${longitude}/${latitude}`, {
        headers: {
          TokenString: token,
        },
      });

      if (Array.isArray(response.data)) {
        setShops(response.data);
        console.log('Shops:', response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    if (token && location) {
      fetchShops();
      setActiveShops(true);
    }
  }, [token, location]);

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  const onConfirm = () => {
    setAlertVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AlertScreen
        isVisible={alertVisible}
        title={'Default Title'}
        onConfirm={onConfirm}
        onClose={onClose}
        message={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta, velit repudiandae'}
      />
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Feather name="user" size={RFPercentage(2.5)} color="white" onPress={() => navigation.navigate('ProfileScreen')} />
        <TextInput
          ref={textInputRef}
          style={styles.searchInput}
          placeholder="Search your coffee shop"
          placeholderTextColor="#1C1C1C"
        />
        <Ionicons name="menu" size={RFPercentage(2.5)} color="white" />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScrollView contentContainerStyle={styles.shopList}>
          <View style={styles.lines}>
            <Text style={styles.shopsTitle}>Shops</Text>
          </View>
          {shops.length > 0 ? shops.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.shopItem}
              // onPress={() => { navigation.navigate('ProductScreen', { id: item.id }) }}
              onPress={() => { navigation.navigate('ProductScreen', { id: item.id, imageHeader: item.uiImagePath, name: item.name }) }}
            >
              <Image source={{ uri: item.uiImagePath }} style={styles.shopImage} />
              <View style={styles.shopText}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopDistance}>Nearest {item.nearest}m</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <Text style={styles.noShopsText}>No shops found</Text>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    color: '#1C1C1C',
    width: width * 0.6,
  },
  shopList: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    alignItems: 'center',
  },
  shopItem: {
    marginBottom: height * 0.03,
    width: width * 0.9,
  },
  shopImage: {
    height: height * 0.25,
    borderRadius: width * 0.05,
    width: '100%',
  },
  shopText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  scroll: {
    alignItems: 'center',
  },
  shopsTitle: {
    color: '#fff',
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
    fontFamily: 'InterBold',
    marginBottom: height * 0.02,
  },
  shopName: {
    color: '#fff',
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    fontFamily: 'InterBold',
  },
  shopDistance: {
    color: '#fff',
    fontFamily: 'InterThin',
    fontSize: RFPercentage(2),
  },
  noShopsText: {
    color: '#fff',
    fontSize: RFPercentage(2.5),
    fontFamily: 'InterThin',
    marginTop: height * 0.02,
  },
  locationText: {
    color: '#fff',
    fontSize: RFPercentage(2.5),
    fontFamily: 'InterThin',
    marginTop: height * 0.02,
  },
});

export default HOC(CoffeeMusicScreen);
