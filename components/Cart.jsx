// ProductList.js
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import amdWhite from '../assets/images/amdWhite.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { BASE_URL } from '@/utils/requests';
import AlertScreen from './AlertScreen';

const { width, height } = Dimensions.get('window');

const Cart = () => {
    const route = useRoute();
    const [cartProducts, setCartProducts] = useState(route.params.cartProducts || []);
    const { navigation, companyColor, token, branchId } = route.params;

    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        const quantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
        const price = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

        setTotalQuantity(quantity);
        setTotalPrice(price);
    }, [cartProducts]);

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
                {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
                    cartProducts.map((item) => (
                        <TouchableOpacity key={item.id}>
                            <View style={[styles.itemContainer, { borderColor: companyColor, borderWidth: 1 }]}>
                                <View style={styles.coffeeInfo}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.info}>
                                        <View style={styles.details}>
                                            <View style={styles.PriveName}>
                                                <Text style={styles.name}>{item.title}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.description}>{item.description}</Text>
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
            {!!cartProducts.length &&
                <TouchableOpacity TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate('PaymentScreen', { id: branchId, token, color: companyColor, cartProducts, totalPrice, totalQuantity })
                }>

                    <View style={styles.content}>
                        <Text style={styles.orderButtonText}>
                            Order {totalQuantity} Cups for {totalPrice}
                        </Text>
                        <Image source={require('../assets/images/amdBlack.png')} style={styles.icon} />
                    </View>
                </TouchableOpacity>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',

    },
    titlePart: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'RobotoBold',
        marginBottom: 20,
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
        height: 25,
        marginTop: 100,
        marginBottom: 20,
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
        fontSize: 18,
        fontFamily: 'RobotoBold',
        alignSelf: 'center',

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
    pageTitle: {
        color: '#fff',
        fontSize: width * 0.08,
        fontFamily: 'LatoBold',
        marginTop: height * 0.02,

    },


    buttonPlusMinus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 30,
        height: height * 0.035,
        width: width * 0.25,
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
        color: '#fff',
    },
    itemContainerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: height * 0.03,
        marginLeft: -width * 0.04,
    },
    closeIcon: {
        position: 'absolute',
        left: 0,
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
export default Cart;
