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

const { width, height } = Dimensions.get('window');

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
        LatoLight: require('../assets/fonts/Lato-Light.ttf'),
        InterThin: require('../assets/fonts/Inter-Thin.ttf'),
        InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
        InterBold: require('../assets/fonts/Inter-Bold.ttf'),
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
        'http://25.65.131.20:5000/api/v1/Authentication/sign-up-user',
        obj
      );
      console.log(response.data);
      alert('User signed up successfully');
    } catch (error) {
      console.error(error);
      alert('Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    if (password === confirmPassword) {
      signUpReq();
    } else {
      alert('Passwords do not match');
    }
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo3.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or With</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../assets/images/googleLogo.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Signup with Google</Text>
        </TouchableOpacity>
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account?{' '}
          <Text style={styles.loginLinkText}>Log In</Text>
        </Text>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
    padding: 20,
  },
  logo: {
    width: 350,
    // height: 200,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'RobotoRegular',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 0.5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    color: '#fff',
    width: '80%',
    margin: 10,
    padding: 15,
    paddingLeft: 20,
    fontWeight: '200',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: '80%',
    margin: 30,
    marginBottom: 10,
    // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)' // Замена shadow* на boxShadow
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 17,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'InterBold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 17,
    fontFamily: 'InterBold',
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontFamily: 'InterThin',
  },
  loginLinkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'InterMedium',
  },
});

export default SignupScreen;
