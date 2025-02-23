import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { BASE_URL } from '../utils/requests';
import { RFPercentage } from 'react-native-responsive-fontsize';
import OrderStatusPanel from '../components/OrderProgressPanel';
import DeleteOrderScreen from '../components/DeleteOrderScreen';

const { width, height } = Dimensions.get('window');

const CoffeeMusicScreen = ({ navigation }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [token, setToken] = useState(null);
    const [location, setLocation] = useState(null);
    const [shops, setShops] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingShops, setLoadingShops] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [paymentType, setPaymentType] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const textInputRef = useRef(null);

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

        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error("Error getting token from AsyncStorage:", error);
            }
        };

        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);
            } catch (error) {
                console.error("Error getting location:", error);
            }
        };

        Promise.all([loadFonts(), getToken(), getLocation()]).then(() => {
            setIsLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (token && location) {
            fetchShops();
            checkState(); // Вызываем checkState при загрузке токена и местоположения
        }
    }, [token, location]);

    const checkState = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/Authentication/state`, {
                headers: {
                    TokenString: token,
                },
            });
            setOrderStatus(response.data.orderStatus);
            setPaymentType(response.data.paymentType);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                checkState(); // Периодически проверяем состояние
            }
        }, 60000); // 60 секунд

        return () => clearInterval(interval); // Очистка при размонтировании компонента
    }, [token]);

    const fetchShops = async () => {
        if (!token || !location) return;
        
        try {
            setLoadingShops(true);
            const { latitude, longitude } = location.coords;
            const response = await axios.get(`${BASE_URL}/api/v1/Company/nearest/${longitude}/${latitude}`, {
                headers: { TokenString: token },
            });
            if (Array.isArray(response.data)) {
                setShops(response.data);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoadingShops(false);
        }
    };

    const onOrderDelete = async () => {
        try {
            setResponseStatus('deleting'); // Устанавливаем состояние "удаление в процессе"
            const response = await axios.delete(`${BASE_URL}/api/v1/Order/cancel-order-user`, {
                headers: {
                    tokenString: token,
                }
            });
            if (response.status === 200) {
                setResponseStatus(true); // Устанавливаем состояние "успешное удаление"
                setTimeout(() => {
                    setAlertVisible(false); // Закрываем модальное окно
                    setResponseStatus(null); // Сбрасываем состояние
                    checkState(); // Обновляем состояние заказа
                }, 2000); // Закрываем через 2 секунды
            }
        } catch (err) {
            console.error(err);
            setResponseStatus(false); // Устанавливаем состояние "ошибка удаления"
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchShops();
        await checkState(); // Вызываем checkState при обновлении страницы
        setRefreshing(false);
    };

    const onPanelPress = () => {
        setAlertVisible(true);
    };

    if (!isLoaded || loadingShops) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <DeleteOrderScreen
                visible={alertVisible}
                onConfirm={onOrderDelete}
                onCancel={() => setAlertVisible(false)}
                paymentType={paymentType}
                responseStatus={responseStatus}
            />

            <View style={styles.header}>
                <Feather name="user" size={RFPercentage(2.5)} color="white" onPress={() => navigation.navigate('ProfileScreen')} />
                <TextInput
                    ref={textInputRef}
                    style={styles.searchInput}
                    placeholder="Search your coffee shop"
                    placeholderTextColor="#1C1C1C"
                />
                <FontAwesome5 name="coins" size={RFPercentage(2.5)} color="white" />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#fff']}
                        tintColor="#fff"
                    />
                }
            >
                {orderStatus || orderStatus === 0 ? <OrderStatusPanel step={orderStatus} onPress={onPanelPress} /> : null}

                <View style={styles.shopList}>
                    {shops.length > 0 ? (
                        shops.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.shopItem}
                                onPress={() => navigation.navigate('ProductScreen', { id: item.id, logo: item.logoFileName, name: item.name })}
                            >
                                <Image source={{ uri: item.uiFileName }} style={styles.shopImage} />
                                <View style={styles.shopText}>
                                    <Text style={styles.shopName}>{item.name}</Text>
                                    <Text style={styles.shopDistance}>Nearest {item.nearest}m</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noShopsText}>No shops found</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
        alignItems: 'center',
        paddingBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: width * 0.05,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        color: '#1C1C1C',
        width: width * 0.6,
    },
    shopList: {
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.02,
        alignItems: 'center',
    },
    shopItem: {
        marginBottom: height * 0.03,
        width: width * 0.9,
    },
    shopImage: {
        height: height * 0.25,
        borderRadius: width * 0.05,
        width: '100%',
    },
    shopText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.01,
    },
    scroll: {
        alignItems: 'center',
    },
    shopName: {
        color: '#fff',
        fontSize: RFPercentage(2.5),
        fontWeight: 'bold',
        fontFamily: 'InterBold',
    },
    shopDistance: {
        color: '#fff',
        fontFamily: 'InterThin',
        fontSize: RFPercentage(2),
    },
    noShopsText: {
        color: '#fff',
        fontSize: RFPercentage(2.5),
        fontFamily: 'InterThin',
        marginTop: height * 0.02,
    },
});

export default CoffeeMusicScreen;