import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';
import dram2 from '../assets/images/ProductImg/dram.png';
import { AntDesign } from '@expo/vector-icons';
import HOC from '../components/HOC';
// import DramSVG from '../assets/images/SVG/dram.svg'; // Убедитесь, что путь указан правильно

const { width, height } = Dimensions.get('window');

const ItemScreen = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState('Small');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Small');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
        RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        LatoBold: require('../assets/fonts/Lato-Bold.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
        RobotoThin: require('../assets/fonts/Roboto-Thin.ttf'),
      });
      setFontsLoaded(true);
      setLoading(false);
    };

    loadFonts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/ProductImg/cup.png')} style={styles.productImage} />
          {/* <DramSVG width={100} height={100} /> Убедитесь, что вы используете компонент правильно */}
          <Icon
            name="down"
            type="antdesign"
            color="#fff"
            containerStyle={styles.closeIcon}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>Nescafe</Text>
          <Text style={styles.productPrice}>700 <Image source={dram2} /></Text>
          <Text style={styles.productDescription}>Instant coffee, rich, smooth flavor.</Text>
          <Text style={styles.optionTitle}>Choose Size</Text>
          <View style={styles.optionTextContainer}>
            <Text style={styles.text}>Select 1 option</Text>
            <View style={styles.borderDiv}>
              <Text style={styles.borderText}>Necessarily</Text>
            </View>
          </View>
          <View style={styles.choosSize}>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Small'); setSize('Small'); }}>
              <Text style={styles.size}>Small</Text>
              <RadioButton.Android
                value="Small"
                status={selectedValue === 'Small' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Small'); setSize('Small'); }}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Medium'); setSize('Medium'); }}>
              <Text style={styles.size}>Medium <Text style={styles.priceAdd}>+100</Text></Text>
              <RadioButton.Android
                value="Medium"
                status={selectedValue === 'Medium' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Medium'); setSize('Medium'); }}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sizeBlock} onPress={() => { setSelectedValue('Big'); setSize('Big'); }}>
              <Text style={styles.size}>Big <Text style={styles.priceAdd}>+150</Text></Text>
              <RadioButton.Android
                value="Big"
                status={selectedValue === 'Big' ? 'checked' : 'unchecked'}
                onPress={() => { setSelectedValue('Big'); setSize('Big'); }}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity}>
              <AntDesign name="minuscircle" type="antdesign" size={24} color="#2E2E2E" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity}>
              <AntDesign name="pluscircle" type="antdesign" size={24} color="#D7D6D6" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Button
        title={`Order ${quantity} For ${(700 + (size === 'Medium' ? 100 : size === 'Big' ? 150 : 0)) * quantity}`}
        buttonStyle={styles.orderButton}
        titleStyle={styles.orderButtonText}
        onPress={() => { }}
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
    top: 40,
    left: 10,
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'LatoBold',
  },
  productPrice: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 20,
    fontFamily: 'LatoLight',
  },
  size: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  priceAdd: {
    color: '#FB9B0D',
    fontWeight: '200',
  },
  productDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    fontFamily: 'RobotoThin',
  },
  text: {
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'RobotoThin',
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoBold',
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderText: {
    color: '#fff',
    fontSize: 12,
    paddingVertical: 0,
    paddingHorizontal: 4,
    fontWeight: 'bold',
  },
  borderDiv: {
    backgroundColor: '#EC6C4F',
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 20,
  },
  choosSize: {
    marginBottom: 20,
  },
  sizeBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 15,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
});

export default HOC(ItemScreen);
