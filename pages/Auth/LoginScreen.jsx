import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { BASE_URL } from '../../utils/requests';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../../assets/fonts/Roboto-Regular.ttf'),
        LatoLight: require('../../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../../assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/Authentication/login`, {
        email,
        password
      });
      await AsyncStorage.setItem('token', response.data.token);
      setLoading(false);
      navigation.navigate('Main');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login failed', 'Invalid email or password');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo3.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or With</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assets/images/googleLogo.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
      <Text
        style={styles.loginLink}
        onPress={() => navigation.navigate('SignupScreen')}
      >
        Don't have an account yet?{' '}
        <Text style={styles.loginLinkText}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  logo: {
    width: width * 1,
    height: height * 0.3,
    marginBottom: -height * 0.05,
  },
  title: {
    fontFamily: 'RobotoRegular',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 0.5,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.02,
    backgroundColor: '#2E2E2E',
    borderRadius: width * 0.03,
    color: '#fff',
    width: width * 0.8,
    margin: height * 0.015,
    padding: height * 0.02,
    paddingLeft: width * 0.05,
    fontWeight: '200',
  },
  button: {
    backgroundColor: '#fff',
    padding: height * 0.02,
    alignItems: 'center',
    borderRadius: width * 0.02,
    width: width * 0.8,
    margin: height * 0.03,
    marginBottom: height * 0.015,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.03,
    width: width * 0.8,
  },
  line: {
    flex: 1,
    height: height * 0.002,
    backgroundColor: '#fff',
  },
  orText: {
    marginHorizontal: width * 0.02,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  googleIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.02,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: height * 0.02,
    borderRadius: width * 0.02,
    width: width * 0.8,
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    fontFamily: 'InterBold',
  },
  loginLink: {
    marginTop: height * 0.02,
    textAlign: 'center',
    color: '#fff',
    fontSize: width * 0.04,
    fontFamily: 'InterThin',
  },
  loginLinkText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontFamily: 'InterMedium',
  },
});

export default LoginScreen;
