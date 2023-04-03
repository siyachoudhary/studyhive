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
import Requests from './src/screens/Requests';
const Tab = createBottomTabNavigator();  // creates object for Stack Navigator
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// https://oblador.github.io/react-native-vector-icons/ -> link for materialIcons icons
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
            tabBarStyle: { backgroundColor: 'black', padding:7, height:85},
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
            <Tab.Screen name="Hive Session" component={CallNavigator} 
            options={{
              tabBarLabel: 'Hive Session',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'groups'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            <Tab.Screen name="Profile" component={SettingsNavigator} 
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name={'person'} size={25} color={focused?'#ffab00':'white'}/>
              ),
            }}/>
            {/* <Tab.Screen name="Pomodoro" component={PomodoroTimer} /> */}
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
           <Stack.Screen name='Requests' component={Requests}/>
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

  // import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN_NAMES } from "./src/navigators/screenNames";
import Join from "./src/screens/join";
import Meeting from "./src/screens/meeting";
import { LogBox, Text } from "react-native";
import { Image } from "react-native-svg";
// import ParticipantStatsViewer from "./src/screens/meeting/Components/ParticipantStatsViewer";
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
