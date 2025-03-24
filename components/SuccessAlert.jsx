import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const SuccessAlert = ({ visible, onCancel, onConfirm, paymentType, responseStatus = true, text, title}) => {
    const isSuccess = responseStatus === true;
    const isProcessing = responseStatus === 'processing';

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
            accessibilityLabel="Success Modal"
        >
            <View style={styles.overlay} accessibilityLabel="Background Overlay">
                <View style={styles.shadowContainer}>
                    <View style={styles.popup} accessible accessibilityRole="alert">
                        <Text style={styles.title} accessibilityRole="header">
                            {isSuccess ? title || 'Order Created Successfully' : 'Confirm Order'}
                            
                        </Text>
                        {isSuccess ? (
                            <Text style={styles.message} accessibilityLabel="Success Message">
                               {text || 'Your order has been created successfully!'}
                            </Text>
                        ) : (
                            <>
                                <Text style={styles.message} accessibilityLabel="Confirmation Message">
                                    Are you sure you want to place this order?
                                </Text>
                                {paymentType === 2 && (
                                    <Text style={[styles.message, styles.importantMessage]} accessibilityLabel="Payment Info">
                                        Since this is your first payment with this card, processing may take up to 3 days.
                                    </Text>
                                )}
                            </>
                        )}
                        <View style={styles.buttonContainer} accessibilityRole="toolbar">
                            {isSuccess ? (
                                <TouchableOpacity
                                    style={styles.okButton}
                                    onPress={onCancel}
                                    accessible
                                    accessibilityLabel="OK Button"
                                    accessibilityHint="Closes the popup"
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.okText}>OK</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, isProcessing && styles.disabledButton]}
                                        onPress={onCancel}
                                        disabled={isProcessing}
                                        accessible
                                        accessibilityLabel="Cancel Order"
                                        accessibilityHint="Closes the popup without placing the order"
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmButton, isProcessing && styles.disabledButton]}
                                        onPress={onConfirm}
                                        disabled={isProcessing}
                                        accessible
                                        accessibilityLabel="Confirm Order"
                                        accessibilityHint="Confirms and places the order"
                                        accessibilityRole="button"
                                    >
                                        {isProcessing ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.confirmText}>Confirm</Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            )}
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
        shadowColor: '#2ECC71',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 20,
    },
    popup: {
        width: 320,
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#1C1C1C',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2ECC71',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#E0E0E0',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 8,
        borderRadius: 10,
        backgroundColor: '#4A4A4A',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
        borderRadius: 10,
        backgroundColor: '#2ECC71',
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    okButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#2ECC71',
    },
    okText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    importantMessage: {
        color: '#27AE60',
        fontWeight: '600',
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.5,
    }
});

export default SuccessAlert;
