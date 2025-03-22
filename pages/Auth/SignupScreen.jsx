import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as Font from 'expo-font';
import { BASE_URL } from '../../utils/requests';
import ErrorAlert from '@/components/ErrorAlert';
import { PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();
const scaleSize = size => (width / 375) * size;

const SignupScreen= ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [errorAlert, setErrorAlert] = useState(false)
  const [errorDescription, setErrorDescription] = useState('')
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

  const signUpReq = async () => {
    setLoading(true);
    try {
      const obj = {
        username,
        email,
        password,
      };
      const response = await axios.post(
        `${BASE_URL}/api/v1/Authentication/sign-up-user`,
        obj
      );
      alert('User signed up successfully');
      navigation.navigate('LoginScreen');
    } catch (error) {
      setErrorAlert(true)
      setErrorDescription(error?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError(null);
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return isValid;
  };

  const handleSignup = () => {
    if (validateInputs()) {
      signUpReq();
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ErrorAlert visible={errorAlert} onCancel={() => setErrorAlert(false)} description={errorDescription} title={'Sign up faild'}/>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/trueLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sign up</Text>
        <TextInput
          style={[
            styles.input,
            usernameError ? styles.inputError : null
          ]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          cursorColor={'#fff'}
          selectionColor={'#fff'}
          placeholderTextColor={'#aaa'}
        />
        {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

        <TextInput
          style={[
            styles.input,
            emailError ? styles.inputError : null
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          cursorColor={'#fff'}
          selectionColor={'#fff'}
          placeholderTextColor={'#aaa'}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <TextInput
          style={[
            styles.input,
            passwordError ? styles.inputError : null
          ]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          cursorColor={'#fff'}
          selectionColor={'#fff'}
          placeholderTextColor={'#aaa'}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <TextInput
          style={[
            styles.input,
            confirmPasswordError ? styles.inputError : null
          ]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          cursorColor={'#fff'}
          selectionColor={'#fff'}
          placeholderTextColor={'#aaa'}
        />
        {confirmPasswordError && (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]} // Изменяем прозрачность при отключенной кнопке
          onPress={handleSignup}
          disabled={loading} // Делаем кнопку неактивной
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" /> // Значок загрузки вместо текста
          ) : (
            <Text style={styles.buttonText}>Get Started</Text>
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
          <Text style={styles.googleButtonText}>Signup with Google</Text>
        </TouchableOpacity>
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Already have an account?{' '}
          <Text style={styles.loginLinkText}>Log In</Text>
        </Text>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleSize(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  logo: {
    width: scaleSize(260),
    height: scaleSize(240),
    marginBottom: scaleSize(-36),
    marginTop: scaleSize(-40),
    marginLeft: scaleSize(8),
  },
  title: {
    fontFamily: 'RobotoRegular',
    fontSize: scaleFont(22),
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
    width: '80%',
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
    paddingLeft: scaleSize(40),
  },
});
export default SignupScreen;
