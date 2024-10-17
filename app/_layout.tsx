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
import MapScreen from '../components/MapScreen';
import AddPaymentCardScreen from '../pages/AddPaymentCardScreen ';
import PaymentScreen from '../pages/PaymentScreen';
import BranchesOnMap from '../pages/BranchesOnMap';
import test from '../pages/test';
import MainMap from '../pages/MainMap';
import AlertScreen from '../components/AlertScreen';
const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="SignupScreen">
        {/* <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} /> */}
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="Main" options={{ headerShown: false }} component={MainScreen} />
        <Stack.Screen name="MainMap" options={{ headerShown: false }} component={MainMap} />
        <Stack.Screen name="BranchesOnMap" options={{ headerShown: false }} component={BranchesOnMap} />
        {/* <Stack.Screen name="MapScreen" options={{ headerShown: false }} component={MapScreen} /> */}
        <Stack.Screen
          name="ProductScreen"
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}
          component={ProductScreen}
        />
        {/* <Stack.Screen name="AlertScreen" options={{ headerShown: false }} component={AlertScreen} /> */}
        <Stack.Screen name="test" options={{ headerShown: false }} component={test} />
        <Stack.Screen name="PaymentScreen" options={{ headerShown: false }} component={PaymentScreen} />
        <Stack.Screen
          name="AddPaymentCardScreen"
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}
          component={AddPaymentCardScreen}
        />
        {/* <Stack.Screen
          name="ItemScreen"
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}
          component={ItemScreen}
        /> */}
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
