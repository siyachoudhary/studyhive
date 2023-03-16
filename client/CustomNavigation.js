import React from "react";
;
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarPage from "./src/screens/CalendarPage";
import AddFriends from "./src/screens/AddFriends";
import AddTask from "./src/screens/AddTask";
import Timer from "./src/timer";
import PomodoroTimer from './src/screens/PomodoroTimer';


const Tab = createBottomTabNavigator();  // creates object for Stack Navigator


const InitNavigator = () => {
    return (
        // <NavigationContainer>
            <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {fontSize:14},
            tabBarActiveTintColor: '#ffab00',
            tabBarInactiveTintColor: 'white',
            tabBarHideOnKeyboard: true,
            tabBarStyle: { backgroundColor: 'black' },
          }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={SettingsNavigator} />
            <Tab.Screen name="CalendarPage" component={CalendarPage} />
            <Tab.Screen name="AddTask" component={AddTask} />
            <Tab.Screen name="Pomodoro Timer" component={PomodoroTimer} />
            </Tab.Navigator>
        // {/* </NavigationContainer> */}
    );
  }

  export {InitNavigator}

  const Stack = createNativeStackNavigator();

  const SettingsNavigator = () => {
    return (
        // <NavigationContainer>
        <Stack.Navigator 
        screenOptions={{
            headerShown: false
        }}>
           <Stack.Screen name='Profile' component={Profile}/>
           <Stack.Screen name='Settings' component={Settings}/>
           <Stack.Screen name='AddFriend' component={AddFriends}/>
     </Stack.Navigator> 
        // {/* </NavigationContainer> */}
    );
  }

  export {SettingsNavigator}