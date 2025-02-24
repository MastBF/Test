import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { BASE_URL } from '../../utils/requests';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Проверка токена при монтировании компонента
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('Main'); // Перенаправление на главную страницу, если токен есть
      }
    };

    checkToken();
  }, [navigation]);

  // Загрузка шрифтов
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../../assets/fonts/Roboto-Regular.ttf'),
        RobotoBold: require('../../assets/fonts/Roboto-Bold.ttf'),
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
    setIsDisabled(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/Authentication/login`, {
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      setLoading(false);
      setIsDisabled(false);
      navigation.navigate('Main');
    } catch (error) {
      setLoading(false);
      setIsDisabled(false);
      Alert.alert('Login failed', 'Invalid email or password');
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const response = await axios.post(`${BASE_URL}/api/v1/Authentication/refresh-token`, {
        refreshToken,
      });

      await AsyncStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data.accessToken;
    } catch (error) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      navigation.navigate('Login');
      throw error;
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const isTokenExpired = checkIfTokenExpired(accessToken);

    if (isTokenExpired) {
      accessToken = await refreshAccessToken();
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios(url, { ...options, headers });
    return response.data;
  };

  const checkIfTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token); // Используйте библиотеку для декодирования JWT
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
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
        source={require('../../assets/images/trueLogo.png')}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <AntDesign name={passwordVisible ? 'eye' : 'eyeo'} color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isDisabled && { opacity: 0.5 }]}
        onPress={handleLogin}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
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
    width: width * 0.8,
    height: height * 0.33,
    marginBottom: -height * 0.01,
    marginLeft: width * 0.02,
  },
  title: {
    fontFamily: 'RobotoBold',
    fontSize: width * 0.07,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: width * 0.03,
    backgroundColor: '#2E2E2E',
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.015,
  },
  passwordInput: {
    flex: 1,
    height: height * 0.06,
    color: '#fff',
    fontWeight: '200',
    marginLeft: width * 0.02,
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