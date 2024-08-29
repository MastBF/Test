import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import axios from 'axios'; // Ensure axios is imported
import HOC from '../components/HOC';
import { BASE_URL } from '@/utils/requests';

const { width, height } = Dimensions.get('window');

const AddPaymentCardScreen = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [cvc, setCvc] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        return formatted;
    }

    const handleCardNumberChange = (text) => {
        const formattedText = handleCardNumber(text);
        setCardNumber(formattedText);
    }

    const handleExpireDate = (text) => {
        const formattedText = text.replace(/[^0-9]/g, '');
        if (formattedText.length > 3) {
            return `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}`;
        }
        return formattedText;
    }

    const handleChangeText = (text) => {
        const formattedText = handleExpireDate(text);
        setExpiryDate(formattedText);
        setMonth(formattedText.slice(0, 2));
        setYear(`20${formattedText.slice(3, 5)}`); // Adjust slicing to include two digits for year
    }

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                LatoLight: require('../assets/fonts/Lato-Light.ttf'),
                InterThin: require('../assets/fonts/Inter-Thin.ttf'),
                InterExtraLight: require('../assets/fonts/Inter-ExtraLight.ttf'),
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

    const handleAddCard = async () => {
        if (!name || !cardNumber || !expiryDate || !cvc) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Alert.alert('Month', month);
            Alert.alert('Year', year);
            const response = await axios.post(`${BASE_URL}/api/v1/Order/card`, {
                cardHolderName: name,
                pan: cardNumber.replace(/\s+/g, ''), // Remove spaces before sending
                mm: month,
                yyyy: year,
                cvc: cvc,
            });
            Alert.alert('Success', 'Card added successfully');
            setName('');
            setCardNumber('');
            setExpiryDate('');
            setCvc('');

        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add a Payment Card</Text>
            </View>
            <View style={styles.iconBlock}>
                <AntDesign name="left" size={20} color="#fff" style={styles.icon} />
            </View>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color="#fff" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Name on Card"
                        placeholderTextColor="#fff"
                        value={name}
                        onChangeText={setName}
                        maxLength={50}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="card-outline" size={24} color="#fff" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="4242 4242 4242 4242"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={handleCardNumberChange}
                        maxLength={19} // Updated length to accommodate spaces
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.rowItem]}>
                        <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="MM/YY"
                            placeholderTextColor="#fff"
                            keyboardType="numeric"
                            value={expiryDate}
                            onChangeText={handleChangeText}
                            maxLength={5}
                        />
                    </View>

                    <View style={[styles.inputContainer, styles.rowItem]}>
                        <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="CVC"
                            placeholderTextColor="#fff"
                            keyboardType="numeric"
                            value={cvc}
                            onChangeText={setCvc}
                            maxLength={3}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddCard}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text style={styles.buttonText}>Add Card</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 10,
        alignSelf: 'center',
        fontFamily: 'RobotoBold',
    },
    form: {
        justifyContent: 'center',
    },
    icon: {
        marginLeft: 10,
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2E2E2E',
        marginBottom: 25,
    },
    iconBlock: {
        position: 'absolute',
        top: 63,
        left: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingBottom: 10,
        marginLeft: 10,
        fontFamily: 'InterExtraLight',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowItem: {
        flex: 1,
        marginRight: 10,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'RobotoBold',
    },
    buttonDisabled: {
        backgroundColor: '#d3d3d3', // Grey color for disabled state
    },
});

export default HOC(AddPaymentCardScreen);
