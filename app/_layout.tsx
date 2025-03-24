import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupScreen from '../pages/Auth/SignupScreen';
import MainScreen from '../pages/MainScreen';
import ProductScreen from '../pages/ProductScreen';
import ItemScreen from '../pages/ItemScreen';
import ProfileScreen from '../pages/ProfileScreen';
import Panel from '../components/Panel';
import LoginScreen from '../pages/Auth/LoginScreen';
import ForgotPasswordScreen from '../components/ForgotPasswordScreen';
import ForceChangePasswordScreen from '../components/ForceChangePasswordScreen';
import MapScreen from '../components/MapScreen';
import AddPaymentCardScreen from '../pages/AddPaymentCardScreen ';
import PaymentScreen from '../pages/PaymentScreen';
import BranchesOnMap from '../pages/BranchesOnMap';
import MarkerCustom from '../pages/MarkerCustom';
// import MainMap from '../pages/MainMap';
import AlertScreen from '../components/AlertScreen';
import Cart from '../components/Cart';
import ProdInfo from '../components/ProdInfo';
import CustomMarker from '../components/CustomMarker';
import Footer from '../components/Panel';
import CardSelectionScreen from '../components/CardSelectionScreen'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

const App: React.FC = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationIndependentTree >

        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ForceChangePasswordScreen"
            component={ForceChangePasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={Footer}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} />
          <Stack.Screen
            name="ProductScreen"
            options={{ headerShown: false, ...TransitionPresets.DefaultTransition }}
            component={ProductScreen}
          />
          <Stack.Screen name="Cart" options={{ headerShown: false }} component={Cart} />
          <Stack.Screen name="CardSelectionScreen" options={{ headerShown: false }} component={CardSelectionScreen} />
          {/* <Stack.Screen
            name="ProfileScreen"
            options={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}
            component={ProfileScreen}
          /> */}
          {/* <Stack.Screen name="Main" options={{ headerShown: false }} component={MainScreen} /> */}
        <Stack.Screen name="PaymentScreen" options={{ headerShown: false }} component={PaymentScreen} />
        </Stack.Navigator>
        {/* <Tab.Navigator initialRouteName="SignupScreen" screenOptions={{ headerShown: false }}
        > */}
        {/* <Stack.Screen name="AlertScreen" options={{ headerShown: false }} component={AlertScreen} /> */}
        {/* <Stack.Screen name="CustomMarker" options={{ headerShown: false }} component={CustomMarker} /> */}
        {/* <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} /> */}
        {/* <Stack.Screen name="ProdInfo" options={{ headerShown: false }} component={ProdInfo} /> */}
        {/* <Stack.Screen name="MarkerCustom" options={{ headerShown: false }} component={MarkerCustom} /> */}
        {/* <Tab.Screen name="MainMap" options={{ headerShown: false }} component={MainMap} /> */}
        {/* <Stack.Screen name="BranchesOnMap" options={{ headerShown: false }} component={BranchesOnMap} /> */}
        {/* <Stack.Screen name="MapScreen" options={{ headerShown: false }} component={MapScreen} /> */}
        {/* <Stack.Screen
          name="ItemScreen"
          options={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}
          component={ItemScreen}
        /> */}

        {/* <Footer /> */}
        {/* </Tab.Navigator> */}
      </NavigationIndependentTree>
    </GestureHandlerRootView>
  );
};




export default App;
