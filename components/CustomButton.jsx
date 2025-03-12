import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomButton = ({ quantity, size, itemPrice, onPress }) => {
  // if (!quantity || !size || !itemPrice) {
  //   return null;
  // }
  const price = (itemPrice + (size === 'Medium' ? 100 : size === 'Big' ? 150 : 0)) * quantity;


  return (
    <TouchableOpacity style={styles.orderButton} onPress={() => onPress(price)}>
      <View style={styles.content}>
        <Text style={styles.orderButtonText}>Add to Cart</Text>
        {/* <Image source={require('../assets/images/amdBlack.png')} style={styles.icon} /> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 13,
    height: 14,
    resizeMode: 'contain',
  },
  orderButtonText: {
    color: '#000',
    fontSize: 21,
    fontWeight: 'bold',
  },
});

export default CustomButton;
