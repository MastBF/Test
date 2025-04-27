import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { api } from '@/utils/requests';
import { AuthContext } from '@/context/AuthProvider';
import { Icon } from 'react-native-elements';

const ProfileScreen = ({ navigation }) => {
  const [card, setCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(null);
  const { token } = useContext(AuthContext);
  // const cards = [
  //   { cardNumberFirstDigits: '1234' },
  //   { cardNumberFirstDigits: '5678' },
  //   { cardNumberFirstDigits: '9012' },
  //   { cardNumberFirstDigits: '3456' },
  // ];

  const animation = useRef(new Animated.Value(0)).current;

  const getState = async () => {
    try {
      const response = await api.get('/api/v1/Authentication/state');
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

  const getCard = async () => {
    try {
      const response = await api.get('/api/v1/Order/card');
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="left" type="antdesign" color="#fff" size={20} />
      </TouchableOpacity>
      <View style={styles.profileSection}>
        <FontAwesome name="user-circle" size={90} color="#FFFFFF" />
        <Text style={styles.username}>{state?.username}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Your Points</Text>
        <View style={styles.row}>
          <MaterialIcons name="stars" size={28} color="#F7A300" />
          <Text style={styles.blockValue}>{state?.balance} pts</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Saved Cards</Text>

        {card && card.length > 0 ? (
          <TouchableOpacity style={styles.card} onPress={toggleCard}>
            <MaterialIcons name="payment" size={24} color="#FFFFFF" />
            <Text style={styles.cardText}>
              Card ending with {card[0].cardNumberFirstDigits}
            </Text>
            {card.length > 1 && (
              <AntDesign
                name={isOpen ? 'up' : 'down'}
                size={16}
                color="#888"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <Text style={styles.noCards}>No cards saved</Text>
        )}
        {card && card.length > 1 &&
          <Animated.View style={[styles.cardList, { height: animation }]}>
            {isOpen &&
              card?.slice(1).map((item, index) => (
                <Text key={index} style={styles.cardItem}>
                  Card ending with {item.cardNumberFirstDigits}
                </Text>
              ))}
          </Animated.View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
  },
  block: {
    marginBottom: 30,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F7A300',

    shadowColor: '#F7A300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  blockTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockValue: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    marginTop: 10,
  },
  cardText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  cardList: {
    overflow: 'hidden',
    marginTop: 10,
  },
  cardItem: {
    color: '#CCCCCC',
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  noCards: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 10,
  },
});

export default ProfileScreen;