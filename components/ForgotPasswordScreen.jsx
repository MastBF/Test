import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/requests';
import { Image } from 'react-native-elements';
import SuccessAlert from '@/components/SuccessAlert';
import ErrorAlert from './ErrorAlert';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.get(`${BASE_URL}/api/v1/Authentication/forget-password/send-email?email=${email}`);
      setVisible(true)
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Failed to send verification code.')
      setErrorVisible(true)
    } finally {
      setLoading(false);
    }
  };
  const onCancel = () => {
    console.log()
    setErrorVisible(false)
  }
  return (
    <View style={styles.container}>
      <SuccessAlert visible={visible}
        onCancel={onCancel}
        text = 'If you can’t find it in your inbox, please check your spam folder.'  
        title = 'Check your email'  
      />
      <ErrorAlert visible={errorVisible} errorMessage={errorMessage} onCancel={onCancel}/>
      <Image
        source={require('../assets/images/trueLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a verification code.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  title: {
    fontFamily: 'RobotoBold',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
    marginBottom: 20,
    color: '#aaa',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0.5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    color: '#fff',
    width: '80%',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.33,
    marginBottom: -height * 0.01,
    marginLeft: width * 0.02,
  },
});

export default ForgotPasswordScreen;