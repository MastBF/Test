import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Panel from '../components/Panel';
import  { AntDesign } from '@expo/vector-icons';
const CoffeeMusicScreen = ({navigation}) => {
  const data = [
    { id: '1', name: 'Nescafe', price: '700 ', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '2', name: 'Nescafe', price: '700 ', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '3', name: 'Nescafe', price: '700 ', description: 'Instant coffee, rich, smooth flavor.' },
    { id: '4', name: 'Nescafe', price: '700 ', description: 'Instant coffee, rich, smooth flavor.' },
  ];

  const renderItem = (item) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('ItemScreen')
    }}>
    <View key={item.id} style={styles.itemContainer}>
      <Image source={require('../assets/images/ProductImg/cup.png')} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.PriveName}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.buttonPlusMinus}>
      <TouchableOpacity style={styles.buttons}>
          <AntDesign name="pluscircle" size={15} color="white" />
      </TouchableOpacity>
      <Text style={styles.count}>0x</Text>
      <TouchableOpacity style={styles.buttons}>
          <AntDesign name="minuscircle" size={15} color="white" />
      </TouchableOpacity>
      </View>
      </View>

    </View>
    </TouchableOpacity>

  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/ProductImg/background.png')} style={styles.headerImage} />
      </View>
      <ScrollView style={styles.prodList} contentContainerStyle={styles.list}>
        <Text style={styles.title}>Coffee Music</Text>
        {data.map(renderItem)}
      </ScrollView>
      <TouchableOpacity style={styles.footer}>
        <Text style={styles.footerText}>1 For 700 AMD</Text>
      </TouchableOpacity>
      <Panel />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    backgroundColor: '#1C1C1C',
  },
  header: {
    alignItems: 'center',
    margin: 20,
  },
  headerImage: {
    marginTop: -30,
  },
  PriveName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
  prodList: {
    backgroundColor: '#1C1C1C',
    borderTopRightRadius: 50,
    marginTop: -200,
    height: '100%',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    // paddingBottom: 10,
    borderRadius: 15,
    width: '100%',
    
  },
  buttonPlusMinus: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 50,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    marginHorizontal: 7,
  },
  image: {
    width: 120,
    height: 120,
    margin: 25,
    marginRight: 0,
    marginLeft: 0,
  },
  info: {
    flex: 1,
    width: '100%',
    // paddingRight: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    width: '60%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },
  buttons: {
   

  },

  buttonText: {
    color: '#000',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    paddingTop: 10,
    alignItems: 'center',
    borderRadius: 40,
    width: '90%',
    position: 'absolute',
    zIndex: 1,
    bottom: 100,
    alignSelf: 'center',
    height: 50,
  },
  footerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf : 'center',
  },
});

export default CoffeeMusicScreen;
