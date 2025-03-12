import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HOC from '../components/HOC';
import { AntDesign } from '@expo/vector-icons';
import { BASE_URL } from '@/utils/requests';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileScreen = ({ navigation }) => {
  const [card, setCard] = useState(null);
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

  const getState = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Authentication/state`, {
        headers: {
          'TokenString': token,
        },
      });
      setState(response.data);
    } catch (error) {
      console.error('Error getting state:', error);
    }
  };

  useEffect(() => {
    if (token) {
      getState();
    }
  }, [token]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error("Token not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error getting token from AsyncStorage:", error);
      }
    };

    getToken();
  }, []);

  const getCard = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/Order/card`,
        {
          headers: {
            'TokenString': token,
          }
        }
      );
      setCard(response.data);
    } catch (error) {
      console.error('Error getting card:', error);
    }
  };

  useEffect(() => {
    if (token) {
      getCard();
    }
  }, [token]);

  const toggleCard = () => {
    const finalHeight = isOpen ? 0 : 110;
    Animated.timing(animation, {
      toValue: finalHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileIconContainer}>
          <Icon name="person-circle-outline" size={100} color="#bbb" />
        </View>
        <Text style={styles.username}>{state?.username}</Text>
      </View>

      {/* Раздел Points */}
      <View style={styles.pointsSection}>
        <Text style={styles.sectionTitle}>Your Points</Text>
        <View style={styles.pointsContainer}>
          <Icon name="star-outline" size={30} color="#FFD700" />
          <Text style={styles.pointsText}>{state?.balance} Points</Text>
        </View>
      </View>

      {/* Раздел Saved Payment Methods */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        {card && card.length > 0 ? (
          <TouchableOpacity style={styles.paymentCard} onPress={toggleCard}>
            <Icon name="card-outline" size={25} color="#fff" />
            <Text style={styles.cardText}>Card ending with {card[0].cardNumberFirstDigits}</Text>
            {card.length > 1 && <AntDesign name={isOpen ? "up" : "down"} size={16} color="white" style={styles.iconEnd} />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.paymentCard}>
            <Icon name="card-outline" size={25} color="#fff" />
            <Text style={styles.cardText}>No active cards</Text>
          </TouchableOpacity>
        )}

        {/* Анимированный контейнер для списка карт */}
        <Animated.View style={[styles.cardListContainer, { height: animation }]}>
          {isOpen && card && card.length > 1 && (
            <ScrollView>
              {card.map((item, index) => (
                <TouchableOpacity key={index}>
                  <Text key={index} style={styles.cardItem}>
                    Card ending with {item.cardNumberFirstDigits}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileIconContainer: {
    backgroundColor: '#333',
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  username: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  pointsSection: {
    marginTop: 40,
    borderColor: '#2E2E2E',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    marginTop: 10,
  },
  pointsText: {
    color: '#FFD700',
    fontSize: 18,
    marginLeft: 10,
  },
  paymentSection: {
    marginTop: 20,
    borderColor: '#2E2E2E',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '300',
  },
  paymentCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  iconEnd: {
    marginLeft: 'auto',
  },
  cardListContainer: {
    overflow: 'hidden',
  },
  cardItem: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
    marginBottom: 5,
    borderRadius: 15,
    borderBottomWidth: 1,
    borderColor: '#2E2E2E',
  },
});

export default ProfileScreen;