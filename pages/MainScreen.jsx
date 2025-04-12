import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { api } from '../utils/requests'; // Import the configured api instance
import { RFPercentage } from 'react-native-responsive-fontsize';
import OrderStatusPanel from '../components/OrderProgressPanel';
import DeleteOrderScreen from '../components/DeleteOrderScreen';
import SuccessAlert from '../components/SuccessAlert';
import MapTest from '../components/test'
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
            // Use 'userToken' key consistent with interceptor
            const storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Error getting token from AsyncStorage:", error);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            // Use 'userToken' key consistent with interceptor
            await AsyncStorage.removeItem('userToken');
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
            // Use api instance, headers handled by interceptor
            const response = await api.get('/api/v1/Authentication/state');

            if (response.data.forceToChangePassword) {
                navigation.navigate('ForceChangePasswordScreen');
                return;
            }

            setOrderStatus(response.data.orderStatus);
            setPaymentType(response.data.paymentType);
        } catch (err) {
            console.error(err);
        }
    }, [token, navigation]);

    const checkPayment = useCallback(async () => {
        if (!token) return;
        try {
            // Use api instance, headers handled by interceptor
            const response = await api.patch('/api/v1/Order/check-payment');
            if (response.data === false) {
                // Use api instance, headers handled by interceptor
                await api.delete('/api/v1/Order/cancel-order-user');
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
            // Use api instance, headers handled by interceptor
            const response = await api.get(`/api/v1/Company/nearest/${longitude}/${latitude}`);
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
            // Use api instance, headers handled by interceptor
            const response = await api.delete('/api/v1/Order/cancel-order-user');
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
            onPress={() => navigation.navigate('MainMap', { branchId: item.id, isUpdate:true })}
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
        <SafeAreaView style={styles.container}>
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
                    <View style={styles.imageBlock}>
                        <Image
                            source={require('../assets/images/trueLogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C0C0C',
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
        borderWidth: 1,
        borderColor: '#F7A300',
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
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
    imageBlock: {
        backgroundColor: '#000',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#F7A300',
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 30,
        paddingLeft: 1
    },
    logo: {
        width: 30,
        height: 30,
    },
});

export default CoffeeMusicScreen;