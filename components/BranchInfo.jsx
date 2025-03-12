import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
// import { Animated } from 'react-native';


export default function BranchInfo({ navigation, image, address, id, logo, companyName, imageHeader, onBack }) {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
            });
            setFontsLoaded(true);
            Animated.timing(fadeAnim, {
                toValue: 1, // Конечное значение прозрачности
                duration: 500, // Длительность анимации в миллисекундах
                useNativeDriver: true,
            }).start();
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
        <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <View style={styles.logoBlock}>
                <View style={styles.compInfo}>
                    <View style={styles.blackBackground}>
                        <Image source={{ uri: logo }} style={styles.logo} />
                    </View>
                    <Text style={styles.branchTitle}>{companyName}</Text>
                </View>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                <Image style={styles.branchImage} source={{ uri: image }} />
                {console.log('dsadasdsad',id, companyName)}
                <TouchableOpacity onPress={() => { navigation.navigate('ProductScreen', { id: id, name: companyName }) }}
                >

                    <View style={styles.branchBlock}>
                        <View style={styles.block}>
                            <Text style={styles.streetName}>{address}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </Animated.View>
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
        paddingBottom: 50,
    },
    scrollViewContent: {
        paddingBottom: 20,
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
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 50,
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
    branchImage: {
        resizeMode: 'contain',
        width: '95%',
        alignSelf: 'center',
        height: 200,
        borderRadius: 30,
    },
    companyImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
        resizeMode: 'contain',
    },
    compInfo: {
        flexDirection: 'row',

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
        alignSelf: 'center',
        // textAlign: 'flex-end'
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
