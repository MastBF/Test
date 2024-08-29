import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import amdWhite from '../assets/images/amdWhite.png';
import amdWhiteBold from '../assets/images/amdWhiteBold.png';
import * as Font from 'expo-font';

export default function PaymentScreen() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

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
                <AntDesign name="left" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.headerText}>Payment For The Order</Text>
            </View>
            <View style={styles.orderSection}>
                <Text style={styles.sectionTitle}>Your Order</Text>
                <Text style={styles.productDescription}>1 Product From <Text style={styles.boldText}>Coffee Music</Text></Text>
                <View>
                    <View style={styles.productRow}>
                        <Text style={styles.productQuantity}>1x</Text>
                        <Text style={styles.productName}>Nescafe</Text>
                        <Text style={styles.productPrice}>700 </Text>
                        <Image source={amdWhite} style={styles.amdIcon} />
                    </View>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.productQuantityHidden}>1x</Text>
                        <Text style={styles.text}>5%</Text>
                        <View style={styles.borderDiv}>
                            <Text style={styles.borderText}>Cashback</Text>
                        </View>
                    </View>
                    <View style={styles.countEdit}>
                        <TouchableOpacity>
                            <AntDesign name='minuscircle' size={18} color='#fff' />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AntDesign name='pluscircle' size={18} color='#fff' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Payment Method Section */}
            <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.cardInfo}>
                    <View style={styles.rowBlock}>
                        <FontAwesome name='cc-visa' size={20} color='#fff' style={styles.visaIcon} />
                        <Text style={styles.cardText}>  Card Ending With 4964</Text>
                    </View>
                    <View>
                        <AntDesign name="down" size={20} color="#fff" style={styles.iconDown} />
                    </View>
                </View>
            </View>

            {/* Summary Information Section */}
            <View style={styles.summarySection}>
                <Text style={styles.summeryTitle}>Summary Information</Text>
                <View style={[styles.summaryRow, styles.bottomMargin]} >
                    <Text style={styles.summaryText}>Products</Text>
                    <Text style={styles.summaryPrice}>700 <Image source={amdWhite} style={styles.amdIconOrder} /></Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryText, styles.boldTextOrder]}>Total</Text>
                    <Text style={[styles.summaryPrice, styles.boldTextOrder]}>700 <Image source={amdWhiteBold} style={styles.amdIconOrder} /></Text>
                </View>
            </View>

            {/* Confirm Order Button */}
            <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
        </SafeAreaView>
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
        borderTopColor: '#EC6C4F',
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
    borderText: {
        color: '#fff',
        fontSize: 12,
        paddingVertical: 0,
        paddingHorizontal: 4,
        fontWeight: 'bold',
        // fontFamily: 'RobotoRegular',
    },
    borderDiv: {
        backgroundColor: '#EC6C4F',
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
