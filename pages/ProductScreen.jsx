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

const { width, height } = Dimensions.get('window');

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
  const [itemInfo, setItemInfo] = useState(null);
  const [oneItem, setOneItem] = useState(null);
  const [cartProdCount, setCartProdCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true)

  
 

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Product/${id}?page=1&pageSize=10`, {
        headers: {
          'TokenString': token,
        },
      });
      console.log('Products:', response.data);
      setCompanyColor(response.data.companyColour)
      setData(response.data.products.data);
      setCompanyImg(response.data.companyUiFileName);
      // console.log(response.data.companyUiUrl);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMsg('Failed to load products');
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }
  };
  const handleVisibility = () => {
    setIsVisiable(false);
  };
  const itemInfoHandle = (item, imageName, name, price, description) => {
    setOneItem({ item, imageName, name, price, description });
    setIsVisiable(true);
  };
  const reqPeriId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Cart/cart`, {
        headers: {
          'Content-Type': 'application/json',
          'TokenString': token
        },
      });
      setCartProdCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    reqPeriId();
  }, [token]);

  const showItemScreen = (name, price, type, id, typeId) => {
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
    setItemInfo({ name, price, type, id, typeId });
  };
  const handleCartProducts = (prod) => {
    setCartProducts(prev => [...prev, prod]);
    console.log('Cart products:', cartProducts);
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
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const showItemSceenHandle = (item) => {
    console.log("Types", item.productTypes);
    if (item.productTypes && item.productTypes.length > 0) {
      showItemScreen(item.name, item.price, item.type, item.id, item.productTypes[0].id);
    } else {
      console.error('Product types not available for this item');
    }
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
    navigation.navigate('Cart', { navigation, companyColor, cartProducts, token });
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const navOrderScreen = () => {
    navigation.navigate('PaymentScreen', { id: id, token: token, typeId: itemInfo.typeId, color: companyColor, coffeeName: itemInfo.name });
  };

  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* {errorMsg && <ErrorMessage errorMsg={errorMsg} />} */}
      {isOpen && (
        <Animated.View style={[styles.animatedContainer, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }]}>
          <ItemScreen hideItemScreen={hideItemScreen} id={id} navigation={navigation} color={companyColor} cupImage={data[1].imageName} handleCartProducts={handleCartProducts} />
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
        onPress={() => navigation.goBack()}
      />

      <Image source={{uri: logo}} style={styles.companyLogo} />
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
              onPress={() => itemInfoHandle(item, item.imageName, item.name, item.price, item.description)}
            >
              <View style={[styles.itemContainer, { borderColor: companyColor, borderWidth: 1 }]}>
                <View style={styles.coffeeInfo}>
                  <Image source={{ uri: item.fileName }} style={styles.image} />
                  <View style={styles.info}>
                    <View style={styles.details}>
                      <View style={styles.PriveName}>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                    </View>
                    <View>
                      {/* <Text style={styles.description}>{item.description}</Text> */}
                      <Text style={styles.description}>Lorem, ipsum dolor sit amet </Text>
                    </View>
                    <View style={styles.itemContainerFooter}>
                      <TouchableOpacity onPress={() => {
                        showItemSceenHandle(item);
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

      <TouchableOpacity style={styles.orderButton} onPress={cartNavigate}>
        <View style={styles.content}>
          <Text style={styles.orderButtonText}>
            View Cart
          </Text>
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
    marginTop: height * 0.03,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  header: {
    height: height * 0.3,
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
    // marginRight: width * 0.05,

  },
  headerImage: {
    marginTop: -height * 0.04,
    height: height * 0.33,
  },
  PriveName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
    width: '100%',
    marginLeft: -width * 0.04,
  },
  title: {
    color: '#fff',
    fontFamily: 'LatoBold',
    fontSize: width * 0.08,

  },
  list: {
    paddingHorizontal: width * 0.05,
    // height: '100%',
  },
  req: {
    color: '#fff',
    fontSize: width * 0.08,
    marginTop: height * 0.01,
    fontFamily: 'LatoBold',
    marginBottom: height * 0.04,
  },

  amdWhite: {
    width: width * 0.035,
    height: width * 0.035,
    resizeMode: 'contain',
  },
  cartOpacity: {
    // position: 'relative',
    alignSelf: 'center',
    marginTop: height * 0.01,
    marginRight: width * 0.015,
    // alignItems: 'center',
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
    width: width * 0.035,
    height: width * 0.035,
    resizeMode: 'contain',
  },
  priceOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    fontSize: 12,
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
  prodList: {
    backgroundColor: '#1C1C1C',
    borderTopRightRadius: width * 0.1,
    // borderTopLeftRadius: width * 0.1,
    // height: '90%',
    // position: 'absolute',

    marginTop: -height * 0.09,
  },
  itemContainer: {
    flexDirection: 'column',
    marginVertical: height * 0.01,
    justifyContent: 'space-between',
    borderWidth: 1,
    // borderBottomWidth: 1,
    // borderBottomColor: '#2E2E2E',
    // paddingBottom: height * 0.015,
    // paddingHorizontal: width * 0.0,
    // height: 10,
    width: '100%',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.015,
    borderRadius: 10,
    height: height * 0.17,
    maxHeight: height * 0.17,
  },
  image: {
    width: width * 0.2,
    height: width * 0.25,
    // resizeMode: 'contain',
    // marginRight: width * 0.1,
    // borderRadius: 10,
    // marginBottom: 10,
    alignSelf: 'center',

  },
  name: {
    fontSize: width * 0.05,
    fontFamily: 'RobotoBold',
    color: '#fff',
  },
  description: {
    fontSize: width * 0.04,
    fontFamily: 'RobotoLight',
    color: '#fff',
    width: width * 0.35,
    marginLeft: -width * 0.04,

  },
  info: {
    width: width * 0.55,
    maxHeight: height * 0.15,
  },
  buttonWrapper: {
    alignSelf: 'center',
    // fontSize: width * 0.05,
    padding: 5,
    paddingHorizontal: 10,
    // padding: height * 0.01,
    // paddingHorizontal: width * 0.025,
  },

  count: {
    color: '#fff',
    fontSize: width * 0.035,
    fontFamily: 'RubikRegular',
    backgroundColor: '#1C1C1C',
    width: width * 0.08,
    // textAlign: 'center',
    alignSelf: 'center',
    height: '97%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    // alignSelf: 'center',
    // textAlign: 'center',
    color: '#fff',
  },
  itemContainerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.015,
    marginLeft: -width * 0.04,

    // marginTop: height * 0.015,
  },
  closeIcon: {
    position: 'absolute',
    top: 30,
    left: 10,
    // padding: 10,
  },
  price: {
    fontSize: width * 0.045,
    fontFamily: 'RobotoRegular',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    height: height * 0.06,
    width: '90%',
    backgroundColor: '#fff',
    // padding: 10,
    // borderTopRightRadius: width * 0. 1,    
    // borderTopLeftRadius: width * 0.1,
    borderRadius: width * 0.1,
    alignSelf: 'center',
  },
  footerBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  footerText: {
    fontSize: width * 0.05,
    fontFamily: 'RobotoBold',
    color: '#000',
    marginHorizontal: width * 0.2,
  },
  footerTextNone: {
    fontSize: width * 0.05,
    fontFamily: 'RobotoLight',
    color: '#000',
    // marginLeft: width * 0.04,
  },
  footerTextSecond: {
    fontSize: width * 0.05,
    fontFamily: 'RobotoLight',
    color: '#000',
    // marginRight: width * 0.01,
  },
  noDataText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'RobotoRegular',
    textAlign: 'center',
    marginTop: height * 0.02,
  },
});

export default CoffeeMusicScreen;
