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

const { width, height } = Dimensions.get('window');

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
    padding: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  logo: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: -height * 0.09,
    marginTop: -height * 0.1,
    marginLeft: width * 0.02,
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
    width: '80%',
    margin: height * 0.015,
    padding: height * 0.02,
    paddingLeft: width * 0.05,
    fontWeight: '200',
  },
  button: {
    backgroundColor: '#fff',
    padding: height * 0.018,
    alignItems: 'center',
    borderRadius: width * 0.02,
    width: '80%',
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
    width: '80%',
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
    padding: height * 0.018,
    borderRadius: width * 0.02,
    width: '80%',
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
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#451B1B',
    color: '#fff'
  },
  errorText: {
    marginTop: -height * 0.01,
    color: 'red',
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    alignSelf: 'flex-start',
    paddingLeft: width * 0.1,
  },
});

export default SignupScreen;
