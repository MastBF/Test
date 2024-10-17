import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Footer = ({ focusTextInput, activeShops }) => {
  const navigation = useNavigation();
  const [activeProfile, setActiveProfile] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('MainMap') }}>
        <Feather name="map-pin" size={24} color="white" />
        <Text style={styles.footerButtonText}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Main') }} style={styles.footerButton}>
        <Feather name="shopping-bag" size={24} color={activeShops ? "#FB9B0D" : "white"} />
        <Text style={styles.footerButtonText}>Shops</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('ProfileScreen') }} style={styles.footerButton}>
        <AntDesign name="user" size={24} color={activeProfile ? "#FB9B0D" : "white"} />
        <Text style={styles.footerButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#161616',
    padding: 20,
    paddingBottom: 17,
    paddingTop: 17,
    alignItems: 'center',
    width: '90%',
    // position: 'absolute',
    zIndex: 1,
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '105%',
    bottom: 0,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    borderWidth: 1,
    borderTopColor: '#ffffff',
    // borderLeftColor: '#FB9B0D',

  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Footer;
