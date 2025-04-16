import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { api } from '@/utils/requests'; // Import API instance
import ActiveOrderDetailsModal from './ActiveOrderDetailsModal'; // Import the new modal
import ErrorAlert from './ErrorAlert'; // Import ErrorAlert for feedback

const { width } = Dimensions.get('window');

// Remove onPress from props as it's now handled internally
const OrderStatusPanel = ({ step }) => {
    // State for modal and data
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [activeOrderData, setActiveOrderData] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isDeletingOrder, setIsDeletingOrder] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const scaleAnim = useState(new Animated.Value(1))[0];
    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
                RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
                RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
                LatoLight: require('../assets/fonts/Lato-Light.ttf'),
                InterThin: require('../assets/fonts/Inter-Thin.ttf'),
                InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
                InterBold: require('../assets/fonts/Inter-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    }, [step]);

    // Function to fetch order details and show modal
    const fetchAndShowOrderDetails = async () => {
        if (isLoadingDetails) return; // Prevent multiple fetches
        setIsLoadingDetails(true);
        setFetchError(null); // Clear previous errors
        try {
            console.log('Fetching active order details...');
            const response = await api.get('/api/v1/order/active-order-user');
            console.log('API Response:', response.data);
            if (response.data) {
                // --- DEBUG: Log the structure of received data, especially items ---
                console.log('Fetched Data Structure:', JSON.stringify(response.data, null, 2));
                console.log('Fetched Items Array:', JSON.stringify(response.data.items, null, 2));
                console.log('Is Fetched Items an Array:', Array.isArray(response.data.items));
                console.log('Number of Fetched Items:', response.data.items?.length ?? 'undefined');
                // --- END DEBUG ---
                setActiveOrderData(response.data);
                setIsDetailsModalVisible(true);
            } else {
                // Handle case where there's no active order? Maybe show a different message.
                setFetchError('No active order found.');
            }
        } catch (error) {
            console.error('Error fetching active order details:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order details.';
            setFetchError(errorMessage);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Function to handle order deletion
    const handleDeleteOrder = async () => {
        if (isDeletingOrder || !activeOrderData) return;
        setIsDeletingOrder(true);
        setFetchError(null); // Clear previous errors
        try {
            console.log(`Attempting to delete order ID: ${activeOrderData.OrderId}`);
            // Assuming the endpoint requires the order ID or is context-aware via token
            await api.delete('/api/v1/Order/cancel-order-user'); // Confirm endpoint if needed
            console.log('Order deleted successfully.');
            setIsDetailsModalVisible(false); // Close modal on success
            setActiveOrderData(null); // Clear data
            // Optionally: Show a SuccessAlert or trigger a refresh of parent component state
        } catch (error) {
            console.error('Error deleting order:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete order.';
            setFetchError(errorMessage); // Show error in an alert
            // Keep the modal open on delete error? Or close it? Closing for now.
            // setIsDetailsModalVisible(false);
        } finally {
            setIsDeletingOrder(false);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.container, isLoadingDetails && styles.loadingOverlay]} // Add loading style
                onPress={fetchAndShowOrderDetails}
                disabled={isLoadingDetails} // Disable button while loading
            >
                {isLoadingDetails && (
                    <ActivityIndicator size="small" color="#F7A300" style={styles.activityIndicator} />
                )}
                <Text style={styles.statusText}>Your order <Text style={styles.boldPart}>status</Text></Text>
                <View style={styles.statusBarContainer}>
                    <View style={styles.stepContainer}>
                        <Animated.View style={[styles.bar, step >= 1 && styles.activeBar, { transform: [{ scale: step === 1 ? scaleAnim : 1 }] }]}></Animated.View>
                        <Text style={[styles.label, step >= 1 && styles.activeLabel]}>Accepting</Text>
                    </View>
                    <View style={styles.stepContainer}>
                        <Animated.View style={[styles.bar, step >= 2 && styles.activeBar, { transform: [{ scale: step === 2 ? scaleAnim : 1 }] }]}></Animated.View>
                        <Text style={[styles.label, step >= 2 && styles.activeLabel]}>Preparing</Text>
                    </View>
                    <View style={styles.stepContainer}>
                        <Animated.View style={[styles.bar, step >= 3 && styles.activeBar, { transform: [{ scale: step === 3 ? scaleAnim : 1 }] }]}></Animated.View>
                        <Text style={[styles.label, step >= 3 && styles.activeLabel]}>Ready</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Render the Details Modal */}
            <ActiveOrderDetailsModal
                visible={isDetailsModalVisible}
                orderDetails={activeOrderData}
                onClose={() => setIsDetailsModalVisible(false)}
                onDelete={handleDeleteOrder}
                isDeleting={isDeletingOrder}
            />

            {/* Render Error Alert */}
            <ErrorAlert
                visible={!!fetchError}
                errorMessage={fetchError || 'An error occurred.'}
                onCancel={() => setFetchError(null)} // Allow dismissing the error
                // Optional: Add onRetry if applicable
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        width: '95%', // Keep original width
        marginBottom:20,
        borderWidth: 1,
        borderColor:'#F7A300',
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 7
    },
    statusText: {
        color: '#fff',
        marginBottom: 30,
        fontSize: 16,
        fontFamily: 'RobotoLight',
    },
    statusBarContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 15, // Reduced bottom margin
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items to the top of the container
    },
    stepContainer: { // Added container for each step (bar + label)
        alignItems: 'center', // Center label under the bar
        flex: 1, // Allow steps to take equal space
        marginHorizontal: 2, // Add small horizontal space between steps
    },
    boldPart: {
        fontFamily: 'RobotoBold',
    },
    bar: {
        height: 6,
        borderRadius: 2,
        // width: width * 0.26, // Let flexbox handle width distribution
        width: '100%', // Make bar fill the step container width
        backgroundColor: '#5E5D5D',
        marginBottom: 5,
    },
    activeBar: {
        backgroundColor: '#fff',
    },
    label: {
        color: '#888888',
        fontSize: 11,
        textAlign: 'center', // Keep label centered
        marginTop: 4, // Add space between bar and label
        fontWeight: 'bold',
    },
    activeLabel: {
        color: '#ffffff',
    },
});
// Added styles for loading state
styles.loadingOverlay = {
    opacity: 0.7, // Dim the panel when loading
};
styles.activityIndicator = {
    position: 'absolute', // Overlay indicator
    alignSelf: 'center',
    top: '40%', // Adjust position as needed
};

export default OrderStatusPanel;
