import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator, Animated, ScrollView } from 'react-native';
import amdWhite from '../assets/images/amdWhite.png';
import amdWhiteBold from '../assets/images/amdWhiteBold.png';
import * as Font from 'expo-font';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';

export default function PaymentScreen({ navigation, route }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [count, setCount] = useState(2);
    const [price, setPrice] = useState(1600);
    const [totalPrice, setTotalPrice] = useState(price);
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const [card, setCard] = useState([]);
    const [creditCardId, setCreditCardId] = useState(null);
    const [selectedCard, setSelectedCard] = useState({ cardNumber: 'Choose Credit Card' });
    const { quentity, priceItem, oneCupPrice, id, token, typeId, color, coffeeName } = route.params;
    useEffect(() => {
        setTotalPrice(priceItem);
        setCount(quentity);
    }, [quentity]);

    const toggleCard = () => {
        const finalHeight = isOpen ? 0 : 150;

        Animated.timing(animation, {
            toValue: finalHeight,
            duration: 400,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);
    };


    const onNewCard = () => {
        navigation.navigate('AddPaymentCardScreen');
    }
    const onCardButton = (id, cardNumberFirstDigits, cardNumber) => {
        const selectedCard = card.find((item) => item.id === id);
        setSelectedCard(selectedCard);
        setIsOpen(!isOpen);
        setCreditCardId(id);
    }
    const onButtonPress = () => {
        navigation.goBack();
    }
    const getCard = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/v1/Order/card`,
                {
                    headers: {
                        'TokenString': token,
                    }
                }
            );
            console.log('Card response:', response.data);
            setCard(response.data);
        } catch (error) {
            console.error('Error getting card:', error);
        }
    };

    const onPressPlus = () => {
        setCount(count + 1);
        setTotalPrice(totalPrice + oneCupPrice);
    }

    const onPressMinus = () => {
        if (count > 1) {
            setCount(count - 1);
            setTotalPrice(totalPrice - oneCupPrice);
        } else {
            setCount(1);
            setTotalPrice(oneCupPrice);
        }
    }

    const postOrder = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/Order/${id}?cardId=${creditCardId}`,
                [
                    {
                        "quantity": quentity,
                        "productTypeId": typeId
                    }
                ],
                {
                    headers: {
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
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
                LatoLight: require('../assets/fonts/Lato-Light.ttf'),
                InterThin: require('../assets/fonts/Inter-Thin.ttf'),
                InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
                InterBold: require('../assets/fonts/Inter-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    useEffect(() => {
        getCard();
    }, []);


    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AntDesign name="left" size={20} color="#fff" style={styles.icon} onPress={onButtonPress} />
                <Text style={styles.headerText}>Payment For The Order</Text>
            </View>
            <View style={styles.orderSection}>
                <Text style={styles.sectionTitle}>Your Order</Text>
                <Text style={styles.productDescription}>1 Product From <Text style={styles.boldText}>Coffee Music</Text></Text>
                <View>
                    <View style={styles.productRow}>
                        <Text style={styles.productQuantity}>{count}x</Text>
                        <Text style={styles.productName}>{coffeeName}</Text>
                        <Text style={styles.productPrice}>{totalPrice} </Text>
                        <Image source={amdWhite} style={styles.amdIcon} />
                    </View>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.productQuantityHidden}>2x</Text>
                        <Text style={styles.text}>5%</Text>
                        <View style={[styles.borderDiv, { backgroundColor: color }]}>
                            <Text style={styles.borderText}>Cashback</Text>
                        </View>
                    </View>
                    <View style={styles.countEdit}>
                        <TouchableOpacity onPress={onPressMinus} style={styles.minusButton}>
                            <AntDesign name='minuscircle' size={18} color='#fff' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressPlus} style={styles.minusButton}>
                            <AntDesign name='pluscircle' size={18} color='#fff' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Payment Method Section */}
            <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <TouchableOpacity onPress={toggleCard}>
                    <View style={styles.cardInfo}>
                        <View style={styles.rowBlock}>
                            <FontAwesome name='cc-visa' size={20} color='#fff' style={styles.visaIcon} />
                            <Text style={styles.cardText}>{selectedCard.cardNumber === 'Choose Credit Card' ? '' : 'Card Ending With'} {selectedCard.cardNumber}</Text>
                        </View>
                        <AntDesign name="down" size={20} color="#fff" style={styles.iconDown} />
                    </View>

                </TouchableOpacity>
                <Animated.View style={[styles.animatedContainer, { height: animation }]}>

                    <ScrollView>
                        {card.map((item, index) => (
                            <TouchableOpacity style={styles.otherCards} onPress={() => onCardButton(item.id, item.cardNumberFirstDigits, item.cardNumber)}>
                                <FontAwesome name='cc-visa' size={20} color='#fff' style={styles.visaIcon} />
                                <Text key={index} style={styles.animatedText}>
                                    Card Ending With {item.cardNumberFirstDigits}<Text style={styles.boldNumbers}>{item.cardNumber}</Text>
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.newCardAdd} onPress={onNewCard}>
                            <FontAwesome name='plus-circle' size={20} color='#fff' style={styles.visaIcon} />
                            <Text style={styles.cashbackLabelCard}>Add New Card</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </View>

            <View style={[styles.summarySection, { borderTopColor: color }]}>
                <Text style={styles.summeryTitle}>Summary Information</Text>
                <View style={[styles.summaryRow, styles.bottomMargin]} >
                    <Text style={styles.summaryText}>Products</Text>
                    <Text style={styles.summaryPrice}>{totalPrice} <Image source={amdWhite} style={styles.amdIconOrder} /></Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryText, styles.boldTextOrder]}>Total</Text>
                    <Text style={[styles.summaryPrice, styles.boldTextOrder]}>{totalPrice} <Image source={amdWhiteBold} style={styles.amdIconOrder} /></Text>
                </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={postOrder}>
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        paddingTop: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c1c1c',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginTop: 20,
        // paddingHorizontal: 20,

    },
    orderSection: {
        paddingHorizontal: 20,
    },
    icon: {
        position: 'absolute',
        left: 15,
    },
    headerText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'RobotoBold',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'RobotoBold',
        marginBottom: 20,
    },
    productDescription: {
        color: '#fff',
        marginTop: 10,
        marginBottom: 20,
        fontFamily: 'RobotoThin',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    productQuantity: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
        fontFamily: 'RobotoBold',
    },
    otherCards: {
        flexDirection: 'row',
        borderBottomColor: '#2E2E2E',
        borderBottomWidth: 1,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        paddingBottom: 7,

    },
    newCardAdd: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 20,
    },
    cashbackLabelCard: {
        color: '#fff',
        fontSize: 15,
    },
    animatedContainer: {
        overflow: 'hidden',
        paddingLeft: 10,
    },
    boldNumbers: {
        color: '#fff',
        // fontSize: 16,
        fontWeight: 'bold',
    },
    productQuantityHidden: {
        color: '#1c1c1c',
        fontSize: 16,
        marginRight: 10,
    },
    productName: {
        color: 'white',
        fontSize: 16,
        flex: 1,
        fontFamily: 'RobotoRegular',
    },
    productPrice: {
        color: 'white',
        fontSize: 20,
        textAlign: 'right',
        fontFamily: 'RobotoLight',
    },
    cashbackLabel: {
        color: '#fff',
        fontSize: 14,
    },
    amdIcon: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
    },
    amdIconOrder: {
        resizeMode: 'contain',
        width: 12,
        height: 12,
        alignSelf: 'center',
    },
    boldText: {
        fontFamily: 'RobotoRegular',
        color: '#fff',
    },
    boldTextOrder: {
        fontFamily: 'RobotoBold',
        color: '#fff',
    },
    summeryTitle: {
        color: '#fff',
        fontSize: 24,
        // fontWeight: 'bold',
        marginVertical: 15,
        fontFamily: 'RobotoBold',
    },
    rowBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cashbackText: {
        backgroundColor: '#EC6C4F',
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    countBlock: {
        marginRight: 10,
    },
    count: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    visaIcon: {
        marginRight: 10,
        alignSelf: 'center',
    },
    animatedText: {
        color: '#fff',
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontWeight: '200',
    },
    row: {
        flexDirection: 'row',
    },
    paymentSection: {
        marginTop: 30,
        marginBottom: 20,
        flex: 2,
        paddingHorizontal: 20,
    },
    cardInfo: {
        paddingVertical: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'RobotoMedium',
    },
    summarySection: {
        backgroundColor: '#2E2E2E',
        // borderTopColor: '#EC6C4F',
        borderTopWidth: 1,
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 20,
        marginTop: 20,
        width: '100%',
        height: '35%',
        paddingHorizontal: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    bottomMargin: {
        marginBottom: 60,
    },
    summaryText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'RobotoLight',
    },
    summaryPrice: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'RobotoLight',
    },
    optionTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    minusButton: {},
    borderText: {
        color: '#fff',
        fontSize: 12,
        paddingVertical: 0,
        paddingHorizontal: 4,
        fontWeight: 'bold',
    },
    borderDiv: {
        // backgroundColor: '#EC6C4F',
        borderRadius: 6,
        marginLeft: 8,
        marginBottom: 20,
    },
    text: {
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'RobotoBold',
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: '90%',
        alignSelf: 'center',
    },
    confirmButtonText: {
        color: '#1c1c1c',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
