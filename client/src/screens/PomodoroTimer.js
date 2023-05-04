import React, { Component,useState, useEffect, useRef} from 'react';
import { StyleSheet, AppState, Text, ScrollView, StatusBar, Dimensions, View, Pressable} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from './BaseUrl';
// importing components from other files
import Timer from '../timer.js';
import { useIsFocused } from '@react-navigation/native'

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
let logDays = [];
let logFull = {};
let lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let stopped = false;
const PomodoroTimer = ({route}) => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
          console.log(isPlaying)
          if(!stopped){
            setPlaying(isPlaying => !isPlaying)
          }
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState ' + appState.current);
        if(appState.current.match(/inactive/)){
          setOutNum(outNum => outNum+1)
          console.log(stopped)
          if(!stopped){
            setPlaying(isPlaying => !isPlaying)
          }
        }
        });

        return () => {
        subscription.remove();
        };
    }, []);

    const pomodoroVal = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    const shortVal = [5, 10, 15, 20, 25, 30]
    const longVal = [10, 15, 20, 25, 30, 35]
    const afterVal = [2, 4, 6]
    const baseURL = BaseURL;
    let doRun = true;

    // const baseURL = BaseURL;

    const isFocused = useIsFocused()

    useEffect(() => {
      if(isFocused){
        console.log("is focused on this page")
        setFunc(() => () => navigation.navigate('startPomodoro'))
      }
    }, [isFocused])

    const navigation = useNavigation();

    const {title, pomodoro, short, long, after} = route.params;
    let pomodoro2 = pomodoroVal[parseInt(pomodoro)-1]
    let short2 = shortVal[parseInt(short)-1]
    let long2 = longVal[parseInt(long)-1]
    let after2 = afterVal[parseInt(after)-1]

    let now = JSON.stringify(new Date())
        let year = now.slice(1, 5);
        let month = now.slice(6, 8);
        let day =  now.slice(9, 11);
        let newDate = `${year}-${month}-${day}`;

    const [isPlaying, setPlaying] = useState(true)
    const [key, setKey] = useState(0)
    const [time, setTime] = useState(pomodoro2*60)
    const [session, setSession] = useState('WORK SESSION')
    const [cycles, setCycles] = useState(0)
    const [outNum, setOutNum] = useState(0)
    const [func, setFunc] = useState(() => () => console.log('NO'))
    // const [stopped, setStopped] = useState(false);
    const children = ({ remainingTime }) => {
      const minutes = Math.floor(remainingTime / 60)
      const seconds = ("0" + (remainingTime % 60)).slice(-2)
    
      return `${minutes}:${seconds}`
    }

    async function retrieveData(){
      try {
          const value = await AsyncStorage.getItem('user')
          const obj = JSON.parse(value);
          // console.log("user value:" + value)
          if(value !== null) {
            console.log(obj)
            user = obj;
            console.log(user.email)
            email = user.email;
          //   console.log(user._id)
            console.log('RETRIEVED USER')
          }
        } catch(e) {
          console.log(e.message )
        }
  }

  let lifetimeHours; 
  const getLifeTimeHours = async () =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
        await axios
           .get(`${baseURL}getLifeTimeHours/${user._id}`)
           .then(function (res) {
              lifetimeHours = res.data.lifetimeHours
              console.log('lifetime')
              console.log(lifetimeHours)
           })
           .catch(function (err) {
               // handle error
               console.log("error: "+err.message);
           });
         }
  }

  const updateLifeTimeHours = (hours) =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
          axios
          .post(`${baseURL}updateLifeTimeHours/${user._id}`, {
              lifetimeHours: hours
          }).then(function(response){
              console.log("life time hours updated")
              console.log(lifetimeHours)
          }).catch(function (err) {
              console.log('THIS IS NOT WORKING BRO')
              console.log(err.message);
          })
      }
  }

  let currentStreak; 
  const getCurrentStreak = async () =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
        await axios
           .get(`${baseURL}getCurrentStreak/${user._id}`)
           .then(function (res) {
              currentStreak = res.data.currentStreak
              console.log('current streak')
              console.log(currentStreak)
           })
           .catch(function (err) {
               // handle error
               console.log("error: "+err.message);
           });
         }
  }

  const updateCurrentStreak = (days) =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
          axios
          .post(`${baseURL}updateCurrentStreak/${user._id}`, {
              currentStreak: days
          }).then(function(response){
              console.log("current streak updated")
              console.log(currentStreak)
          }).catch(function (err) {
              console.log('THIS IS NOT WORKING BRO')
              console.log(err.message);
          })
      }
  }

  let longestStreak; 
  const getLongestStreak = async () =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
        await axios
           .get(`${baseURL}getLongestStreak/${user._id}`)
           .then(function (res) {
              longestStreak = res.data.longestStreak
              console.log('longest streak')
              console.log(longestStreak)
           })
           .catch(function (err) {
               // handle error
               console.log("error: "+err.message);
           });
         }
  }

  const updateLongestStreak = (days) =>{
      // console.log('RUNNING THIS')
      // console.log(email)
      if(email != ""){
          // console.log('passed first test')
          axios
          .post(`${baseURL}updateLongestStreak/${user._id}`, {
              longestStreak: days
          }).then(function(response){
              console.log("longest streak updated")
              console.log(longestStreak)
          }).catch(function (err) {
              console.log('THIS IS NOT WORKING BRO')
              console.log(err.message);
          })
      }
  }

  const storeLog = async (value) => {
    try {
      await AsyncStorage.setItem('studyLog', value)
      console.log("saved study log")
      console.log(value)
    } catch (e) {
      // saving error
      console.log(e.message)
    }
    return;
}

  async function loadLog() {
    await AsyncStorage.getItem("studyLog").then(value => {
      if(value != null){
        logFull = JSON.parse(value);
        console.log('loaded study log')
        console.log(logFull)
      }
    }).catch(err => {
      console.log(err.message);  
    })
    return;
}

  async function logInformation(duration){
    await loadLog();
    await retrieveData();
    await getLifeTimeHours();
    await getCurrentStreak();
    await getLongestStreak();

    let newTask = {
      topic: title, 
      hours: Math.round((duration/60) * 10)/10,
      date: newDate, 
    }

    // console.log('HOURS')
    console.log(newTask.hours)
    logDays.push(newTask.date)
        // storeData(JSON.stringify(logDays))

        console.log('please print bruh')
        console.log(logFull)
        if(!Object.keys(logFull).length){
            Object.assign(logFull, {[newTask.date]: [{
                topic: newTask.topic,
                date: newTask.date,
                hours: newTask.hours
            }]});
        } else {
            if (!logFull[newTask.date]) {
                logFull[newTask.date] = []
            }
            logFull[newTask.date].push({
                topic: newTask.topic,
                date: newTask.date,
                hours: newTask.hours
            })
        }

        const ordered = Object.keys(logFull).sort().reduce(
            (obj, key) => { 
              obj[key] = logFull[key]; 
              return obj;
            }, 
            {}
        );

        lifetimeHours += newTask.hours;
        updateLifeTimeHours(lifetimeHours);
        // console.log((Object.keys(ordered)[0]).slice(8))
        findStreaks(ordered)
        updateCurrentStreak(currentStreak)
        updateLongestStreak(longestStreak)
        // console.log(ordered)


        // console.log(logFull)
        await storeLog(JSON.stringify(logFull))
  }

  const findStreaks = (ordered) => {
    console.log('FIND STREAKS')
    console.log(ordered)
    // let now = JSON.stringify(new Date())
    // let year = now.slice(1, 5);
    // let month = now.slice(6, 8);
    // let day =  now.slice(9, 11);
    // let newDate = `${year}-${month}-${day}`;
    let oldNum = (Object.keys(ordered)[0]).slice(8) * 1; 
    console.log(Object.keys(ordered)[0])
    let thatMonth = (Object.keys(ordered)[0]).slice(5, 7) * 1;
    if(lastDates[thatMonth-1] == oldNum){
        oldNum = 0;
    }
    let newNum;
    let tempCurrent = 0;
    let tempLongest = 0;
    for (let i = 1; i < Object.keys(ordered).length; i++) {
        newNum = (Object.keys(ordered)[i]).slice(8) * 1;
        let thatMonth = (Object.keys(ordered)[0]).slice(5, 7) * 1;
        if(lastDates[thatMonth-1] == oldNum){
            oldNum = 0;
        }
        console.log(newNum - oldNum)
        if((newNum - oldNum) == 1){
            if(tempLongest == 0){
                tempLongest += 1;
            }
            tempLongest += 1;
            console.log(tempLongest)
            if(tempLongest > longestStreak){
                longestStreak = tempLongest;
            }
        } else {
            tempLongest = 0;
        }
        oldNum = newNum;
    }
    console.log(newDate)
    console.log(Object.keys(ordered)[Object.keys(ordered).length-1])
    if(Object.keys(ordered)[Object.keys(ordered).length-1] == newDate){
        console.log('sameeeeeeeeeeeee')
        // currentStreak = 1;
        tempCurrent = 1;
        if(tempCurrent > currentStreak){
            currentStreak = tempCurrent;
        }
        oldNum = (Object.keys(ordered)[Object.keys(ordered).length-1]).slice(8) * 1;
        for (let i = Object.keys(ordered).length-2; i >= 0; i--) {
            newNum = (Object.keys(ordered)[i]).slice(8) * 1;
            let thatMonth = (Object.keys(ordered)[i]).slice(5, 7) * 1;
            if(lastDates[thatMonth-1] == newNum){
                oldNum = newNum+1;
            }
            console.log(oldNum - newNum)
            if((oldNum - newNum) == 1){
                tempCurrent += 1;
                if(tempCurrent > currentStreak){
                    currentStreak = tempCurrent;
                }
            } else {
                break;
            }
            oldNum = newNum;
        }
        if(longestStreak == 0){
            longestStreak = currentStreak;
        }
    }
}

    return (
      // <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
      //   <StatusBar barStyle='dark-content' />
      //   <Text style={[styles.text, styles.boxShadow]}>Work Timer</Text>
      //   <Timer/>
      // </ScrollView>
      <View style={styles.backGround}>
        <Text style={styles.header}>BEE TIME</Text>
        <Text style={[styles.text, {textAlign: 'center', fontSize: 26, fontWeight:'500', letterSpacing: 1}]}>{session}</Text>
        <Text style={[styles.text, {textAlign: 'center', fontSize: 20, fontWeight:'500', letterSpacing: 1}]}>Topic: {title}</Text>
        <Text style={[styles.text, {textAlign: 'center', fontSize: 20, fontWeight:'500', letterSpacing: 1}]}>Distraction Count: {outNum}</Text>
        <View style={styles.container}>
          <CountdownCircleTimer
            key={key}
            style={styles.timer}
            isPlaying={isPlaying}
            duration={time}
            size={270}
            strokeWidth={18}
            strokeLinecap={'butt'}
            colors="#EDA73A"
            onComplete={() => {
              // do your stuff here
              // do your stuff here
              // setTime()
              // if(doRun){
                console.log('running')
                logInformation(time/60);
                setCycles(cycles => cycles+1)
                console.log('CYCLESSSSSSSSSSSSS')
                console.log(cycles)
                if((cycles % 2 == 0)){
                  if(((cycles+2) % (2*after2)) == 0 && cycles != 0){
                    setTime(long2 * 60)
                    setSession('LONG BREAK SESSION')
                  } else {
                    setTime(short2 * 60)
                    setSession('SHORT BREAK SESSION')
                  }
                } else {
                  setTime(pomodoro2 * 60)
                  setSession('WORK SESSION')
                }
                doRun = false;
                console.log('WENT TO FALSE')
                setKey(key => key+1)
              // }
        
              return {shouldRepeat: true} // repeat animation in 1.5 seconds
            }}
            // children = {({ remainingTime }) => {
            //   const minutes = Math.floor(remainingTime / 60)
            //   const seconds = remainingTime % 60
            //   console.log('minutes')
            //   return `${minutes}:${seconds}`
            // }}
            >

            {({remainingTime}) => <Text style={[styles.buttonText, {color: "#FFFFFF", fontSize: 60}]}>{children({remainingTime})}</Text>}
            </CountdownCircleTimer>
        </View>
        
        <View style={{flexDirection: "row"}}>
          <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginRight: SCREENHEIGHT/150, paddingHorizontal: 8}]} 
                    onPress={() =>
                      // setTime(600) +
                      setKey(key => key+1)}
                    >
                <AntDesign name={'banckward'} size={28}/>
            </Pressable>
          {/* <View style={{flexDirection: "column"}}> */}
            <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginHorizontal: SCREENHEIGHT/100, paddingHorizontal: 6}]} 
                    onPress={() => {
                      console.log(isPlaying)
                      setPlaying(isPlaying => !isPlaying)
                      stopped = !stopped;
                    }}
                    >
                {/* <Text style={[styles.buttonText, {letterSpacing: 0}]}>▐▐ </Text> */}
                <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={38}/>
            </Pressable>
          {/* </View>
          <View style={{flexDirection: "column"}}> */}
            <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginLeft: SCREENHEIGHT/150, paddingHorizontal: 8}]} 
                    onPress={() => {
                      setCycles(cycles => cycles+1);
                      console.log('CYCLESSSSSSSSSSSSS')
                      console.log(cycles)
                      if((cycles % 2 == 0)){
                        if(((cycles+2) % (2*after2)) == 0 && cycles != 0){
                          setTime(long2*60)
                          setSession('LONG BREAK SESSION')
                        } else {
                          setTime(short2*60)
                          setSession('SHORT BREAK SESSION')
                        }
                      } else {
                        setTime(pomodoro2*60)
                        setSession('WORK SESSION')
                      }
                      setKey(key => key+1)
                    }}
                    >
                <AntDesign name={'forward'} size={28}/>
            </Pressable>
          {/* </View> */}
        </View>

        <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button, {marginHorizontal: SCREENHEIGHT/8}]} 
                onPress={func}
                >
            <Text style={styles.buttonText}>EXIT POMODORO</Text>
          </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  backGround: {
    resizeMode: 'cover',
    height: SCREENHEIGHT,
    width: SCREENWIDTH,
    backgroundColor: "#2F2F2F"
  },
  container: {
    marginTop: SCREENHEIGHT/40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 6,
      // elevation: 8,
      marginHorizontal: SCREENHEIGHT/7.3,
      marginTop: SCREENHEIGHT/30,
      marginBottom: 15
  },
  timer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREENHEIGHT/12,
  },
  header: {
    fontFamily:'Mohave-Medium',
    fontSize: 45,
    // lineHeight: 25,
    letterSpacing: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: SCREENHEIGHT/9,
    marginBottom: SCREENHEIGHT/150,
  },
  inputBox: {
      fontFamily:'Mohave-Light',
      fontSize: 20,
      height: 40,
      borderWidth: 1,
      paddingHorizontal: 7, 
      paddingVertical: 5,
      marginTop: SCREENHEIGHT/500,   
      marginHorizontal: SCREENHEIGHT/20,
      backgroundColor: '#FFFFFF', 
      // textContentType: 'name',
  }, 
  text: {
      fontFamily:'Mohave-Light',
      fontSize: 20,
      color: '#FFFFFF',
      marginTop: SCREENHEIGHT/100,   
      marginHorizontal: SCREENHEIGHT/20,
  }, 
  buttonText: {
      fontFamily:'Mohave-Bold',
      fontSize: 23,
      fontWeight: 'bold',
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#303030',
  },
  switch: {
      marginTop: SCREENHEIGHT/75,
      marginLeft: SCREENWIDTH/10,
      alignItems: 'center',
      justifyContent: 'center',   
      marginLeft: SCREENHEIGHT/20,
      marginRight: SCREENHEIGHT/5000,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
  }, 
  dropdown: {
      marginTop: SCREENHEIGHT/500,   
      marginLeft: SCREENHEIGHT/20,
      marginRight: SCREENHEIGHT/20,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 0,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    item: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
    placeholderStyle: {
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
    selectedTextStyle: {
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
});

export default PomodoroTimer;
