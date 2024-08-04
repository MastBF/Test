import React from 'react';
import { View, StyleSheet } from 'react-native';
import Panel from '../components/Panel';

const withPanel = (WrappedComponent) => {
  return (props) => (
    <View style={styles.container}>
      <WrappedComponent {...props} />
      <Panel {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withPanel;
