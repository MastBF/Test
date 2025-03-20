import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const ErrorAlert = ({ visible, onCancel, onRetry, errorMessage, responseStatus = true, description, title}) => {
    const isError = responseStatus === false;
    const isProcessing = responseStatus === 'processing';
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
            accessibilityLabel="Error Modal"
        >
            <View style={styles.overlay} accessibilityLabel="Background Overlay">
                <View style={styles.shadowContainer}>
                    <View style={styles.popup} accessible accessibilityRole="alert">
                        <Text style={styles.title} accessibilityRole="header">
                            {title ? title : 'An Error Occurred'}
                        </Text>
                        {isError ? (
                            <Text style={styles.message} accessibilityLabel="Error Message">
                                {errorMessage || 'Something went wrong. Please try again.'}
                            </Text>
                        ) : (
                            <Text style={styles.message} accessibilityLabel="Processing Message">
                               {errorMessage || 'Something went wrong. Please try again.'}
                            </Text>
                        )}
                        <View style={styles.buttonContainer} accessibilityRole="toolbar">
                            {isError ? (
                                <>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={onCancel}
                                        accessible
                                        accessibilityLabel="Cancel"
                                        accessibilityHint="Closes the popup"
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.retryButton, isProcessing && styles.disabledButton]}
                                        onPress={onRetry}
                                        disabled={isProcessing}
                                        accessible
                                        accessibilityLabel="Retry"
                                        accessibilityHint="Retries the operation"
                                        accessibilityRole="button"
                                    >
                                        {isProcessing ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.retryText}>Retry</Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={styles.okButton}
                                    onPress={onCancel}
                                    accessible
                                    accessibilityLabel="OK"
                                    accessibilityHint="Closes the popup"
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.okText}>OK</Text>
                                </TouchableOpacity>
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
    retryButton: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 8,
        borderRadius: 10,
        backgroundColor: '#E74C3C',
    },
    retryText: {
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
    disabledButton: {
        opacity: 0.5,
    },
});

export default ErrorAlert;
