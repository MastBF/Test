import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Feather, FontAwesome } from '@expo/vector-icons';
import logo from '../assets/images/trueLogo.png';
import IceLavaLogo from '../assets/images/iceLavaLogo.png';
import CoffeeMusicLogo from '../assets/images/CoffeeMusicLogo.jpg';
import CoffeeInLogo from '../assets/images/CoffeeInLogo.png';
import JazzveLogo from '../assets/images/JazzveLogo.jpg';
import TheGreenBean from '../assets/images/TheGreenBean.png';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

export default function ListOfBranches({ navigation, company, shops, onPressCompany, companyBranches, showBranches, companyImage, onBranchPress, companyName, onBackPress }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [token, setToken] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true); // Добавлено состояние загрузки
    const [fadeAnim] = useState(new Animated.Value(0));
    
    useEffect(() => {
        const initialize = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.error("Token not found in AsyncStorage");
                }

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                } else {
                    let location = await Location.getCurrentPositionAsync({});
                    setLocation(location);
                }

                await Font.loadAsync({
                    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                    RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
                    RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                });

                setFontsLoaded(true);
            } catch (error) {
                console.error("Initialization error:", error);
            } finally  {
                setLoading(false);
                fadeAnim.setValue(0);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }
        };

        initialize();
    }, []);
    useEffect(() => {
        fadeAnim.setValue(0); // Сбрасываем значение перед началом новой анимации
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [showBranches]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading, please wait...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
                <View style={styles.logoBlock}>
                    <View style={styles.CompInfo}>
                        <View style={showBranches ? styles.withoutBlack : styles.blackBackground}>
                            <Image source={showBranches ? { uri: companyImage } : logo} style={styles.logo2} />
                        </View>
                        <Text style={styles.branchTitle}>{showBranches ? companyName : 'Take&Go'}</Text>
                    </View>
                    {showBranches &&
                        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                            <Feather name="arrow-left" size={24} color="#000" />
                        </TouchableOpacity>
                    }
                </View>
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                    {showBranches ? companyBranches.map((companies) => (
                        <TouchableOpacity key={companies.id} onPress={() => onBranchPress(companies.id, companies.companyUiFileName, companies.address, companies.companyName, companies.companyLogoFileName)}>
                            <View style={styles.branchBlock}>
                                <FontAwesome name='map-pin' size={25} style={styles.companyIcon} />
                                <View style={styles.block}>
                                    <Text style={styles.streetName}>{companies.address}</Text>
                                    <Text style={[styles.streetName, styles.thinStyle]}>{companies.nearest}m</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )) : shops.map((companies) => (
                        <TouchableOpacity key={companies.id} onPress={() => onPressCompany(companies.id, companies.name)}>
                            <View style={styles.branchBlock}>
                                <FontAwesome name='map-pin' size={25} style={styles.companyIcon} />
                                <View style={styles.block}>
                                    <Text style={styles.streetName}>{companies.name}</Text>
                                    <Text style={[styles.streetName, styles.thinStyle]}>{companies.nearest}m</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 5,
    },
    scrollViewContent: {
        paddingBottom: 20, // Добавьте отступ снизу, чтобы прокрутка могла пройти до конца списка
    },
    branchBlock: {
        flexDirection: 'row',
        borderRadius: 20,
        marginBottom: 10,
        padding: 10,
        // paddingBottom: 20,
        alignItems: 'center',
    },
    backButton: {
        // position: 'absolute',
        // top: -30, // Отступ сверху (подстраивайте в зависимости от высоты вашего статуса-бара)
        // left: 10, // Отступ от левого края
        // zIndex: 100, // Убедитесь, что кнопка будет поверх других элементов
        backgroundColor: '#fff', // Опционально: добавьте фон, чтобы кнопка выглядела аккуратно
        padding: 8, // Опционально: немного пространства вокруг иконки
        borderRadius: 20, // Скругленные края
        shadowColor: '#000', // Тень для визуального разделения
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        width: 40,
        height: 40,
        // alignSelf: 'flex-end',
        // textAlign: 'flex-end'
    },
    CompInfo: {
        flexDirection: 'row',
    },
    logoBlock: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    blackBackground: {
        backgroundColor: '#000',
        borderRadius: 20,
    },
    companyIcon: {
        backgroundColor: '#C5C5C5',
        padding: 6,
        borderRadius: 10,
        marginRight: 10,
    },
    logo: {
        width: 70,
        height: 70,
        alignSelf: 'center',
        borderRadius: 10,
    },
    branchTitle: {
        color: '#000',
        fontFamily: 'RobotoRegular',
        alignSelf: 'center',
        fontSize: 24,
        marginLeft: 10,
        marginBottom: 10,
    },
    block: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        paddingBottom: 10,
        flex: 1,
        // paddingTop: 10,
    },
    logo2: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        // borderRadius: 10,
    },
    companyImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        resizeMode: 'contain',
    },
    BranchIcon: {
        backgroundColor: '#C5C5C5',
        padding: 6,
        borderRadius: 10,
        marginRight: 10,
    },
    streetName: {
        color: '#000',
        marginTop: 5,
        fontFamily: 'RobotoBold',
        fontSize: 16,
    },
    thinStyle: {
        fontFamily: 'RobotoLight',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
});
