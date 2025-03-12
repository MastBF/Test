import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';
import dram2 from '../assets/images/amdWhite.png';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { BASE_URL } from '@/utils/requests'; // Убедитесь, что BASE_URL правильно настроен
import axios from 'axios';

const ItemScreen = ({ hideItemScreen, color, handleCartProducts, data }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false)
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const onButtonPress = async () => {
    if (!selectedValue) {
      setWarning(true)
      return;
    }

    let typeId;
    if (selectedValue === 'Small') typeId = 0;
    if (selectedValue === 'Medium') typeId = 1;
    if (selectedValue === 'Big') typeId = 2;

    handleCartProducts({
      description: data.description,
      image: data.fileName,
      price: data.price,
      title: data.name,
      id: data.id,
      typeId,
      quantity,
    });
    hideItemScreen();
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
        RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        LatoBold: require('../assets/fonts/Lato-Bold.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
        RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
      });
      setFontsLoaded(true);
      setLoading(false);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    console.log(warning)
  },[warning])
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.fileName }}
            style={[styles.productImage]}
            onError={() => console.log('Image load error')}
          />
          <Icon
            name="down"
            type="antdesign"
            color="#fff"
            containerStyle={styles.closeIcon}
            onPress={hideItemScreen}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>{data.name}</Text>
          <Text style={styles.productPrice}>{data.price} <Image source={dram2} style={styles.dramImg} /></Text>
          <Text style={styles.productDescription}>{data.description}</Text>
          <Text style={styles.optionTitle}>Choose Size</Text>
          <View style={[styles.choosSize]}>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Small'); setSize('Small'); }}>
              <Text style={styles.size}>Small</Text>
              <RadioButton.Android
                value="Small"
                status={selectedValue === 'Small' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Small'); setSize('Small'); }}
                color="#ffffff"
                uncheckedColor={warning ? '#C51919' : ''}

              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Medium'); setSize('Medium'); }}>
              <View style={styles.priceAddAmd}>
                <Text style={styles.size}>Medium <Text style={[styles.priceAdd, { color: color }]}>+100</Text> </Text>
              </View>
              <RadioButton.Android
                value="Medium"
                status={selectedValue === 'Medium' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Medium'); setSize('Medium'); }}
                color="#ffffff"
                uncheckedColor={warning ? '#C51919' : ''}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Big'); setSize('Big'); }}>
              <View style={styles.priceAddAmd}>
                <Text style={styles.size}>Big <Text style={[styles.priceAdd, { color: color }]}>+150</Text></Text>
              </View>
              <RadioButton.Android
                value="Big"
                status={selectedValue === 'Big' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Big'); setSize('Big'); }}
                color="#ffffff"
                uncheckedColor={warning ? '#C51919' : ''}

              />
            </TouchableOpacity>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity}>
              <AntDesign name="minuscircle" size={24} color={quantity > 1 ? "#D7D6D6" : "#2E2E2E"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity}>
              <AntDesign name="pluscircle" size={24} color="#D7D6D6" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CustomButton
        quantity={quantity}
        size={size}
        itemPrice={700}
        onPress={onButtonPress}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100,
  },
  imageContainer: {
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
    marginBottom: 30,
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  dramImg: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  dramImgOrange: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginLeft: -4,
    marginTop: 15,
  },
  warning: {

  },
  productTitle: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'LatoBold',
  },
  productPrice: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 20,
    fontFamily: 'LatoLight',
  },
  size: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  priceAdd: {
    color: '#EC6C4F',
    fontWeight: '300',
  },
  priceAddAmd: {
    display: 'flex',
    flexDirection: 'row',

  },
  productDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    fontFamily: 'RobotoThin',
  },
  text: {
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'RobotoThin',
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoBold',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderText: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 0,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    borderRadius: 4,
  },
  borderDiv: {
    backgroundColor: '#EC6C4F',
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 20,
  },
  choosSize: {
    marginBottom: 20,
  },
  sizeBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityText: {
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 20,
  },
  orderButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 15,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
});

export default ItemScreen;
