import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';
import dram2 from '../assets/images/amdWhite.png';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import { PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');

const scaleFont = size => size * PixelRatio.getFontScale();
const scaleSize = size => (width / 375) * size;

const ItemScreen = ({ hideItemScreen, color, handleCartProducts, data }) => {
  const [typeId, setTypeId] = useState(null)
  const [selectedType, setSelectedType] = useState(null);
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
    console.log('dsasdsaad', typeId)
    if (!typeId) {
      setWarning(true)
      return;
    }

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
          {/* <Text style={styles.productDescription}>{data.description}</Text> */}
          <Text style={styles.productDescription}>Lorem ipsum dolor sit amet consectetur adipisicing </Text>
          <Text style={styles.optionTitle}>Choose Size</Text>
          <View style={styles.chooseSize}>
            {data.productTypes.map(type => (
             <TouchableOpacity key={type.id} style={styles.sizeBlock} onPress={() => {
              setSelectedType(type);
              setTypeId(type.id);
            }}>
              <Text style={styles.size}>{type.type} {type.price > 1 && <Text style={[styles.priceAdd,{ color: color }]}>+{type.price} AMD</Text>}</Text>
              <RadioButton.Android
                value={type.type}
                status={typeId === type.id ? 'checked' : 'unchecked'}
                onPress={() => {
                  setSelectedType(type);
                  setTypeId(type.id);
                }}
                color="#ffffff"
                uncheckedColor={warning ? '#C51919' : ''}
              />
            </TouchableOpacity>
            ))}
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
    marginBottom: scaleSize(100),
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: scaleSize(300),
    resizeMode: 'contain',
    marginTop: scaleSize(30),
    marginBottom: scaleSize(30),
  },
  closeIcon: {
    position: 'absolute',
    top: scaleSize(20),
    left: scaleSize(10),
    zIndex: 10,
    padding: scaleSize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scaleSize(10),
  },
  detailsContainer: {
    padding: scaleSize(20),
  },
  dramImg: {
    width: scaleSize(15),
    height: scaleSize(15),
    resizeMode: 'contain',
  },
  dramImgOrange: {
    width: scaleSize(12),
    height: scaleSize(12),
    resizeMode: 'contain',
    marginLeft: scaleSize(-4),
    marginTop: scaleSize(15),
  },
  warning: {

  },
  productTitle: {
    color: '#fff',
    fontSize: scaleFont(30),
    fontFamily: 'LatoBold',
  },
  productPrice: {
    color: '#fff',
    fontSize: scaleFont(25),
    marginBottom: scaleSize(20),
    fontFamily: 'LatoLight',
  },
  size: {
    color: '#fff',
    fontSize: scaleFont(16),
    marginVertical: scaleSize(10),
    fontFamily: 'RobotoRegular',
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
    fontSize: scaleFont(16),
    marginBottom: scaleSize(30),
    fontFamily: 'RobotoThin',
  },
  text: {
    color: '#fff',
    marginBottom: scaleSize(20),
    fontFamily: 'RobotoThin',
  },
  optionTitle: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontFamily: 'RobotoBold',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderText: {
    color: '#fff',
    fontSize: scaleFont(12),
    paddingVertical: 0,
    paddingHorizontal: scaleSize(4),
    fontWeight: 'bold',
    borderRadius: scaleSize(4),
  },
  borderDiv: {
    backgroundColor: '#EC6C4F',
    borderRadius: scaleSize(6),
    marginLeft: scaleSize(8),
    marginBottom: scaleSize(20),
  },
  chooseSize: {
    marginBottom: scaleSize(20),
  },
  sizeBlock: {
    marginVertical: scaleSize(12),  
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scaleSize(5),
    paddingLeft:scaleSize(10),
    borderRadius: scaleSize(12),  
    backgroundColor: '#333333',  
    marginBottom: scaleSize(15), 
    shadowColor: "#000",  
    shadowOffset: {
      width: 0,
      height: 5,  
    },
    shadowOpacity: 0.15,
    shadowRadius: scaleSize(8),
    elevation: 5,  
    transition: 'all 0.3s ease', 
  },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleSize(20),
  },
  quantityText: {
    color: '#fff',
    fontSize: scaleFont(20),
    marginHorizontal: scaleSize(20),
  },
  orderButton: {
    backgroundColor: '#fff',
    borderRadius: scaleSize(30),
    paddingVertical: scaleSize(15),
  },
  orderButtonText: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: 'black',
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: scaleSize(20),
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
