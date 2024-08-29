import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import ErrorMessage from '../components/ErrorMessage';
import { AntDesign } from '@expo/vector-icons';
import HOC from '../components/HOC';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const CoffeeMusicScreen = ({ navigation }) => {
    const [data, setData] = useState([
        { id: '1', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
        { id: '2', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
        { id: '3', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
        { id: '4', name: 'Nescafe', price: '700', description: 'Instant coffee, rich, smooth flavor.' },
    ]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [counts, setCounts] = useState({}); // Состояние для хранения счётчиков для каждого продукта

    const onPlus = (id) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [id]: (prevCounts[id] || 0) + 1
        }));
    };

    const onMinus = (id) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [id]: Math.max((prevCounts[id] || 0) - 1, 0)
        }));
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                LatoBold: require('../assets/fonts/Lato-Bold.ttf'),
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

    const renderItem = (item) => (
        <TouchableOpacity
            key={item.id}
            onPress={() => {
                navigation.navigate('ItemScreen');
            }}
        >
            <View style={styles.itemContainer}>
                <Image source={require('../assets/images/ProductImg/cup.png')} style={styles.image} />
                <View style={styles.info}>
                    <View style={styles.PriveName}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.buttonPlusMinus}>
                        {counts[item.id] > 0 && (
                            <TouchableOpacity style={styles.buttonWrapper} onPress={() => onMinus(item.id)}>
                                <AntDesign name="minuscircle" size={16} color="white" />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.count}>{counts[item.id] > 0 ? `${counts[item.id]}x` : ''}</Text>
                        <TouchableOpacity style={styles.buttonWrapper} onPress={() => onPlus(item.id)}>
                            <AntDesign name="pluscircle" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {errorMsg && <ErrorMessage errorMsg={errorMsg} />}
            <View style={styles.header}>
                <Image source={require('../assets/images/ProductImg/background.png')} style={styles.headerImage} />
            </View>
            <ScrollView style={styles.prodList} contentContainerStyle={styles.list}>
                <Text style={styles.title}>Coffee Music</Text>
                {data.map(renderItem)}
            </ScrollView>
            <TouchableOpacity style={styles.footer}>
                <View style={styles.footerBlock}>
                    <Text style={styles.footerTextNone}>A</Text>
                    <Text style={styles.footerText}>Order</Text>
                    <Text style={styles.footerTextSecond}>700</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
    },
    header: {
        alignItems: 'center',
        margin: width * 0.05,
    },
    headerImage: {
        marginTop: -height * 0.05,
    },
    PriveName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.01,
        width: '100%',
    },
    title: {
        color: '#fff',
        fontSize: width * 0.08,
        marginTop: height * 0.01,
        fontFamily: 'RobotoBold',
    },
    list: {
        paddingHorizontal: width * 0.05,
    },
    prodList: {
        backgroundColor: '#1C1C1C',
        borderTopRightRadius: width * 0.12,
        marginTop: -height * 0.25,
        height: '100%',
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        borderRadius: width * 0.04,
        width: '100%',
        marginBottom: height * 0.02,
        paddingVertical: height * 0.01,
        paddingRight: width * 0.06,
    },
    buttonPlusMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: height * 0.05,
    },
    buttonWrapper: {
        padding: width * 0.02,
    },
    count: {
        color: '#fff',
        fontSize: width * 0.03,
        marginHorizontal: width * 0.01,
        fontFamily: 'RobotoLight',
    },
    image: {
        width: width * 0.3,
        height: width * 0.3,
        margin: width * 0.06,
        marginRight: 0,
        marginLeft: 0,
    },
    info: {
        flex: 1,
        width: '100%',
    },
    name: {
        color: '#fff',
        fontSize: width * 0.045,
        fontFamily: 'RobotoBold',
    },
    description: {
        color: '#aaa',
        fontSize: width * 0.035,
        width: '60%',
        fontFamily: 'RobotoLight',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        color: '#fff',
        fontSize: width * 0.05,
        marginRight: width * 0.01,
        fontFamily: 'RobotoLight',
    },
    footer: {
        backgroundColor: '#fff',
        // paddingTop: height * 0.011,
        alignItems: 'center',
        borderRadius: width * 0.1,
        width: '90%',
        position: 'absolute',
        bottom: height * 0.02,
        alignSelf: 'center',
        height: height * 0.06,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    footerText: {
        color: '#000',
        fontSize: width * 0.05,
        fontWeight: 'thin',
    },
    footerTextSecond: {
        color: '#615F5F',
        fontSize: width * 0.05,
        fontWeight: '300',
    },
    footerTextNone: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: 'thin',
        marginRight: width * 0.03,
    },

});

export default HOC(CoffeeMusicScreen);