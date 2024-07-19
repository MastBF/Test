import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Icon, Button } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const ItemScreen = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Small');

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/ProductImg/cup.png')} style={styles.productImage} />
          <Icon
            name="close"
            type="antdesign"
            color="#fff"
            containerStyle={styles.closeIcon}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>Nescafe</Text>
          <Text style={styles.productPrice}>700₮</Text>
          <Text style={styles.productDescription}>Instant coffee, rich, smooth flavor.</Text>

          <Text style={styles.optionTitle}>Choose Size</Text>
          <Text style={styles.text}>Select 1 option <Button title={'Necessarily'} containerStyle={styles.borderText} buttonStyle={styles.text}/></Text>
          <View style={styles.choosSize}>
            
          <TouchableOpacity>
            <Text style={styles.size}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.size}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.size}>Big</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity}>
              <Icon name="minus" type="antdesign" color="#fff" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity}>
              <Icon name="plus" type="antdesign" color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Button
        title={`Order ${quantity} For ${(700 + (size === 'Medium' ? 100 : size === 'Big' ? 150 : 0)) * quantity}₮`}
        buttonStyle={styles.orderButton}
        titleStyle={styles.orderButtonText}
        onPress={() => {}}
        containerStyle={styles.orderButtonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
    marginBottom: 30,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
  },
  size:{
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  borderText:{
    backgroundColor: '#FB9B0D',
  },
  productDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {

  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#FB9B0D',
  },
  priceText: {
    color: '#FB9B0D',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityText: {
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 20,
  },
  orderButton: {
    backgroundColor: '#FB9B0D',
    borderRadius: 30,
    paddingVertical: 15,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
});

export default ItemScreen;
