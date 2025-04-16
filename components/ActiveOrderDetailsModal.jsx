import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Example for close icon

// Helper function to convert status enum to string (adjust based on actual enum values/meaning)
const getOrderStatusString = (status) => {
  switch (status) {
    case 0: return 'Pending Acceptance'; // Example
    case 1: return 'Accepted / Preparing'; // Example
    case 2: return 'Ready for Pickup'; // Example
    case 3: return 'Completed'; // Example  
    case 4: return 'Cancelled'; // Example
    default: return `Unknown (${status})`;
  }
};

const ActiveOrderDetailsModal = ({ visible, onClose, orderDetails, onDelete, isDeleting }) => {
  if (!orderDetails) return null;

  // console.log('ActiveOrderDetailsModal received orderDetails:', JSON.stringify(orderDetails, null, 2)); // DEBUG Removed
  
  // Determine if the order status allows deletion (e.g., Status 0 or 1)
  // Determine if the order status allows deletion (e.g., Status 0 or 1)
  const canDelete = orderDetails.status === 0 || orderDetails.status === 1;

  const renderItem = ({ item }) => {
    // console.log('Rendering item:', JSON.stringify(item, null, 2)); // DEBUG Removed
    return (
      // Restore Image and use optional chaining
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item?.productImageUrl || 'https://via.placeholder.com/60' }}
          style={styles.itemImage}
          resizeMode="cover"
          onError={(e) => console.log(`Error loading image for ${item?.productName}:`, e.nativeEvent.error)} // Add error logging
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item?.productName ?? 'Unknown Item'}</Text>
          <Text style={styles.itemType}>{item?.productType ?? 'N/A'}</Text>
          <Text style={styles.itemQuantity}>Quantity: {item?.quantity ?? 0}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.shadowContainer}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#aaa" />
            </TouchableOpacity>


            <View style={styles.companySection}>
              {/* Assuming CompanyLogoUrl is a full URL */}
              <Image source={{ uri: orderDetails.companyLogoUrl || 'https://via.placeholder.com/40' }} style={styles.companyLogo} />
              <Text style={styles.companyName}>{orderDetails.companyName}</Text>
            </View>

            <Text style={styles.branchAddress}>Branch: {orderDetails.branchAddress}</Text>
            <Text style={styles.status}>Status: {getOrderStatusString(orderDetails.status)}</Text>

            <Text style={styles.itemsTitle}>Items:</Text>
            <FlatList
              data={orderDetails?.items ?? []} // Ensure data is always an array
              renderItem={renderItem}
              keyExtractor={(item, index) => `${orderDetails?.orderId ?? 'order'}-${index}`} // Use optional chaining
              style={styles.itemList} // Apply flex: 1
              ListEmptyComponent={<Text style={styles.emptyListText}>No items in this order.</Text>} // Show message if empty
              nestedScrollEnabled={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.actionButton, styles.closeActionButton]} onPress={onClose}>
                <Text style={styles.actionButtonText}>Close</Text>
              </TouchableOpacity>
              {canDelete && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.actionButtonText}>Delete Order</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles (borrowing from SuccessAlert and adapting)
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    shadowContainer: { // Optional shadow effect
        borderRadius: 16,
        backgroundColor: 'transparent',
        // Shadow properties might need adjustment based on desired look
        // shadowColor: '#F7A300', // Example: Match panel border?
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 0.5,
        // shadowRadius: 8,
        // elevation: 15,
    },
    popup: {
        width: '90%', // Make it responsive
        maxWidth: 380, // Max width
        padding: 20,
        paddingTop: 40, // Extra space for close button
        borderRadius: 16,
        backgroundColor: '#1C1C1C', // Dark background
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444', // Subtle border
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1, // Ensure it's clickable
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 25, // Further increased spacing
        textAlign: 'center',
    },
    companySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        alignSelf: 'stretch', // Stretch to take width
        paddingHorizontal: 15, // More horizontal padding
        borderBottomWidth: 1, // Add separator line
        borderBottomColor: '#333',
        paddingBottom: 15, // Spacing below separator
    },
    companyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#555', // Placeholder bg
    },
    companyName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    branchAddress: {
        color: '#E0E0E0',
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'left', // Align left
        paddingHorizontal: 15, // Match padding
    },
    status: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'left', // Align left
        paddingHorizontal: 15, // Match padding
    },
    itemsTitle: { // Restore Items Title style
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        alignSelf: 'flex-start', // Keep aligned left
        paddingHorizontal: 15, // Match padding
    },
    itemList: { // Restore itemList style and add flex: 1
        width: '100%',
        marginBottom: 25,
        paddingHorizontal: 15, // Match padding
        flex: 1, // Allow FlatList to take available space
        // Remove explicit height/maxHeight for now
    },
    emptyListText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingVertical: 10,
        // alignItems: 'center', // Temporarily remove alignment
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        paddingHorizontal: 10,
        minHeight: 70, // Keep minimum height
    },
    itemImage: {
        width: 60, // Larger image
        height: 60, // Larger image
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#555',
    },
    itemDetails: {
        // Restore original item details styles + refinements
        flex: 1,
        justifyContent: 'center', // Keep centered vertically
        paddingLeft: 5, // Add slight padding if text is too close to image
    },
    // Restore original text styles
    itemName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        // --- DEBUG: Force dimensions ---
        // width: 100, height: 20, backgroundColor: 'red',
        // --- END DEBUG ---
    },
    itemType: {
        color: '#B0B0B0',
        fontSize: 14,
        marginBottom: 4,
         // --- DEBUG: Force dimensions ---
        // width: 80, height: 18, backgroundColor: 'blue',
        // --- END DEBUG ---
   },
    itemQuantity: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 2,
         // --- DEBUG: Force dimensions ---
        // width: 120, height: 18, backgroundColor: 'green',
        // --- END DEBUG ---
   },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Use space-around or space-between
        width: '100%',
        marginTop: 25, // Further increase spacing before buttons
        paddingHorizontal: 10,
    },
    actionButton: {
        flex: 1, // Allow buttons to grow
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5, // Add space between buttons
        alignItems: 'center', // Center text
        minHeight: 44, // Ensure minimum tap area
        justifyContent: 'center',
    },
    closeActionButton: {
        backgroundColor: '#4A4A4A', // Gray for close
    },
    deleteButton: {
        backgroundColor: '#E74C3C', // Red for delete
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default ActiveOrderDetailsModal;