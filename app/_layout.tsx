import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupScreen from '../pages/SignupScreen';
import MainScreen from '../pages/MainScreen';
import ProductScreen from '../pages/ProductScreen';
import ItemScreen from '../pages/ItemScreen'
const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Main" options={{ headerShown: false }} component={MainScreen} />
        <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} />
        <Stack.Screen name="ProductScreen" options={{ headerShown: false,  ...TransitionPresets.FadeFromBottomAndroid }} component={ProductScreen} />
        <Stack.Screen name="ItemScreen" options={{ headerShown: false,  ...TransitionPresets.FadeFromBottomAndroid }} component={ItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 
