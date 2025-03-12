import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Touchable, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';

const { width } = Dimensions.get('window');

const OrderStatusPanel = ({ step, onPress}) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const scaleAnim = useState(new Animated.Value(1))[0];
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

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    }, [step]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.statusText}>Your order <Text style={styles.boldPart}>was sent</Text> to the store</Text>
            <View style={styles.statusBarContainer}>
                <View>
                    <Animated.View style={[styles.bar, step >= 1 && styles.activeBar, { transform: [{ scale: step === 1 ? scaleAnim : 1 }] }]}></Animated.View>
                    <Text style={[styles.label, step >= 1 && styles.activeLabel]}>Accepting</Text>
                </View>
                <View>
                    <Animated.View style={[styles.bar, step >= 2 && styles.activeBar, { transform: [{ scale: step === 2 ? scaleAnim : 1 }] }]}></Animated.View>
                    <Text style={[styles.label, step >= 2 && styles.activeLabel]}>Preparing Your Drink</Text>
                </View>
                <View>
                    <Animated.View style={[styles.bar, step >= 3 && styles.activeBar, { transform: [{ scale: step === 3 ? scaleAnim : 1 }] }]}></Animated.View>
                    <Text style={[styles.label, step >= 3 && styles.activeLabel]}>Waiting For You</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        width: '95%',
        marginBottom:20
    },
    statusText: {
        color: '#fff',
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
    bar: {
        height: 6,
        borderRadius: 2,
        width: width * 0.26,
        backgroundColor: '#5E5D5D',
        marginBottom: 5,
    },
    activeBar: {
        backgroundColor: '#fff',
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
