import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Dimensions, PixelRatio, SafeAreaView 
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/requests';
import { Icon, Image } from 'react-native-elements';
import SuccessAlert from '@/components/SuccessAlert';
import ErrorAlert from './ErrorAlert';

const { width, height } = Dimensions.get('window');

const scaleFont = size => size * PixelRatio.getFontScale();
const scaleSize = size => (width / 375) * size;

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.get(`${BASE_URL}/api/v1/Authentication/forget-password/send-email?email=${email}`);
      setVisible(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send verification code.');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setErrorVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="left" type="antdesign" color="#fff" size={scaleSize(20)} />
      </TouchableOpacity>

      <SuccessAlert
        visible={visible}
        onCancel={onCancel}
        text="If you can’t find it in your inbox, please check your spam folder."
        title="Check your email"
      />
      <ErrorAlert visible={errorVisible} errorMessage={errorMessage} onCancel={onCancel} />

      <Image
        source={require('../assets/images/trueLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a verification code.
      </Text>

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
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Send Verification Code</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C', 
    paddingHorizontal: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: scaleSize(20),
    left: scaleSize(10),
    zIndex: 10,
    padding: scaleSize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scaleSize(10),
  },
  title: {
    fontSize: scaleFont(26),
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: scaleSize(8),
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: scaleFont(16),
    fontFamily: 'Inter_400Regular',
    color: '#B0B0B0',
    marginBottom: scaleSize(20),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  input: {
    width: '90%',
    height: scaleSize(50),
    backgroundColor: '#2E2E2E',
    borderRadius: scaleSize(12),
    paddingHorizontal: scaleSize(16),
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    marginBottom: scaleSize(16),
    borderColor: '#444',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  button: {
    width: '90%',
    backgroundColor: '#4CAF50',
    paddingVertical: scaleSize(14),
    borderRadius: scaleSize(9),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4, 
    marginTop: scaleSize(10),
  },
  buttonText: {
    fontSize: scaleFont(16),
    fontFamily: 'Inter_600SemiBold', 
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.25,
    marginBottom: scaleSize(10),
    borderRadius: scaleSize(16),
  },
});

export default ForgotPasswordScreen;
