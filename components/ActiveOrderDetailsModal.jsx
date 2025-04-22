import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Example for close icon
import { FlatList } from 'react-native-gesture-handler';

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
  console.log('asjndjasdoahs', orderDetails)
  // Determine if the order status allows deletion (e.g., Status 0 or 1)
  const canDelete = orderDetails.status === 0 || orderDetails.status === 1;

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
            <View style={styles.itemsList}> 
              {orderDetails.items && orderDetails.items.length > 0 ? (
              <FlatList
              data={orderDetails.items}
              keyExtractor={(item, index) => index.toString()}
              style={{ maxHeight: 250 }}
              contentContainerStyle={styles.itemsContainer}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Image source={{ uri: item.productImageUrl }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemType}>{item.productType}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              )}
            />
              ) : (
                <Text style={styles.emptyText}>No items found.</Text>
              )}
            </View>

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
    // backgroundColor: '#1C1C1C',сдел

  },
  shadowContainer: { // Optional shadow effect
    borderRadius: 16,
    backgroundColor: 'transparent',
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
  itemsList: {
    alignSelf: 'stretch',
    paddingHorizontal: 15,
    // marginBottom: 20,

  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#2C2C2E',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#F7A300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F7A300',
    alignContent: 'center'
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 14,
    resizeMode: 'contain',
    backgroundColor: '#3A3A3C',
    borderWidth: 1,
    borderColor: '#1C1C1C',
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
    alignSelf: 'center'
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemType: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 1,
  },
  itemQuantity: {
    color: '#888',
    fontSize: 13,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
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