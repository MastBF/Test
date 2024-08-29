import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import ErrorMessage from '../components/ErrorMessage';
import { AntDesign } from '@expo/vector-icons';
import HOC from '../components/HOC';
import * as Font from 'expo-font';
import amdWhite from '../assets/images/amdWhite.png';
import amdBlack from '../assets/images/amdBlack2.png';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cup from '../assets/images/ProductImg/cup.png';

const { width, height } = Dimensions.get('window');

const CoffeeMusicScreen = ({ navigation }) => {
  const [data, setData] = useState([
    { id: '1', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '2', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '3', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '4', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
  ]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [counts, setCounts] = useState({});
  const [token, setToken] = useState(null);
  const [quentity, setQuantity] = useState(1);

  const postOrder = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/Order/${1}?cardId=${1}`,
        [
          {
            // "productTypeId": 1,
            "quantity": quentity
          }
        ],
        {
          headers: {
            'accept': '*/*',
            'TokenString': token,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Order response:', response.data);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error("Токен не найден в AsyncStorage");
        }
      } catch (error) {
        console.error("Ошибка получения токена из AsyncStorage:", error);
      }
    };

    getToken();
  }, []);

  // const onPlus = (id) => {
  //   setCounts(prevCounts => ({
  //     ...prevCounts,
  //     [id]: (prevCounts[id] || 0) + 1
  //   }));
  //   console.log('Counts:', counts);
  // };

  const onPlus = (id) => {
    const num = counts.quantity;
    setCounts(prevCounts => ({
      ...prevCounts,
      id: id,
      quantity: (num || 0) + 1
    }));
    console.log('Counts:', counts);
  }

  const onMinus = (id) => {
    const num = counts.quantity;
    setCounts(prevCounts => ({
      ...prevCounts,
      id: id,
      quantity: (num || 0) - 1
    }));

  };

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Разрешение на доступ к местоположению было отклонено');
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await axios.get(`${BASE_URL}/api/v1/Product/${3}?page=${1}&pageSize=${10}`, {
          headers: {
            TokenString: token,
          },
        });
        const responseData = request.data;
        console.log('Response Data:', responseData);
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else {
          Alert.alert("Полученные данные не являются массивом");
        }
      } catch (err) {
        setErrorMsg(err.message);
        console.error('Error fetching data:', err);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
        RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        LatoBold: require('../assets/fonts/Lato-Bold.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMsg && <ErrorMessage errorMsg={errorMsg} />}
      <View style={styles.header}>
        <Image source={require('../assets/images/ProductImg/background.png')} style={styles.headerImage} />
      </View>
      <ScrollView style={styles.prodList} contentContainerStyle={styles.list}>
        <Text style={styles.title}>Coffee Music</Text>

        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              onPress={() => {
                navigation.navigate('ItemScreen');
              }}
            >
              <View style={styles.itemContainer}>
                {/* <Image source={{ uri: item.imagePath }} style={styles.image} /> */}
                <Image source={cup} style={styles.image} />
                <View style={styles.info}>
                  <View style={styles.PriveName}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{item.price}</Text>
                      <Image source={amdWhite} style={styles.amdWhite} />
                    </View>
                  </View>
                  <Text style={styles.description}>{item.description}</Text>
                  <View style={styles.buttonPlusMinus}>
                    {counts[item.id] > 0 && (
                      <TouchableOpacity style={styles.buttonWrapper} onPress={() => onMinus(item.id)}>
                        <AntDesign name="minuscircle" size={16} color="white" />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.count}>{counts[item.quantity] > 0 ? `${counts[item.quantity]}x` : ''}</Text>
                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => onPlus(item.id)}>
                      <AntDesign name="pluscircle" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No Products found</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.footer} onPress={postOrder}>
        <View style={styles.footerBlock}>
          <Text style={styles.footerTextNone}>~No15</Text>
          <Text style={styles.footerText}>Order</Text>
          <View style={styles.priceOnButton}>
            <Text style={styles.footerTextSecond}>700</Text>
            <Image source={amdBlack} style={styles.amdBlack} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
    alignItems: 'center',
    margin: width * 0.05,
  },
  headerImage: {
    marginTop: -height * 0.05,
  },
  PriveName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: width * 0.08,
    marginTop: height * 0.01,
    fontFamily: 'RobotoBold',
  },
  list: {
    paddingHorizontal: width * 0.05,
  },
  amdWhite: {
    width: width * 0.04,
    height: width * 0.04,
    resizeMode: 'contain',
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
  prodList: {
    backgroundColor: '#1C1C1C',
    borderTopRightRadius: width * 0.1,
    borderTopLeftRadius: width * 0.1,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: height * 0.015,
    justifyContent: 'space-between',
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'cover',
    marginRight: width * 0.05,
    borderRadius: 10,
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
  },
  info: {
    width: width * 0.55,
  },
  buttonWrapper: {
    marginHorizontal: width * 0.015,
  },
  count: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'RobotoBold',
  },
  buttonPlusMinus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.015,
  },
  price: {
    fontSize: width * 0.045,
    fontFamily: 'RobotoBold',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.13,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: width * 0.1,
    borderTopLeftRadius: width * 0.1,
  },
  footerBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  footerText: {
    fontSize: width * 0.08,
    fontFamily: 'RobotoBold',
    color: '#000',
    marginHorizontal: width * 0.15,
  },
  footerTextNone: {
    fontSize: width * 0.08,
    fontFamily: 'RobotoBold',
    color: '#000',
    marginLeft: width * 0.04,
  },
  footerTextSecond: {
    fontSize: width * 0.06,
    fontFamily: 'RobotoBold',
    color: '#000',
    marginRight: width * 0.01,
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
