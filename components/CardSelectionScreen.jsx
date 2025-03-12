import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const CardSelectionScreen = ({ route, navigation }) => {
    const { token, totalPrice } = route.params;

    const [cards, setCards] = useState([]);

    const handleCardSelect = (card) => {
        navigation.navigate('PaymentProcessingScreen', { selectedCard: card, totalPrice, token });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Card</Text>
            <FlatList
                data={cards}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardItem} onPress={() => handleCardSelect(item)}>
                        <Text style={styles.cardText}>{item.type} {item.number}</Text>
                        <Icon name="credit-card" type="font-awesome" color="#000" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    cardItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
    cardText: { fontSize: 16 },
});

export default CardSelectionScreen;
