import React, { useEffect, useState } from "react";
;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import Home from "./src/screens/Home";
import Settings from "./src/screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarPage from "./src/screens/CalendarPage";
import AddFriends from "./src/screens/AddFriends";
import AddTask from "./src/screens/AddTask";
import Requests from './src/screens/Requests';
import LogHour from "./src/screens/LogHour";
import StartPomodoro from "./src/screens/StartPomodoro";
const Tab = createBottomTabNavigator();  // creates object for Stack Navigator
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FriendProfile from "./src/screens/FriendProfile";
// https://oblador.github.io/react-native-vector-icons/ -> link for materialIcons icons

const InitNavigator = () => {

    return (
            <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
              fontSize:14, 
              fontFamily: 'Mohave-Light'
            },
            tabBarActiveTintColor: '#ffab00',
            tabBarInactiveTintColor: 'white',
            tabBarHideOnKeyboard: true,
            tabBarStyle: {backgroundColor: '#2F2F2F', padding:0, height:85, borderTopWidth:0},
            tabBarItemStyle: {marginTop: 10}
          }}>
            <Tab.Screen name="Home" component={Home} 
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'home'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            <Tab.Screen name="Calendar" component={TasksNavigator} 
            options={{
              tabBarLabel: 'Calendar',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'date-range'} size={25} color={focused?'#ffab00':'white'} />
              ),
            }}/>
            <Tab.Screen name="Bee Time" component={StartPomodoro} 
            options={{
              tabBarLabel: 'Bee Time',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'timelapse'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            <Tab.Screen name="Hive Session" component={CallNavigator} 
            options={{
              tabBarLabel: 'Hive Session',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'groups'} size={28} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            {/* <Tab.Screen name="Chat" component={SettingsNavigator} 
            options={{
              tabBarLabel: 'Chat',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'forum'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/> */}
            <Tab.Screen name="Profile" component={SettingsNavigator} 
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'person'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            </Tab.Navigator>
    );
  }

  export {InitNavigator}

  const Stack = createNativeStackNavigator();

  const SettingsNavigator = () => {
    return (
        <Stack.Navigator 
        initialRouteName="profileScreen"
        screenOptions={{
            headerShown: false
        }}>
           <Stack.Screen name='profileScreen' component={Profile}/>
           <Stack.Screen name='Settings' component={Settings}/>
           <Stack.Screen name='Requests' component={Requests}/>
           <Stack.Screen name='AddFriend' component={AddFriends}/>
           <Stack.Screen name='FriendProfile' component={FriendProfile}/>
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
           <Stack2.Screen name='Log' component={LogHour}/>
     </Stack2.Navigator> 
    );
  }

  export {TasksNavigator}
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN_NAMES } from "./src/navigators/screenNames";
import Join from "./src/screens/join";
import Meeting from "./src/screens/meeting";
import { LogBox} from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const RootStack = createStackNavigator();

export default function CallNavigator() {
  return (
      <RootStack.Navigator
        screenOptions={{
          animationEnabled: false,
          presentation: "modal",
        }}
        initialRouteName={SCREEN_NAMES.Join}
      >
        <RootStack.Screen
          name={SCREEN_NAMES.Join}
          component={Join}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.Meeting}
          component={Meeting}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
  );
}
