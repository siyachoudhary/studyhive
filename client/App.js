/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';

import { View, Text} from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
//  import StackNavigator from './StackNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';

import { InitNavigator } from './CustomNavigation';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarPage from './src/screens/CalendarPage';
import AddTask from './src/screens/AddTask';
import PomodoroTimer from './src/screens/PomodoroTimer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  return (
   <NavigationContainer>
      

      {/* <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator> */}

        <Stack.Navigator 
           screenOptions={{
               headerShown: false
           }}>
              <Stack.Screen name='Welcome Screen' component={WelcomeScreen}/>
              <Stack.Screen name='Sign Up' component={SignUp}/>
              <Stack.Screen name='Sign In' component={SignIn}/>
              <Stack.Screen name='Home' component={InitNavigator}/>
              <Stack.Screen name='Profile' component={Profile}/>
              {/* <Stack.Screen name='Settings' component={Settings}/> */}
              {/* <Stack.Screen name='CalendarPage' component={CalendarPage}/>
              <Stack.Screen name='AddTask' component={AddTask}/>
              <Stack.Screen name='Pomodoro Timer' component={PomodoroTimer}/> */}
        </Stack.Navigator> 

   </NavigationContainer>
   
  )
}

export default App