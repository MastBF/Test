import { AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator, Animated, ScrollView } from 'react-native';
import amdWhite from '../assets/images/amdWhite.png';
import amdWhiteBold from '../assets/images/amdWhiteBold.png';
import * as Font from 'expo-font';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import AlertScreen from '@/components/AlertScreen';
import { WebView } from 'react-native-webview';
import { Linking } from "react-native";
import SuccessAlert from '@/components/SuccessAlert';
import ErrorAlert from '@/components/ErrorAlert'
import CardSelectionPopup from '@/components/CardSelectionPopup'

export default function PaymentScreen({ navigation, route }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [creditId, setCreditId] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const [openModal, setOpenModal] = useState(false)
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(false);
    const [paymentType, setPaymentType] = useState(null)
    const [message, setMessage] = useState('')
    const [showWebView, setShowWebView] = useState(false);
    const [navigateMain, setNavigateMain] = useState(false)
    const [title, setTitle] = useState()
    const [methods, setMethods] = useState([
        { title: 'Payment by card', type: 'card', id: 0 },
        // { title: 'Payment by points', type: 'coin' },
        { title: 'Add card and pay', type: 'add', id: 2, },
    ])
    const [creditCardId, setCreditCardId] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [selectedCard, setSelectedCard] = useState({ cardNumber: 'Choose Credit Card' });
    const [successAlert, setSuccessAlert] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [isSelect, setIsSelect] = useState(false)
    const { id, token, typeId, color, cartProducts, totalPrice, totalQuantity } = route.params;
    const toggleCard = () => {
        const finalHeight = isOpen ? 0 : 150;
        Animated.timing(animation, {
            toValue: finalHeight,
            duration: 400,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);
    };
    const checkPayment = async () => {
        try {
            const response = await axios.patch(`${BASE_URL}/api/v1/Order/check-payment`, {}, {
                headers: {
                    tokenString: token
                }
            })
            console.log('resp', response.data)
            if (!response.data) {
                await axios.delete(`${BASE_URL}/api/v1/Order/cancel-order-user`, {
                    headers: {
                        tokenString: token,
                    }
                });
            } else {
                return true
            }
        } catch (err) {
            console.error(err.status)
        }
    }

    const onConfirm = (id) => {
        setCreditId(id)
        setOpenModal(false)
        if (id) {
            setPaymentType(0)
        }
    }
    const ChooseCreditCard = async () => {
        await getCard()
        setTitle('Choose Credit Card')
        setIsSelect(true)
    }
    const onAddCard = () => {
        selectedCard === 2 ? setSelectedCard(null) : setPaymentType(2)
    }
    const onButtonPress = async () => {
        navigation.goBack();
    }
    const postOrder = async () => {
        try {
            if (paymentType !== 0) {
                if (!paymentType) {
                    setIsVisible(true);
                    setOpenModal(true);
                    setMessage('Credit card not selected');
                    return;
                }
            }

            const orderItems = cartProducts.map(item => ({
                productTypeId: item.typeId,
                quantity: item.quantity
            }));

            if (paymentType === 2) {
                const response = await axios.post(
                    `${BASE_URL}/api/v1/Order/${id}?paymentType=${paymentType}`,
                    orderItems,
                    {
                        headers: {
                            'accept': '*/*',
                            'TokenString': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.data) {
                    const paymentUrl = response.data;
                    setPaymentUrl(paymentUrl);
                    setShowWebView(true);
                }

            } else if (paymentType === 0) {
               const response = await axios.post(
                    `${BASE_URL}/api/v1/Order/${id}?cardId=${creditId}&paymentType=${paymentType}`,
                    orderItems,
                    {
                        headers: {
                            'accept': '*/*',
                            'TokenString': `${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('resss',response.status)
                if(response.status === 204) setSuccessAlert(true)
            }

        } catch (error) {
            setErrorAlert(true)
            setCards([])
            setOpenModal(true);
            console.error(error)
        }
    };
    const handleNavigationStateChange = async (navState) => {
        const { url } = navState;
        console.log('Current URL:', url);

        if (url.includes('https://poxery-qashela')) {
            setShowWebView(false);
            setNavigateMain(true);
            const check = await checkPayment()
            if (check) {
                setSuccessAlert(true)
            } else {
                setErrorAlert(true)
            }
        }
    };
    const onSuccessOrder = () => {
        if (navigateMain) navigation.navigate('Main')
        setSuccessAlert(false)
    }
    const onErrorOrder = () => {
        setErrorAlert(false)
    }

    const onSelectCard = (card) => {
        console.log(card)
        setCreditId(card); 
        setIsSelect(false); 
        setPaymentType(0); 
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
    const getCard = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/Order/card`, {
                headers: { TokenString: token },
            })
            setCards(response.data)

        } catch (err) {
            console.error(err)
        }
    }

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
            <SuccessAlert visible={successAlert} onCancel={onSuccessOrder} />
            <ErrorAlert visible={errorAlert} onCancel={onErrorOrder} />
            <CardSelectionPopup visible={isSelect} onCancel={() => setIsSelect(false)} cards={cards} onSelectCard={onSelectCard}/>
            {/* Payment Method Section */}
            <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <TouchableOpacity onPress={toggleCard}>
                    <View style={styles.cardInfo}>
                        <View style={styles.rowBlock}>
                            <MaterialIcons name='payment' size={24} color='#fff' style={styles.visaIcon} />
                            <Text style={styles.cardText}>Choose Payment Method</Text>
                            {/* <Text style={styles.cardText}>{selectedCard.cardNumber === 'Choose Payment Method' ? '' : 'Card Ending With'} {selectedCard.cardNumber}</Text> */}
                        </View>
                        <AntDesign name="down" size={20} color="#fff" style={styles.iconDown} />
                    </View>

                </TouchableOpacity>
                <Animated.View style={[styles.animatedContainer, { height: animation }]}>

                    <ScrollView>
                        {methods.map((item, index) => (
                            <TouchableOpacity style={[styles.otherCards, paymentType === item.id && styles.selectedField]} key={index} onPress={item.type === 'card' ? ChooseCreditCard : onAddCard}>
                                {item.type === 'card' &&
                                    <FontAwesome name='cc-visa' size={20} color='#fff' style={styles.visaIcon} />
                                }
                                {item.type === 'coin' &&
                                    <FontAwesome5 name='coins' size={20} color='#fff' style={styles.visaIcon} />
                                }
                                {item.type === 'add' &&
                                    <Ionicons name='add-circle' size={20} color='#fff' style={styles.visaIcon} />
                                }
                                <Text key={index} style={[styles.animatedText]}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {/* <ScrollView>
                        {methods.map((item, index) => (
                            <TouchableOpacity style={styles.otherCards} onPress={() => onCardButton(item.id, item.cardNumberFirstDigits, item.cardNumber)}>
                                <FontAwesome name='cc-visa' size={20} color='#fff' style={styles.visaIcon} />
                                <Text key={index} style={styles.animatedText}>
                                    Card Ending With   **** {item.cardNumberFirstDigits}<Text style={styles.boldNumbers}>{item.cardNumber}</Text>
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView> */}
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
            {showWebView && (
                <View style={styles.webViewContainer}>
                    <WebView
                        source={{ uri: paymentUrl }}
                        onNavigationStateChange={handleNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        onShouldStartLoadWithRequest={(request) => {
                            return true;
                        }}
                    />
                </View>
            )}
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
        height: 20,
        marginBottom: 20,
        // paddingHorizontal: 20,

    },
    webViewContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1c1c1c', // или любой другой цвет фона
    },
    selectedField: {
        backgroundColor: '#5D5D5D',
        borderRadius: 10,
        padding: 5,
        borderRadius: 10,
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
    arrow: {
        marginLeft: 'auto',
        alignSelf: 'center',
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
        paddingBottom: 2,
        paddingTop: 2,
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