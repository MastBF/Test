import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Font from 'expo-font';

const { width } = Dimensions.get('window');

const OrderStatusPanel = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                LatoLight: require('../assets/fonts/Lato-Light.ttf'),
                InterThin: require('../assets/fonts/Inter-Thin.ttf'),
                InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
                InterBold: require('../assets/fonts/Inter-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>Your order <Text style={styles.boldPart}>was sent</Text> to the store</Text>
            <View style={styles.statusBarContainer}>
                <View>
                    <View style={styles.firstBar}></View>
                    <Text style={[styles.label, styles.activeLabel]}>Accepting</Text>
                </View>
                <View>
                    <View style={styles.secondBar}></View>
                    <Text style={styles.label}>Preparing Your Drink</Text>
                </View>
                <View>
                    <View style={styles.thirdBar}></View>
                    <Text style={styles.label}>Waiting For You</Text>
                </View>
            </View>
            <View style={styles.labelsContainer}>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        padding: 16,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '90%',
    },
    statusText: {
        color: '#fff',
        marginBottom: 8,
        marginBottom: 30,
        fontSize: 16,
        fontFamily: 'RobotoLight',
    },
    statusBarContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 25,
        justifyContent: 'space-between',
    },
    boldPart: {
        fontFamily: 'RobotoBold',
    },
    firstBar: {
        height: 6,
        borderRadius: 2,
        width: width * 0.26,
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    secondBar: {
        height: 6,
        borderRadius: 2,
        width: width * 0.3,
        backgroundColor: '#5E5D5D',
        marginBottom: 5,
    },
    thirdBar: {
        height: 6,
        borderRadius: 2,
        width: width * 0.26,
        backgroundColor: '#5E5D5D',
        marginBottom: 5,
    },
    statusBar: {
        height: 4,
        borderRadius: 2,
    },
    accepting: {
        width: width * 0.25,
        fontFamily: 'RobotoBold',
    },
    preparing: {
        width: width * 0.25,
        fontFamily: 'RobotoBold',
    },
    waiting: {
        width: width * 0.25,
        fontFamily: 'RobotoBold',
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    label: {
        color: '#888888',
        fontSize: 11,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    activeLabel: {
        color: '#ffffff',
    },
});

export default OrderStatusPanel;
