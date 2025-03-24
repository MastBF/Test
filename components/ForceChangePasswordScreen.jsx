import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/requests';
import { Image } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const ForceChangePasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      
      var response = await axios.patch(
        `${BASE_URL}/api/v1/Authentication/change-own-password-forced`,
        { password: newPassword },
        { headers: { TokenString: token } }
      );

      console.log(response);
      
      Alert.alert('Success', 'Your password has been updated successfully.');
      navigation.navigate('Main'); // Redirect back to the main screen
    } catch (error) {
      console.log(response);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/trueLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>You are required to change your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
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

export default ForceChangePasswordScreen;