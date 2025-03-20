import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TouchableOpacity, PixelRatio, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import amdWhite from '../assets/images/amdWhite.png';
import axios from 'axios';
import { BASE_URL } from '@/utils/requests';

const { width, height } = Dimensions.get('window');
const scale = width / 375; 
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const Cart = () => {
    const route = useRoute();
    const [cartProducts, setCartProducts] = useState(route.params.cartProducts || []);
    const { navigation, companyColor, token, branchId } = route.params;
    const [buttonPressed, setButtonPressed] = useState(false); // State for button press
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [companyInfo, setCompanyInfo] = useState(null); // State for company info
    const [loadingCompanyInfo, setLoadingCompanyInfo] = useState(true); // Loading state for company info

    // Define handlePressIn and handlePressOut
    const handlePressIn = () => {
        setButtonPressed(true); // Set buttonPressed to true when pressed
    };
    const removeItem = (id) => {
        console.log('Removing item from cart:', id);        
        setCartProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        if (route.params.removeFromCart) {
          route.params.removeFromCart(id);
        }
      };
    const handlePressOut = () => {
        setButtonPressed(false); // Set buttonPressed to false when released
    };

    // Fetch company info when the component mounts
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/v1/Branch/user/get-company-basic-info/${branchId}`,
                    { headers: { TokenString: token } }
                );
                console.log(response.data);
                
                setCompanyInfo(response.data);
            } catch (error) {
                console.error('Error fetching company info:', error);
                Alert.alert('Error', 'Failed to load company information');
            } finally {
                setLoadingCompanyInfo(false);
            }
        };

        fetchCompanyInfo();
    }, [branchId, token]);

    // Calculate total quantity and price
    useEffect(() => {
        const quantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
        const price = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

        setTotalQuantity(quantity);
        setTotalPrice(price);
    }, [cartProducts]);

    // Update product quantity
    const updateQuantity = (id, action) => {
        setCartProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === id) {
                    const newQuantity = action === 'increase' ? product.quantity + 1 : product.quantity - 1;
                    return {
                        ...product,
                        quantity: newQuantity >= 1 ? newQuantity : 1,
                    };
                }
                return product;
            })
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.prodList} contentContainerStyle={[styles.list, { paddingBottom: 80 }]}>
                <View style={styles.header}>
                    <Icon
                        name="left"
                        type="antdesign"
                        color="#fff"
                        containerStyle={styles.closeIcon}
                        size={20}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.title}>Cart</Text>
                </View>

                {/* Company Info Section */}
                {loadingCompanyInfo ? (
                    <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
                ) : companyInfo ? (
                    <View style={[styles.companyInfoContainer, { borderColor: companyColor }]}>
                        <Image
                            source={{ uri: companyInfo.logoFileName }}
                            style={styles.companyLogo}
                            resizeMode="contain"
                        />
                        <View style={styles.companyDetails}>
                            <Text style={styles.companyName}>{companyInfo.name}</Text>
                            <Text style={styles.companyAddress}>{companyInfo.branchAddress}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.noCompanyInfo}>Company information not available</Text>
                )}

                {/* Product List */}
                {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
                    cartProducts.map((item) => (
                        <TouchableOpacity key={item.id}>
                            <View style={[styles.itemContainer, { borderColor: companyColor, borderWidth: 1, shadowColor: companyColor }]}>
                                <AntDesign
                                    name="close"
                                    style={styles.closeButton}
                                    size={18}
                                    onPress={() => removeItem(item.id)}
                                />
                                <View style={styles.coffeeInfo}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.info}>
                                        <View style={styles.details}>
                                            <View style={styles.PriveName}>
                                                <Text style={styles.name}>{item.title}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            {/* <Text style={styles.description}>{item.description}</Text> */}
                                            <Text style={styles.description}>Lorem ipsum, dolor sit  Omnis </Text>
                                        </View>
                                        <View style={styles.itemContainerFooter}>
                                            <View style={[styles.buttonPlusMinus, { backgroundColor: companyColor }]}>
                                                <TouchableOpacity
                                                    style={styles.buttonWrapper}
                                                    onPress={() => updateQuantity(item.id, 'decrease')}>
                                                    <Entypo name="minus" size={16} color="black" />
                                                </TouchableOpacity>
                                                <View style={styles.count}>
                                                    <Text style={styles.textStyle}>{item.quantity}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.buttonWrapper}
                                                    onPress={() => updateQuantity(item.id, 'increase')}>
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

            {/* Order Button */}
            {!!cartProducts.length && (
                <TouchableOpacity
                    style={[styles.orderButton, buttonPressed && styles.orderButtonActive]}
                    onPress={() => navigation.navigate('PaymentScreen', { id: branchId, token, color: companyColor, cartProducts, totalPrice, totalQuantity })}
                    onPressIn={handlePressIn} // Uses handlePressIn
                    onPressOut={handlePressOut} // Uses handlePressOut
                >
                    <View style={styles.content}>
                        <Text style={styles.orderButtonText}>
                            Order {totalQuantity} Cups for {totalPrice}
                        </Text>
                        <Image source={require('../assets/images/amdBlack.png')} style={styles.icon} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
    },
    titlePart: {
        color: '#fff',
        fontSize: normalize(24),
        fontWeight: 'bold',
        fontFamily: 'RobotoBold',
        marginBottom: normalize(20),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize(25),
        marginTop: normalize(100),
        marginBottom: normalize(20),
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
    cartIcon: {
        alignSelf: 'center',
    },
    headerImage: {
        marginTop: normalize(-height * 0.04),
        height: normalize(height * 0.33),
    },
    PriveName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(height * 0.01),
        width: '100%',
        marginLeft: normalize(-width * 0.04),
    },
    title: {
        color: '#fff',
        fontSize: normalize(18),
        fontFamily: 'RobotoBold',
        alignSelf: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: normalize(10),
        top: normalize(15),
        color: '#fff'
    },
    list: {
        paddingHorizontal: normalize(width * 0.05),
    },
    req: {
        color: '#fff',
        fontSize: normalize(width * 0.08),
        marginTop: normalize(height * 0.01),
        fontFamily: 'LatoBold',
        marginBottom: normalize(height * 0.04),
    },
    amdWhite: {
        width: normalize(width * 0.035),
        height: normalize(width * 0.035),
        resizeMode: 'contain',
    },
    pageTitle: {
        color: '#fff',
        fontSize: normalize(width * 0.08),
        fontFamily: 'LatoBold',
        marginTop: normalize(height * 0.02),
    },
    buttonPlusMinus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: normalize(30),
        height: normalize(height * 0.035),
        width: normalize(width * 0.25),
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amdBlack: {
        width: normalize(width * 0.035),
        height: normalize(width * 0.035),
        resizeMode: 'contain',
    },
    priceOnButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderButton: {
        backgroundColor: 'transparent',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(25),
        borderRadius: normalize(30),
        borderWidth: 1,
        borderColor: '#fff',
        alignSelf: 'center',
        position: 'absolute',
        bottom: normalize(20),
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: normalize(6) },
        shadowOpacity: 0.5,
        shadowRadius: normalize(10),
        elevation: 5,
        transform: [{ scale: 1 }],
        transition: 'transform 0.2s ease-in-out',
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
        width: normalize(13),
        height: normalize(14),
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
        borderTopRightRadius: normalize(width * 0.1),
        marginTop: normalize(-height * 0.09),
    },
    itemContainer: {
        flexDirection: 'column',
        marginVertical: normalize(height * 0.01),
        justifyContent: 'space-between',
        borderWidth: 1,
        width: '100%',
        paddingVertical: normalize(width * 0.03),
        paddingHorizontal: normalize(width * 0.015),
        borderRadius: normalize(15),
        height: normalize(height * 0.17),
        maxHeight: normalize(height * 0.17),
        backgroundColor: '#2E2E2E',
        shadowOffset: { width: 0, height: normalize(4) },
        shadowOpacity: 0.3,
        shadowRadius: normalize(5),
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: normalize(width * 0.18),
        height: normalize(width * 0.25),
        resizeMode: 'contain',
        alignSelf: 'center',
        // backgroundColor: 'red'
    },
    name: {
        fontSize: normalize(width * 0.05),
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
    info: {
        width: normalize(width * 0.55),
    },
    buttonWrapper: {
        alignSelf: 'center',
        padding: normalize(5),
        paddingHorizontal: normalize(10),
    },
    count: {
        color: '#fff',
        fontSize: normalize(width * 0.035),
        fontFamily: 'RubikRegular',
        backgroundColor: '#1C1C1C',
        width: normalize(width * 0.08),
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
        marginTop: normalize(height * 0.02),
        marginLeft: normalize(-width * 0.04),
    },
    closeIcon: {
        position: 'absolute',
        left: 0,
    },
    price: {
        fontSize: normalize(width * 0.045),
        fontFamily: 'RobotoRegular',
        color: '#fff',
    },
    footer: {
        position: 'absolute',
        bottom: normalize(10),
        height: normalize(height * 0.06),
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: normalize(width * 0.1),
        alignSelf: 'center',
    },
    orderButtonActive: {
        transform: [{ scale: 0.95 }],
    },
    footerBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    footerText: {
        fontSize: normalize(width * 0.05),
        fontFamily: 'RobotoBold',
        color: '#000',
        marginHorizontal: normalize(width * 0.2),
    },
    footerTextNone: {
        fontSize: normalize(width * 0.05),
        fontFamily: 'RobotoLight',
        color: '#000',
    },
    footerTextSecond: {
        fontSize: normalize(width * 0.05),
        fontFamily: 'RobotoLight',
        color: '#000',
    },
    noDataText: {
        color: '#fff',
        fontSize: normalize(width * 0.045),
        fontFamily: 'RobotoRegular',
        textAlign: 'center',
        marginTop: normalize(height * 0.02),
    },
    companyInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: '#2E2E2E',
    },
    companyLogo: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
    },
    companyDetails: {
        flex: 1,
    },
    companyName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'RobotoBold',
    },
    companyAddress: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'RobotoRegular',
        opacity: 0.9,
    },
    companyEmail: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'RobotoRegular',
        marginTop: 5,
        opacity: 0.8,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    noCompanyInfo: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
});


export default Cart;
