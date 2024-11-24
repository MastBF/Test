import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import logo from '../assets/images/trueLogo.png';
import image1 from '../assets/images/MainImg/image1.png';
import image2 from '../assets/images/MainImg/image2.png';
import image3 from '../assets/images/MainImg/image3.png';
import IceLavaLogo from '../assets/images/iceLavaLogo.png';
import CoffeeMusicLogo from '../assets/images/CoffeeMusicLogo.jpg';
import CoffeeInLogo from '../assets/images/CoffeeInLogo.png';
import JazzveLogo from '../assets/images/JazzveLogo.jpg';
import TheGreenBean from '../assets/images/TheGreenBean.png';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/requests';

export default function ListOfBranches({ navigation, company, shops, onPressCompany, companyBranches, showBranches, companyImage, onBranchPress }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [token, setToken] = useState(null);
    // const [shops, setShops] = useState([]);
    const [location, setLocation] = useState(null);


    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.error("Token not found in AsyncStorage");
                }
            } catch (error) {
                console.error("Error getting token from AsyncStorage:", error);
            }
        };

        getToken();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error) {
                console.error("Error getting location:", error);
            }
        })();
    }, []);



    useEffect(() => {
        if (token && location) {
            // fetchShops();
            // setActiveShops(true);
        }
    }, [token, location]);

    const companies = [
        { logo: IceLavaLogo, name: 'Ice Lava', branches: 35 },
        { logo: CoffeeMusicLogo, name: 'Coffee Music', branches: 21 },
        { logo: CoffeeInLogo, name: 'Coffee Inn', branches: 40 },
        { logo: JazzveLogo, name: 'Jazzve', branches: 15 },
        { logo: TheGreenBean, name: 'The Green Bean', branches: 2 },
    ];

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
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
        <View style={styles.container}>
            <View style={styles.logoBlock}>
                <View style={companyImage ? styles.withoutBlack : styles.blackBackground}>
                    {/* <Image source={logo} style={styles.logo} /> */}
                    <Image source={companyImage ? { uri: companyImage } : logo} style={styles.logo2} />
                </View>
                <Text style={styles.branchTitle}>Take&Gofree</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                {showBranches ? companyBranches.map((companies) => (
                    // <TouchableOpacity key={companies.id} onPress={() => { navigation.navigate('ProductScreen', { id: companies.id, imageHeader: companies.uiImagePath }) }}
                    <TouchableOpacity key={companies.id} onPress={() => onBranchPress(companies.id, companies.imageUrl, companies.address, companies.companyName, companies.companyLogoFileName)}
                    >
                        <View style={styles.branchBlock}>
                            {/* <Image source={{ uri: companies.logoImagePath }} style={styles.companyImage} /> */}
                            <Feather name='map-pin' size={25} style={styles.companyIcon} />

                            <View style={styles.block}>
                                <Text style={styles.streetName}>{companies.address}</Text>
                                {/* <Text style={[styles.streetName, styles.thinStyle]}>{companies.branches} Branches</Text> */}
                                <Text style={[styles.streetName, styles.thinStyle]}>{companies.nearest}m</Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                )) : shops.map((companies) => (
                    // <TouchableOpacity key={companies.id} onPress={() => { navigation.navigate('ProductScreen', { id: companies.id, imageHeader: companies.uiImagePath }) }}
                    <TouchableOpacity key={companies.id} onPress={() => onPressCompany(companies.id)}
                    >
                        <View style={styles.branchBlock}>
                            <Image source={{ uri: companies.logoImagePath }} style={styles.companyImage} />
                            <View style={styles.block}>
                                <Text style={styles.streetName}>{companies.name}</Text>
                                {/* <Text style={[styles.streetName, styles.thinStyle]}>{companies.branches} Branches</Text> */}
                                <Text style={[styles.streetName, styles.thinStyle]}>{companies.nearest}m</Text>

                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    logoBlock: {
        flexDirection: 'row',
        marginBottom: 10,
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
        paddingBottom: 20,
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
