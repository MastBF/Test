import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated, Easing, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import ErrorMessage from '../components/ErrorMessage';
import { AntDesign, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import HOC from '../components/HOC';
import * as Font from 'expo-font';
import amdWhite from '../assets/images/amdWhite.png';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import ItemScreen from './ItemScreen';
import { useRoute } from '@react-navigation/native';
import ProdInfo from '@/components/ProdInfo';
import {  PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375; 
const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const CoffeeMusicScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(height));
  const route = useRoute();
  const { id, name, logo } = route.params || {};
  const [companyColor, setCompanyColor] = useState(null);
  const [companyImg, setCompanyImg] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isVisiable, setIsVisiable] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [oneItem, setOneItem] = useState(null);
  const [cartProdCount, setCartProdCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true)
  const [itemId, setItemId] = useState()
  const [buttonPressed, setButtonPressed] = useState(false);

  const handlePressIn = () => {
    setButtonPressed(true);
  };
  
  const handlePressOut = () => {
    setButtonPressed(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Product/${id}?page=1&pageSize=10`, {
        headers: {
          'TokenString': token,
        },
      });
      setCompanyColor(response.data.companyColour)
      setData(response.data.products.data);
      setCompanyImg(response.data.companyUiFileName);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMsg('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };
  const handleVisibility = () => {
    setIsVisiable(false);
  };
  const itemInfoHandle = (item, imageName, name, price, description, id, isVisiable = true) => {
    setOneItem({ item, imageName, name, price, description });
    setItemId(id)
    setIsVisiable(isVisiable);
  };

  const showItemScreen = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleCartProducts = (newItem) => {
    console.log(newItem)
    setCartProducts(prevCart => {
      const existingItemIndex = prevCart.findIndex(item =>
        item.id === newItem.id && item.typeId === newItem.typeId
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const hideItemScreen = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: height,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setIsOpen(false));
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
        console.error("Error fetching token from AsyncStorage:", error);
      }
    };
    getToken();
  }, []);
  useEffect(() => {
    setCartProdCount(cartProducts.length)
  }, [cartProducts])
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const showItemSceenHandle = () => {
    showItemScreen();
  };


  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
        RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        LatoBold: require('../assets/fonts/Lato-Bold.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
        RubikRegular: require('../assets/fonts/Rubik-Regular.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  };
  const onClose = () => {
    setIsVisiable(false);
  };
  useEffect(() => {
    loadFonts();
  }, []);

  const cartNavigate = () => {
    navigation.navigate('Cart', { navigation, branchId: id, companyColor, cartProducts, token });
  };


  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }



  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isOpen && (
        <Animated.View style={[styles.animatedContainer, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }]}>
          <ItemScreen
            hideItemScreen={hideItemScreen}
            color={companyColor}
            handleCartProducts={handleCartProducts}
            data={data.find(item => item.id === itemId)}
          />
        </Animated.View>
      )}
      {isVisiable && (
        <ProdInfo onClose={onClose} visible={isVisiable} productInfo={oneItem} companyColor={companyColor} onAddToCart={showItemSceenHandle} handleVisibility={handleVisibility} />
      )}

      <View style={styles.header}>
        <Image source={{ uri: companyImg }} style={styles.headerImage} />
      </View>
      <Icon
        name="left"
        type="antdesign"
        color="#fff"
        containerStyle={styles.closeIcon}
        onPress={() => {
          setCartProducts([])
          navigation.goBack()
        }}
      />

      <ScrollView style={styles.prodList} contentContainerStyle={[styles.list, { paddingBottom: 80 }]}>
        <View style={styles.titlePart}>
          <Text onPress={fetchProducts} style={styles.title}>{name}</Text>
          <TouchableOpacity onPress={cartNavigate} style={styles.cartOpacity}>
            <Feather
              name="shopping-cart"
              size={24}
              color={companyColor}
              style={styles.cartIcon}
            />
            {!isEmpty && (
              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>{cartProdCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => itemInfoHandle(item, item.imageName, item.name, item.price, item.description, item.id)}
            >
              <View style={[styles.itemContainer, { borderColor: companyColor, borderWidth: 1, shadowColor: companyColor }]}>
                <View style={styles.coffeeInfo}>
                  <Image source={{ uri: item.fileName }} style={styles.image} />
                  <View style={styles.info}>
                    <View style={styles.details}>
                      <View style={styles.PriveName}>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.description}>Lorem, ipsum dolor sit amet </Text>
                    </View>
                    <View style={styles.itemContainerFooter}>
                      <TouchableOpacity onPress={() => {
                        itemInfoHandle(item, item.imageName, item.name, item.price, item.description, item.id, false)
                        showItemSceenHandle();
                      }}>
                        <AntDesign name='pluscircle' color={companyColor} size={25} />
                      </TouchableOpacity>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>{item.price}</Text>
                        <Image source={amdWhite} style={styles.amdWhite} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No Products found</Text>
        )}

      </ScrollView>

      <TouchableOpacity
        style={[styles.orderButton, buttonPressed && styles.orderButtonActive]}
        onPress={cartNavigate}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.content}>
          <Text style={styles.orderButtonText}>View Cart</Text>
        </View>
      </TouchableOpacity>

    </View >
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  titlePart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  header: {
    height: normalize(244),
    width: '100%',
  },
  companyLogo: {
    top: 150,
    left: 20,
    width: 50,
    height: 50,
    resizeMode: 'contain',
    // alignSelf: 'start',
    borderRadius: 15,
    position: 'absolute',
    zIndex: 10,
  },
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  cartIcon: {
    // alignSelf: 'center',
    // marginRight: normalize(19),

  },
  headerImage: {
    marginTop: -normalize(32),
    height: normalize(268),
  },
  PriveName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
    width: '100%',
    marginLeft: -normalize(15),
  },
  title: {
    color: '#fff',
    fontFamily: 'LatoBold',
    fontSize: normalize(30),

  },
  list: {
    paddingHorizontal: normalize(19),
    // height: '100%',
  },
  req: {
    color: '#fff',
    fontSize: normalize(30),
    marginTop: normalize(8),
    fontFamily: 'LatoBold',
    marginBottom: normalize(32),
  },

  amdWhite: {
    width: normalize(13),
    height: normalize(13),
    resizeMode: 'contain',
  },
  cartOpacity: {
    // position: 'relative',
    alignSelf: 'center',
    marginTop: normalize(8),
    marginRight: normalize(6),
    },
  closeIcon: {
    position: 'absolute',
    top: 40,
    left: 0,
    padding: 10,
    zIndex: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amdBlack: {
    width: normalize(13),
    height: normalize(13),
    resizeMode: 'contain',
  },
  priceOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff', // Gold border to make it more appealing
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    width: '80%', // Adjust the width to make it more balanced
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adding a gold color for a premium look
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5, // Shadow for Android
    transform: [{ scale: 1 }],
    transition: 'transform 0.2s ease-in-out', // Smooth scale transition for touch
  },

  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    minHeight: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  coffeeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',

  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderButtonActive: {
    transform: [{ scale: 0.95 }],
  },
  icon: {
    width: 13,
    height: 14,
    resizeMode: 'contain',
  },
  orderButtonText: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#000', 
    textAlign: 'center',
    fontFamily: 'LatoBold',
  },
  prodList: {
    backgroundColor: '#1C1C1C',
    borderTopRightRadius: normalize(38),
    marginTop: -normalize(73),
  },
  itemContainer: {
    flexDirection: 'column',
    marginVertical: normalize(8),
    justifyContent: 'space-between',
    borderWidth: 1,
    width: '100%',
    paddingVertical: normalize(11),
    paddingHorizontal: normalize(6),
    borderRadius: 15,
    height: normalize(138),
    maxHeight: normalize(138),
    backgroundColor: '#2E2E2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  name: {
    fontSize: normalize(19),
    fontFamily: 'RobotoBold',
    color: '#fff',
  },
  description: {
    fontSize: normalize(15),
    fontFamily: 'RobotoLight',
    color: '#fff',
    width: normalize(131),
    marginLeft: -normalize(15),
  },
  image: {
    width: normalize(82),
    height: normalize(82),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  info: {
    width: normalize(206),
    maxHeight: normalize(122),
  },
  buttonWrapper: {
    alignSelf: 'center',
    padding: 5,
    paddingHorizontal: 10,
  },

  count: {
    color: '#fff',
    fontSize: normalize(13),
    fontFamily: 'RubikRegular',
    backgroundColor: '#1C1C1C',
    width: normalize(30),
    alignSelf: 'center',
    height: '97%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
  },
  itemContainerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(12),
    marginLeft: -normalize(15),
  },
  closeIcon: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  price: {
    fontSize: normalize(17),
    fontFamily: 'RobotoRegular',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    height: normalize(49),
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: normalize(38),
    alignSelf: 'center',
  },
  footerBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  footerText: {
    fontSize: normalize(19),
    fontFamily: 'RobotoBold',
    color: '#000',
    marginHorizontal: normalize(75),
  },
  footerTextNone: {
    fontSize: normalize(19),
    fontFamily: 'RobotoLight',
    color: '#000',
  },
  footerTextSecond: {
    fontSize: normalize(19),
    fontFamily: 'RobotoLight',
    color: '#000',
  },
  noDataText: {
    color: '#fff',
    fontSize: normalize(17),
    fontFamily: 'RobotoRegular',
    textAlign: 'center',
    marginTop: normalize(16),
  },

});
export default CoffeeMusicScreen;