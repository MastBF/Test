import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const OrderDeletePopup = ({ visible, onCancel, onConfirm, paymentType, responseStatus }) => {
    const isSuccess = responseStatus === true;
    const isDeleting = responseStatus === 'deleting'; // Состояние, когда удаление в процессе

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
            accessibilityLabel="Order Deletion Modal"
        >
            <View style={styles.overlay} accessibilityLabel="Background Overlay">
                <View style={styles.shadowContainer}>
                    <View style={styles.popup} accessible accessibilityRole="alert">
                        <Text style={styles.title} accessibilityRole="header">
                            {isSuccess ? 'Order Deleted Successfully' : 'Delete Order'}
                        </Text>
                        {isSuccess ? (
                            <Text style={styles.message} accessibilityLabel="Deletion Success Message">
                                The order has been successfully deleted.
                            </Text>
                        ) : (
                            <>
                                <Text style={styles.message} accessibilityLabel="Deletion Confirmation Message">
                                    Are you sure you want to delete this order?
                                </Text>
                                {paymentType === 2 && (
                                    <Text style={[styles.message, styles.importantMessage]} accessibilityLabel="Deletion Confirmation Message">
                                        Since this is your first time paying with this card, the refund will be in 3 days.
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
                                        style={[styles.cancelButton, isDeleting && styles.disabledButton]}
                                        onPress={onCancel}
                                        disabled={isDeleting}
                                        accessible
                                        accessibilityLabel="Cancel Order Deletion"
                                        accessibilityHint="Closes the popup without deleting"
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmButton, isDeleting && styles.disabledButton]}
                                        onPress={onConfirm}
                                        disabled={isDeleting}
                                        accessible
                                        accessibilityLabel="Confirm Order Deletion"
                                        accessibilityHint="Permanently deletes the order"
                                        accessibilityRole="button"
                                    >
                                        {isDeleting ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.confirmText}>Delete</Text>
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
        shadowColor: '#E74C3C',
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
        borderColor: '#E74C3C',
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
        backgroundColor: '#E74C3C',
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
        backgroundColor: '#E74C3C',
    },
    okText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    importantMessage: {
        color: '#FF5C5C',
        fontWeight: '600',
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.5,
    }
});

export default OrderDeletePopup;