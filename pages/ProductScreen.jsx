import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated, Easing, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import ErrorMessage from '../components/ErrorMessage';
import { AntDesign, Entypo } from '@expo/vector-icons';
import HOC from '../components/HOC';
import * as Font from 'expo-font';
import amdWhite from '../assets/images/amdWhite.png';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import ItemScreen from './ItemScreen';
import { useRoute } from '@react-navigation/native';
import cup from '../assets/images/ProductImg/cup.png';
import CustomButtonForOrder from '@/components/CustomButtonForOrder';
import { color } from 'react-native-elements/dist/helpers';
const { width, height } = Dimensions.get('window');

const CoffeeMusicScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [counts, setCounts] = useState({});
  const [token, setToken] = useState(null);
  const [quentity, setQuantity] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(height));
  const route = useRoute();
  const { id, imageHeader, name } = route.params || {};
  const [itemInfo, setItemInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [finalyPrice, setFinalyPrice] = useState(0);
  const [companyColor, setCompanyColor] = useState(null);
  const [testShops, setTestShops] = useState([
    {
      id: 1,
      name: 'Capuchino',
      price: 500,
      description: 'Lorem ipsum dolor sit amet, consectetur',
      color: '#EC6C4F',
      count: 0,
    },
    {
      id: 2,
      name: 'Mac Coffee',
      price: 700,
      description: 'Lorem ipsum dolor sit amet, consectetur',
      color: '#EC6C4F',
      count: 0,
    },
    {
      id: 3,
      name: 'Nescaphe',
      price: 900,
      description: 'Lorem ipsum dolor sit amet, consectetur',
      color: '#EC6C4F',
      count: 0,

    },
    {
      id: 4,
      name: 'Americano',
      price: 300,
      description: 'Lorem ipsum dolor sit amet, consectetur',
      color: '#EC6C4F',
      count: 0,
    },
  ]);


  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://gazansolution-production.up.railway.app/api/v1/Product/${id}?page=1&pageSize=10`, {
        headers: {
          'TokenString': token,
        },
      });
      console.log('Products:', response.data);
      setCompanyColor(response.data.companyColour)
      setData(response.data.products.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMsg('Failed to load products');
    }
  };
  const handleOrderInfo = (quentity, price, type) => {
    setOrderInfo({ quentity, price, type });
  }


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
  const handleCount = (count, id) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [id]: count,
    }));
    console.log(count, id);
  };

  useEffect(() => {
    if (orderInfo) {
      handleCount(orderInfo.quentity.quantity, itemInfo.id);
    }
  }, [orderInfo]);

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

  const onPlus = (id) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  const onMinus = (id) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [id]: Math.max((prevCounts[id] || 0) - 1, 0),
    }));
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

  useEffect(() => {
    loadFonts();
  }, []);

  const calculateTotalQuantityAndPrice = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    data.forEach((item) => {
      const count = counts[item.id] || 0;
      totalQuantity += count;
      totalPrice += count * item.price;
    });
    return { totalQuantity, totalPrice };
  };


  const { totalQuantity, totalPrice } = calculateTotalQuantityAndPrice();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const navOrderScreen = (price) => {
    const oneCup = orderInfo.quentity.price / orderInfo.quentity.quantity;
    navigation.navigate('PaymentScreen', { quentity: totalQuantity, priceItem: totalPrice, oneCupPrice: oneCup, id: id, cardId: itemInfo.id, token: token, typeId: itemInfo.typeId, color: companyColor, coffeeName: itemInfo.name });
  };

  return (
    <View style={styles.container}>
      {/* {errorMsg && <ErrorMessage errorMsg={errorMsg} />} */}
      {isOpen && (
        <Animated.View style={[styles.animatedContainer, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }]}>
          <ItemScreen hideItemScreen={hideItemScreen} itemInfo={itemInfo} handleOrderInfo={handleOrderInfo} navigation={navigation} color={companyColor} cupImage={data[1].imageName} />
        </Animated.View>
      )}
      <Icon
        name="left"
        type="antdesign"
        color="#fff"
        containerStyle={styles.closeIcon}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.header}>
        <Image source={{ uri: imageHeader }} style={styles.headerImage} />
      </View>

      <ScrollView style={styles.prodList} contentContainerStyle={[styles.list, { paddingBottom: 80 }]}>
        <Text onPress={fetchProducts} style={styles.title}>{name}</Text>


        {Array.isArray(testShops) && testShops.length > 0 ? (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.productTypes && item.productTypes.length > 0) {
                  showItemScreen(item.name, item.price, item.type, item.id, item.productTypes[0].id);
                } else {
                  console.error('Product types not available for this item');
                }
              }
              }
            >
              <View style={[styles.itemContainer, { borderColor: companyColor, borderWidth: 1 }]}>
                <View style={styles.coffeeInfo}>
                  <Image source={{ uri: item.imageName }} style={styles.image} />
                  <View style={styles.info}>
                    <View style={styles.details}>
                      <View style={styles.PriveName}>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.description}>Lorem, ipsum dolor sit amet consectetur adipisicing elit</Text>
                    </View>
                    <View style={styles.itemContainerFooter}>
                      <View style={[styles.buttonPlusMinus, { backgroundColor: companyColor }]}>
                        <TouchableOpacity style={styles.buttonWrapper} onPress={() => onMinus(item.id)}>
                          <Entypo name="minus" size={16} color="black" />
                        </TouchableOpacity>
                        <View style={styles.count}>
                          <Text style={styles.textStyle}>{counts[item.id] > 0 ? `${counts[item.id]}` : 0}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonWrapper} onPress={() => onPlus(item.id)}>
                          <Entypo name="plus" size={16} color="black" />
                        </TouchableOpacity>
                      </View>
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
      {totalQuantity > 0 && (
        <TouchableOpacity style={styles.orderButton} onPress={navOrderScreen}>
          <View style={styles.content}>
            <Text style={styles.orderButtonText}>
              Order {totalQuantity} Cups for {totalPrice}
            </Text>
            <Image source={require('../assets/images/amdBlack.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
      )}
    </View >
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
  header: {
    height: height * 0.3,
    width: '100%',
  },
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 10,
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
    fontSize: width * 0.08,
    marginTop: height * 0.01,
    fontFamily: 'LatoBold',
    marginBottom: height * 0.04,
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
  closeIcon: {
    position: 'absolute',
    top: 40,
    left: 0,
    padding: 10,
    zIndex: 2,
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
  },
  image: {
    width: width * 0.21,
    height: width * 0.3,
    resizeMode: 'cover',
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
    width: width * 0.38,
    marginLeft: -width * 0.04,

  },
  info: {
    width: width * 0.55,
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
    marginTop: height * 0.03,
    marginLeft: -width * 0.04,

    // marginTop: height * 0.015,
  },
  buttonPlusMinus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // marginTop: height * 0.015,
    borderRadius: 30,
    // backgroundColor: '#EC6C4F',
    height: height * 0.035,
    width: width * 0.25,
    // paddingHorizontal: height * 0.013,
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
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

export default HOC(CoffeeMusicScreen);
