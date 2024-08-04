import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupScreen from '../pages/Auth/SignupScreen';
import MainScreen from '../pages/MainScreen';
import ProductScreen from '../pages/ProductScreen';
import ItemScreen from '../pages/ItemScreen';
import ProfileScreen from '../pages/ProfileScreen';
import Panel from '../components/Panel';
import LoginScreen from '../pages/Auth/LoginScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="SignupScreen">
        {/* <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} /> */}
        {/* <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} /> */}
        <Stack.Screen 
          name="ProductScreen"  
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }} 
          component={ProductScreen} 
        />
        {/* <Stack.Screen name="Main" options={{ headerShown: false }} component={MainScreen} /> */}
        <Stack.Screen 
          name="ItemScreen" 
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }} 
          component={ItemScreen} 
        />
        <Stack.Screen 
          name="ProfileScreen" 
          options={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }} 
          component={ProfileScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
