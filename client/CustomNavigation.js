import React from "react";
;
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Calendar } from "react-native-calendars";
import CalendarPage from "./src/screens/CalendarPage";
import AddTask from "./src/screens/AddTask";
import PomodoroTimer from './src/screens/PomodoroTimer';import CalendarPage from "./src/screens/Calendar";
import AddFriends from "./src/screens/AddFriends";


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
            <Tab.Screen name="Calendar" component={CalendarPage} />
            <Tab.Screen name='Task' component={AddTask}/>
            <Tab.Screen name='Timer' component={PomodoroTimer}/>
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
     </Stack.Navigator> 
        // {/* </NavigationContainer> */}
    );
  }

  export {SettingsNavigator}

  // const Stack2 = createNativeStackNavigator();

  // const CalendarNavigator = () => {
  //   return (
  //       // <NavigationContainer>
  //       <Stack2.Navigator 
  //       screenOptions={{
  //           headerShown: false
  //       }}>
  //          <Stack2.Screen name='CalendarPage' component={CalendarPage}/>
  //          <Stack2.Screen name='AddTask' component={AddTask}/>
  //          <Stack2.Screen name='Profile' component={Profile}/>
  //    </Stack2.Navigator> 
  //       // {/* </NavigationContainer> */}
  //   );
  // }

  // export {CalendarNavigator}
