import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ errorMsg }) => {
  if (!errorMsg) return null;

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{errorMsg}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  errorContainer: { 
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 1,
    top: '30%',
    width: '80%',
    height: '20%',
    backgroundColor: '#2E2E2E',
  },
  errorText: {
    color: 'white',
    fontSize: 20,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ErrorMessage;
