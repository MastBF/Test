import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { api } from '../../utils/requests'; // Import the configured api instance
import { AntDesign } from '@expo/vector-icons';
import ErrorAlert from '@/components/ErrorAlert';
import { PixelRatio } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '@/context/AuthProvider'; 
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
  const { login } = useContext(AuthContext);
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
      // Use api instance, BASE_URL handled by interceptor
      const response = await api.post('/api/v1/Authentication/login', {
        email,
        password,
      });
      await login(response.data.token); 
      // Use 'userToken' key consistent with interceptor
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      setLoading(false);
      setIsDisabled(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
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
      // Use api instance, BASE_URL handled by interceptor. Keep custom headers for this specific endpoint.
      const response = await api.get('/api/v1/Authentication/refresh-token', {
        headers: {
          refreshTokenString: refreshToken,
          tokenString: token // Assuming backend needs the expired token here too
        }
      });
      if (response.data.tokenSignature) {
        // Use 'userToken' key consistent with interceptor
        await AsyncStorage.setItem('userToken', response.data.tokenSignature);
      }
      if (response.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      }

      return response.data.tokenSignature;
    } catch (error) {
      // Use 'userToken' key consistent with interceptor
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      console.error(error)
    }
  };

  const checkIfTokenExpired = async (token) => {
    try {
      // Use api instance, BASE_URL and Authorization header handled by interceptor
      const response = await api.get('/api/v1/Authentication/state');
      if (response) return false
    } catch (err) {
      if (err.status === 401) {
        return true
      }
    }
  };

  const makeAuthenticatedRequest = async () => {
    // Use 'userToken' key consistent with interceptor
    let accessToken = await AsyncStorage.getItem('userToken');
    let isTokenInvalid
    if (accessToken) {
      isTokenInvalid = await checkIfTokenExpired(accessToken);
    }
    if (isTokenInvalid) {
      accessToken = await refreshAccessToken(accessToken);
    }
    console.log(accessToken)
    if (accessToken) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0C0C0C' }}>
      <ScrollView style={styles.container}>
        <View style={styles.imageBlock}>
          <Image
            source={require('../../assets/images/trueLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <ErrorAlert visible={errorAlert} description={'Invalid username or password'} title={'Login failed'} onCancel={() => setErrorAlert(false)} />
        <View style={styles.inputPart}>
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
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('SignupScreen')}
          >
            Don't have an account yet?{' '}
            <Text style={styles.loginLinkText}>Sign Up</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#0C0C0C',
    paddingHorizontal: scaleSize(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  logo: {
    width: scaleSize(200),
    height: scaleSize(200),
    alignSelf: 'center',
    marginBottom: scaleSize(-4),
  },
  imageBlock: {
    position: 'absolute',
    alignSelf: 'center',
    top: 25,
    backgroundColor: '#000',
    borderRadius: 3000,
    borderWidth: 1,
    borderColor: '#F7A300',
    shadowColor: '#F7A300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 30,
    paddingLeft: 5
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
    borderColor: '#F7A300',
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
    shadowColor: '#F7A300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: scaleSize(300),
    borderColor: '#F7A300',
    borderWidth: 0.5,
    borderRadius: scaleSize(12),
    backgroundColor: '#2E2E2E',
    paddingHorizontal: scaleSize(12),
    marginBottom: scaleSize(10),
    shadowColor: '#F7A300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8
  },
  passwordInput: {
    flex: 1,
    height: scaleSize(50),
    color: '#fff',
    fontWeight: '200',
    marginLeft: scaleSize(8),
  },
  inputPart: {
    alignItems: 'center',
    marginTop: height - height / 1.45
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