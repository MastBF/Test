import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

const AlertScreen = ({ isVisible, onClose, title, message, onConfirm, onCancel, list = [], isDelete, onDelete, orderStatus }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
    
    const onChoose = (id) => {
        selectedId === id ? setSelectedId(null) : setSelectedId(id);
    };



    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
            });
            setFontsLoaded(true);
        };
        loadFonts();
    }, []);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message ? message : ''}</Text>}

                    {list.length > 0 && (
                        <ScrollView style={styles.listContainer}>
                            {list.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => onChoose(item.id)}
                                >
                                    <Text
                                        style={[
                                            styles.listItem,
                                            selectedId === item.id && styles.selectedItem,
                                        ]}
                                    >
                                        **** **** **** {item.cardNumberFirstDigits}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[styles.button]} 
                            onPress={ list ? () => onConfirm(selectedId) : onConfirm || onClose}
                            disabled={isLoading} // Отключаем кнопку во время загрузки
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText]}>
                                    OK
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        width: '85%',
        padding: 20,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        fontFamily: 'RobotoRegular',
    },
    message: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
        fontFamily: 'RobotoThin',
    },
    listContainer: {
        maxHeight: 150,
        marginBottom: 20,
    },
    listItem: {
        fontSize: 14,
        color: 'white',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    selectedItem: {
        backgroundColor: '#C3C3C3',
        color: 'black',
        borderRadius: 10,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#555',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#fff'
    }
});

export default AlertScreen;