import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton}>
        <AntDesign name="search1" size={24} color="white" />
        <Text style={styles.footerButtonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Feather name="shopping-bag" size={24} color="#FB9B0D" />
        <Text style={styles.footerButtonText}>Shops</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <AntDesign name="user" size={24} color="white" />
        <Text style={styles.footerButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#161616',
    padding: 20,
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderTopColor: '#FB9B0D',
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
