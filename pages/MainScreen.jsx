import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl, FlatList } from 'react-native';
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
import SuccessAlert from '../components/SuccessAlert';

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

    const loadFonts = useCallback(async () => {
        await Font.loadAsync({
            RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
            LatoLight: require('../assets/fonts/Lato-Light.ttf'),
            InterThin: require('../assets/fonts/Inter-Thin.ttf'),
            InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
            InterBold: require('../assets/fonts/Inter-Bold.ttf'),
        });
        setFontsLoaded(true);
    }, []);

    const getToken = useCallback(async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Error getting token from AsyncStorage:", error);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('refreshToken')
            setToken(null);
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }, [navigation]);

    const getLocation = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        const initialize = async () => {
            await Promise.all([loadFonts(), getToken(), getLocation()]);
            setIsLoaded(true);
        };
        initialize();
    }, [loadFonts, getToken, getLocation]);

    const checkState = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/Authentication/state`, {
                headers: { TokenString: token },
            });
            setOrderStatus(response.data.orderStatus);
            setPaymentType(response.data.paymentType);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    const checkPayment = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.patch(`${BASE_URL}/api/v1/Order/check-payment`, {
                headers: { tokenString: token }
            });
            if (response.data === false) {
                await axios.delete(`${BASE_URL}/api/v1/Order/cancel-order-user`, {
                    headers: { tokenString: token },
                });
            }
        } catch (err) {
            setOrderStatus(null);
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        if (token && location) {
            fetchShops();
            checkState();
            if (paymentType === 2) {
                checkPayment();
            }
        }
    }, [token, location, checkState, checkPayment, paymentType]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                checkState();
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [token, checkState]);

    const fetchShops = useCallback(async () => {
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
    }, [token, location]);

    const onOrderDelete = useCallback(async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/v1/Order/cancel-order-user`, {
                headers: { tokenString: token },
            });
            if (response.status === 200) {
                setResponseStatus(true);
                setTimeout(() => {
                    setAlertVisible(false);
                    setResponseStatus(null);
                    checkState();
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setResponseStatus(false);
        }
    }, [token, checkState]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchShops();
        await checkState();
        setRefreshing(false);
    }, [fetchShops, checkState]);

    const onPanelPress = useCallback(() => {
        setAlertVisible(true);
    }, []);

    const renderShopItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.shopItem}
            onPress={() => navigation.navigate('ProductScreen', { id: item.id, logo: item.logoFileName, name: item.name })}
        >
            <Image source={{ uri: item.uiFileName }} style={styles.shopImage} />
            <View style={styles.shopText}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopDistance}>Nearest {item.nearest}m</Text>
            </View>
        </TouchableOpacity>
    ), [navigation]);

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
                <View style={styles.logoBlock}>
                    <Text style={styles.logoText}>Take & Go</Text>
                    <Image
                        source={require('../assets/images/trueLogo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                {/* <FontAwesome5 name="coins" size={RFPercentage(2.5)} color="white" /> */}
                <Feather
                    name='log-out'
                    color='white'
                    size={RFPercentage(2.5)}
                    onPress={handleLogout}
                />
            </View>

            <FlatList
                data={shops}
                renderItem={renderShopItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#fff']}
                        tintColor="#fff"
                    />
                }
                ListHeaderComponent={
                    orderStatus !== null ? (
                        <OrderStatusPanel step={orderStatus} onPress={onPanelPress} />
                    ) : null
                }
                ListEmptyComponent={<Text style={styles.noShopsText}>No shops found</Text>}
            />
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
    shopList: {
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.02,
        alignItems: 'center',
    },
    logo: {
        width: 30,
    },
    logoText: {
        width: 20,
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
    logoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        color: '#fff',
        fontSize: RFPercentage(3),
        fontFamily: 'InterBold',
        marginRight: 8,
    },
    logo: {
        width: 40,
        height: 40,
    },
});

export default CoffeeMusicScreen;