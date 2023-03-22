import React from "react";
;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarPage from "./src/screens/CalendarPage";
import AddFriends from "./src/screens/AddFriends";
import AddTask from "./src/screens/AddTask";
import PomodoroTimer from './src/screens/PomodoroTimer';

const Tab = createBottomTabNavigator();  // creates object for Stack Navigator


const InitNavigator = () => {
    return (
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
            <Tab.Screen name="Calendar" component={TasksNavigator} />
            {/* <Tab.Screen name="Tasks" component={AddTask} /> */}
            <Tab.Screen name="Pomodoro" component={PomodoroTimer} />
            </Tab.Navigator>
    );
  }

  export {InitNavigator}

  const Stack = createNativeStackNavigator();

  const SettingsNavigator = () => {
    return (
        <Stack.Navigator 
        screenOptions={{
            headerShown: false
        }}>
           <Stack.Screen name='profileScreen' component={Profile}/>
           <Stack.Screen name='Settings' component={Settings}/>
           <Stack.Screen name='AddFriend' component={AddFriends}/>
     </Stack.Navigator> 
    );
  }

  export {SettingsNavigator}

  const Stack2 = createNativeStackNavigator();

  const TasksNavigator = () => {
    return (
        <Stack2.Navigator 
        screenOptions={{
            headerShown: false
        }}>
           <Stack2.Screen name='calendarScreen' component={CalendarPage}/>
           <Stack2.Screen name='Tasks' component={AddTask}/>
     </Stack2.Navigator> 
    );
  }

  export {TasksNavigator}