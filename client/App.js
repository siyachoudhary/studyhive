/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
//  import StackNavigator from './StackNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import Home from './src/screens/Home';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
   <NavigationContainer>
      <Stack.Navigator 
         screenOptions={{
             headerShown: false
         }}>
            {/* <Stack.Screen name='Welcome Screen' component={WelcomeScreen}/> */}
            {/* <Stack.Screen name='Sign Up' component={SignUp}/> */}
            {/* <Stack.Screen name='Sign In' component={SignIn}/> */}
            <Stack.Screen name='Home' component={Home}/>
      </Stack.Navigator>
   </NavigationContainer>
  )
}

export default App