import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { BASE_URL } from '../../utils/requests';
import { AntDesign } from '@expo/vector-icons';
import ErrorAlert from '@/components/ErrorAlert';
import { PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const scaleFont = size => size * PixelRatio.getFontScale();
const scaleSize = size => (width / 375) * size;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorAlert, setErrorAlert] = useState(false)
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
    if (!validateForm()) return;

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
      setErrorAlert(true)
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const refreshAccessToken = async (token) => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }
      console.log(token, 'ref', refreshToken)
      const response = await axios.get(`${BASE_URL}/api/v1/Authentication/refresh-token`, {
        headers: {
          refreshTokenString: refreshToken,
          tokenString: token
        }
      });
      if (response.data.tokenSignature) {
        await AsyncStorage.setItem('token', response.data.tokenSignature);
      }
      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data.tokenSignature;
    } catch (error) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      console.error(error)
    }
  };

  const checkIfTokenExpired = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Authentication/state`, {
        headers: {
          Authorization: token,
        },
      });
      if (response) return false
    } catch (err) {
      if (err.status === 401) {
        return true
      }
    }
  };

  const makeAuthenticatedRequest = async () => {
    let accessToken = await AsyncStorage.getItem('token');
    let isTokenInvalid
    if (accessToken) {
      isTokenInvalid = await checkIfTokenExpired(accessToken);
    }
    if (isTokenInvalid) {
      accessToken = await refreshAccessToken(accessToken);
    }
    console.log(accessToken)
    if (accessToken) {
      navigation.navigate('Main')
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest()
  }, [])

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ErrorAlert visible={errorAlert} description={'Invalid username or password'} title={'Login failed'} onCancel={() => setErrorAlert(false)} />
      <Image
        source={require('../../assets/images/trueLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={[
          styles.input,
          emailError ? styles.inputError : null
        ]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={[
        styles.passwordContainer,
        passwordError ? styles.inputError : null
      ]}>
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
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}


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
      <TouchableOpacity
        style={styles.resetPasswordButton}
        disabled={isDisabled}
        onPress={() => navigation.navigate('ForgotPasswordScreen')}
      >
        <Text style={styles.resetPasswordButtonText}>Forgot Password?</Text>
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
    padding: scaleSize(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  logo: {
    width: scaleSize(300),
    height: scaleSize(250),
    marginBottom: scaleSize(-4),
    marginLeft: scaleSize(8),
  },
  title: {
    fontFamily: 'RobotoBold',
    fontSize: scaleFont(26),
    fontWeight: 'bold',
    marginBottom: scaleSize(24),
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: scaleSize(50),
    borderColor: '#ccc',
    borderWidth: 0.5,
    marginBottom: scaleSize(10),
    paddingHorizontal: scaleSize(12),
    backgroundColor: '#2E2E2E',
    borderRadius: scaleSize(12),
    color: '#fff',
    width: scaleSize(300),
    padding: scaleSize(14),
    paddingLeft: scaleSize(20),
    fontWeight: '200',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: scaleSize(300),
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: scaleSize(12),
    backgroundColor: '#2E2E2E',
    paddingHorizontal: scaleSize(12),
    marginBottom: scaleSize(10),
  },
  passwordInput: {
    flex: 1,
    height: scaleSize(50),
    color: '#fff',
    fontWeight: '200',
    marginLeft: scaleSize(8),
  },
  button: {
    backgroundColor: '#fff',
    padding: scaleSize(14),
    alignItems: 'center',
    borderRadius: scaleSize(8),
    width: scaleSize(300),
    margin: scaleSize(24),
    marginBottom: scaleSize(10),
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scaleFont(16),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(24),
    width: scaleSize(300),
  },
  line: {
    flex: 1,
    height: scaleSize(1),
    backgroundColor: '#fff',
  },
  orText: {
    marginHorizontal: scaleSize(8),
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: scaleFont(16),
  },
  googleIcon: {
    width: scaleSize(24),
    height: scaleSize(24),
    marginRight: scaleSize(8),
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: scaleSize(14),
    borderRadius: scaleSize(8),
    width: scaleSize(300),
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scaleFont(16),
    fontFamily: 'InterBold',
  },
  loginLink: {
    marginTop: scaleSize(10),
    textAlign: 'center',
    color: '#fff',
    fontSize: scaleFont(16),
    fontFamily: 'InterThin',
  },
  loginLinkText: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontFamily: 'InterMedium',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#451B1B',
    color: '#fff',
  },
  errorText: {
    marginTop: scaleSize(-4),
    color: 'red',
    fontSize: scaleFont(14),
    marginBottom: scaleSize(8),
    alignSelf: 'flex-start',
    paddingLeft: scaleSize(20),
  },
  resetPasswordButton: {
    marginTop: scaleSize(8),
  },
  resetPasswordButtonText: {
    color: '#fff',
    fontSize: scaleFont(14),
    fontFamily: 'InterMedium',
  },
});

export default LoginScreen;