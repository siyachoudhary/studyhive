/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';

import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import { InitNavigator } from './CustomNavigation';


const Stack = createNativeStackNavigator();

const App = () => {

  return (
   <NavigationContainer>
        <Stack.Navigator 
           screenOptions={{
               headerShown: false
           }}>
              <Stack.Screen name='Welcome Screen' component={WelcomeScreen}/>
              <Stack.Screen name='Sign Up' component={SignUp}/>
              <Stack.Screen name='Sign In' component={SignIn}/>
              <Stack.Screen name='HomeFirst' component={InitNavigator} options={{gestureEnabled: false}}/>
        </Stack.Navigator> 

   </NavigationContainer>
  )
}

export default App