import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFPercentage } from "react-native-responsive-fontsize";
import Panel from '../components/Panel';

const { width, height } = Dimensions.get('window');

const shops = [
  { id: '1', name: 'Coffee Music', distance: '50m', image: require('../assets/images/MainImg/image1.png') },
  { id: '2', name: 'Coffee Music', distance: '150m', image: require('../assets/images/MainImg/image2.png') },
  { id: '3', name: 'Coffee Music', distance: '300m', image: require('../assets/images/MainImg/image3.png') },
  { id: '4', name: 'Coffee Music', distance: '150m', image: require('../assets/images/MainImg/image2.png') },
  { id: '6', name: 'Coffee Music', distance: '50m', image: require('../assets/images/MainImg/image1.png') },
];

export default function CoffeeMusicScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Feather name="user" size={24} color="white" />
        <TextInput style={styles.searchInput} placeholder="Search your coffee shop" placeholderTextColor="#1C1C1C" />
        <Ionicons name="menu" size={24} color="white" />
      </View>
      <ScrollView contentContainerStyle={styles.shopList}>
        <View style={styles.lines}>
          <Text style={styles.shopsTitle}>Shops</Text>
        </View>
        {shops.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.shopItem} 
            onPress={() => navigation.navigate('ProductScreen')}
          >
            <Image source={item.image} style={styles.shopImage} />
            <View style={styles.shopText}>
              <Text style={styles.shopName}>{item.name}</Text>
              <Text style={styles.shopDistance}>Nearest <Text style={styles.distance}>{item.distance}</Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Panel />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    color: '#1C1C1C',
    width: width * 0.6,
  },
  shopList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  shopItem: {
    marginBottom: 30,
    width: width * 0.9,
  },
  shopImage: {
    height: 180,
    borderRadius: 20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 16,
    width: '100%',
  },
  shopText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopsTitle: {
    color: '#fff',
    fontSize: RFPercentage(3.5),
    fontWeight: 'bold',
    fontFamily: 'InterBold',
    marginBottom: 20,
  },
  shopName: {
    color: '#fff',
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    fontFamily: 'InterBold',
    marginTop: 5,
  },
  shopDistance: {
    color: '#fff',
    fontFamily: 'InterThin', 
    marginTop: 5,
    fontWeight: '100',
    fontSize: RFPercentage(2),
  },
  distance: {
    color: '#FB9B0D',
    fontWeight: '900',
    fontSize: RFPercentage(2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#FB9B0D',
    backgroundColor: '#0C0C0C',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    marginTop: 10,
    fontSize: RFPercentage(2),
  },
});
