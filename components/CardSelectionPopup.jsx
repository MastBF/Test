import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardSelectionPopup = ({ visible, onCancel, cards, onSelectCard, isProcessing, selectedCardId }) => {
    const getCardIcon = (cardType) => {
        switch (cardType) {
            case 'Visa':
                return 'cc-visa';
            case 'Mastercard':
                return 'cc-mastercard';
            case 'American Express':
                return 'cc-amex';
            default:
                return 'credit-card';
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
            accessibilityLabel="Card Selection Modal"
        >
            <View style={styles.overlay} accessibilityLabel="Background Overlay">
                <View style={styles.shadowContainer}>
                    <View style={styles.popup} accessible accessibilityRole="alert">
                        <Text style={styles.title} accessibilityRole="header">
                            Select Payment Card
                        </Text>
                        
                        <FlatList
                            data={cards}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.cardItem,
                                        selectedCardId === item.id && styles.selectedCard
                                    ]}
                                    onPress={() => onSelectCard(item.id)}
                                    disabled={isProcessing}
                                    accessible
                                    accessibilityLabel={`Select ${item.cardType} ending in ${item.last4}`}
                                    accessibilityRole="button"
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardInfo}>
                                        <Icon
                                            name={getCardIcon(item.cardType)}
                                            size={28}
                                            color="#FFFFFF"
                                            style={styles.cardIcon}
                                        />
                                        <Text style={styles.cardText}>
                                            {`Visa •••• ${item.cardNumberFirstDigits}`}
                                        </Text>
                                    </View>
                                    {isProcessing && selectedCardId === item.id ? (
                                        <ActivityIndicator color="#FFFFFF" style={styles.spinner} />
                                    ) : (
                                        <View style={styles.radioCircle}>
                                            {selectedCardId === item.id && <View style={styles.radioDot} />}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                            style={styles.cardList}
                        />

                        <View style={styles.buttonContainer} accessibilityRole="toolbar">
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onCancel}
                                accessible
                                accessibilityLabel="Cancel"
                                accessibilityHint="Closes the popup without selecting a card"
                                accessibilityRole="button"
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    shadowContainer: {
        borderRadius: 16,
        backgroundColor: 'transparent',
        shadowColor: '#3498DB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 20,
    },
    popup: {
        width: 340,
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#1C1C1C',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3498DB',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    cardList: {
        maxHeight: 220,
        width: '100%',
        marginBottom: 16,
    },
    cardItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#2C2C2C',
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedCard: {
        backgroundColor: '#3498DB',
        transform: [{ scale: 1.02 }],
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        marginRight: 12,
    },
    cardText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    spinner: {
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#4A4A4A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default CardSelectionPopup;
