import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import logo from '../assets/images/logo3.png';

export default function ListOfBranches() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const branches = [
        { id: 1, address: '6 Sayat-Nova Ave, Yerevan', distance: '200m' },
        { id: 2, address: '41 Isahakyan St, Yerevan 0009', distance: '800m' },
        { id: 3, address: '2, 1 Sasuntsi Davit St, Yerevan 0005', distance: '1.2km' },
        { id: 4, address: '8, 8 Tsitsernakaberd Hwy, Yerevan 0028', distance: '1.5km' },
        { id: 5, address: '20 Myasnikyan Ave, Yerevan 0025', distance: '2km' },
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
                <View style={styles.blackBackground}>
                    <Image source={logo} style={styles.logo} />
                </View>
                <Text style={styles.branchTitle}>Ice Lava</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={false}>
                {branches.map((branch) => (
                    <TouchableOpacity key={branch.id}>
                        <View style={styles.branchBlock}>
                            <Feather name='map-pin' size={24} color='#8F8F8F' style={styles.BranchIcon} />
                            <View style={styles.block}>
                                <Text style={styles.streetName}>{branch.address}</Text>
                                <Text style={[styles.streetName, styles.thinStyle]}>{branch.distance}</Text>
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
    },
    thinStyle: {
        fontFamily: 'RobotoLight',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
