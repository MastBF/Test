import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform, SafeAreaView, Dimensions } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { api } from '@/utils/requests';
import { AuthContext } from '@/context/AuthProvider';
import { Icon } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [card, setCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(null);
  const { token } = useContext(AuthContext);
  
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[
            styles.backButton, 
            { top: height * 0.05 }
          ]} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="left" type="antdesign" color="#fff" size={20} />
        </TouchableOpacity>
        
        <View style={styles.profileSection}>
          <FontAwesome name="user-circle" size={width * 0.2} color="#FFFFFF" />
          <Text style={styles.username}>{state?.username}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Your Points</Text>
            <View style={styles.row}>
              <MaterialIcons name="stars" size={width * 0.07} color="#F7A300" />
              <Text style={styles.blockValue}>{state?.balance} pts</Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Saved Cards</Text>

            {card && card.length > 0 ? (
              <TouchableOpacity style={styles.card} onPress={toggleCard}>
                <MaterialIcons name="payment" size={width * 0.06} color="#FFFFFF" />
                <Text style={styles.cardText} numberOfLines={1}>
                  Card ending with {card[0].cardNumberFirstDigits}
                </Text>
                {card.length > 1 && (
                  <AntDesign
                    name={isOpen ? 'up' : 'down'}
                    size={width * 0.04}
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
                    <Text key={index} style={styles.cardItem} numberOfLines={1}>
                      Card ending with {item.cardNumberFirstDigits}
                    </Text>
                  ))}
              </Animated.View>
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  content: {
    flex: 1,
    marginTop: height * 0.02,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
  },
  username: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: '600',
    marginTop: height * 0.02,
    maxWidth: '90%',
  },
  block: {
    marginBottom: height * 0.03,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: width * 0.05,
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
    left: width * 0.03,
    zIndex: 10,
    padding: width * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  blockTitle: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    marginBottom: height * 0.015,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockValue: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    marginLeft: width * 0.03,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    marginTop: height * 0.01,
  },
  cardText: {
    color: '#FFFFFF',
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
    flex: 1,
  },
  cardList: {
    overflow: 'hidden',
    marginTop: height * 0.01,
  },
  cardItem: {
    color: '#CCCCCC',
    fontSize: width * 0.038,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  noCards: {
    color: '#AAAAAA',
    fontSize: width * 0.035,
    marginTop: height * 0.01,
  },
});

export default ProfileScreen;