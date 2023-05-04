import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput, Switch} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from './BaseUrl';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';
import { useIsFocused } from '@react-navigation/native'
import { max } from 'moment';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
let logDays = [];
let logFull = {};
let fakeLogFull = {};
let lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const LogHour = () => {    
    const navigation = useNavigation();
    const baseURL = BaseURL;
    // const isFocused = useIsFocused()

    // useEffect(() => {
    //     if(isFocused){
    //       console.log("is focused on log page")

    //     }
    //   }, [isFocused])

    const [hourErr, setHourErr] = useState("")
    const [dateErr, setDateErr] = useState("")
    // const [email, setEmail] = useState("")

    let tomorrow = JSON.stringify(new Date(new Date().setDate(new Date().getDate() + 1)));
    let nextyear = tomorrow.slice(1, 5);
    let nextmonth = tomorrow.slice(6, 8);
    let nextday =  tomorrow.slice(9, 11);
    let maxDate = `${nextyear}-${nextmonth}-${nextday}`;
    console.log("max date: " + maxDate)
    const [open, setOpen] = useState(false);
    const [date1, setDate1] = useState(new Date());
    let user;
    let email = "";

    const {control, handleSubmit, errors, reset} = useForm({
        'topic': '',
        'hours': '',
        'date': ''
    })

    
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

    async function submit(data){
        await loadLog();
        await retrieveData();
        await getLifeTimeHours();
        await getCurrentStreak();
        await getLongestStreak();
        
        let date = date1;
        console.log(date)
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth()+1)).slice(-2); 
        var year = date.getFullYear();
        let newTask = {
            topic: data.topic, 
            hours: data.hours,
            date: `${year}-${month}-${day}`, 

        }
    //     console.log("log in: " +baseURL)
    //         let email = data.email
    //         const password = data.password

            if(newTask.hours==undefined || parseFloat(newTask.hours) == 0){
                console.log("duration of study required")
                setHourErr("DURATION OF STUDY REQUIRED")
                setDateErr("")
                return
            }
            if(parseFloat(newTask.hours) >= 24){
                console.log("TOO MUCH")
                setHourErr("HOURS LOGGED MUST BE UNDER 24")
                setDateErr("")
                return
            }
            if(newTask.date==undefined){
                console.log("date required")
                setDateErr("PLEASE ENTER A DATE FOR YOUR LOG")
                setHourErr("")
                return
            }
            if(newTask.topic==undefined){
                newTask.topic = "Other"
            }

        setDateErr("")
        setHourErr("") 
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

        lifetimeHours += parseFloat(newTask.hours);
        updateLifeTimeHours(lifetimeHours);
        // console.log((Object.keys(ordered)[0]).slice(8))
        findStreaks(ordered)
        updateCurrentStreak(currentStreak)
        updateLongestStreak(longestStreak)
        // console.log(ordered)


        // console.log(logFull)
        await storeLog(JSON.stringify(logFull))

        navigation.navigate("calendarScreen")
        // storeData(JSON.stringify(newTask))
    }

    const findStreaks = (ordered) => {
        console.log('FIND STREAKS')
        console.log(ordered)
        let now = JSON.stringify(new Date())
        let year = now.slice(1, 5);
        let month = now.slice(6, 8);
        let day =  now.slice(9, 11);
        let newDate = `${year}-${month}-${day}`;
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

    // const storeData = async (value) => {
    //     try {
    //       await AsyncStorage.setItem('studyDays', value)
    //       console.log("saved study days")
    //       loadArray();
    //     } catch (e) {
    //       // saving error
    //       console.log(e.message)
    //     }
    // }

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

    // function loadArray() {
    //     AsyncStorage.getItem("studyDays").then(value => {
    //       if(value != null){
    //         logDays = JSON.parse(value);
    //         console.log('loaded study days')
    //       }
    //     }).catch(err => {
    //       console.log(err.message);  
    //     })
    // }

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

    return(
        <View style={styles.backGround}>
            <Text style={styles.header}>LOG STUDY TIME</Text>

            <Text style={[styles.text, {marginTop: SCREENHEIGHT/40}]}>TOPIC:</Text>
            <Controller
            control={control}
            name='topic'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                    value={value}
                    onChangeText={value=>onChange(value)}
                    />
                )
            }> </Controller>

    <Text style={[styles.text, {marginTop: SCREENHEIGHT/40}]}>HOURS:</Text>
        <Controller
                control={control}
                name='hours'
                render={
                    ({field:{onChange, value}})=>(
                        <TextInput style={[styles.inputBox]}
                        value={value}
                        onChangeText={value=>onChange(value)}
                        keyboardType='numeric'
                        maxLength={3}
                    //    value={password}
                       />
                    )
                }> </Controller>
    <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{hourErr}</Text>

            
    <Text style={styles.text}>DATE:</Text>
            <Controller
            control={control}
            name='date'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                       value={date1.toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"})}
                       onPressIn={() => setOpen(true)}
                       onChangeText={value=>onChange(value)}
                    />
                )}> 
            </Controller>
            <Controller
                control={control}
                name='date'
                render={
                    ({field:{onChange, value}})=>(
                        <DatePicker
                        modal
                        mode='date'
                        open={open}
                        date={date1}
                        maximumDate={new Date(maxDate)}
                        onConfirm={(date1) => {
                        setOpen(false)
                        setDate1(date1)
                        }}
                        onCancel={() => {
                        setOpen(false)
                        }}
                    />
                    )}> 
            </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{dateErr}</Text>

         <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> LOG STUDY TIME </Text>
          </Pressable>
          <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginTop: SCREENHEIGHT/40}]} 
                    onPress={()=>
                        navigation.navigate("calendarScreen")
                    }
                    >
                <Text style={[styles.buttonText]}> BACK TO CALENDAR </Text>
        </Pressable>      
        </View>
    );
};

const styles = StyleSheet.create({
    backGround: {
        resizeMode: 'cover',
        height: SCREENHEIGHT,
        width: SCREENWIDTH,
        backgroundColor: "#2F2F2F"
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 6,
        // elevation: 8,
        marginHorizontal: SCREENHEIGHT/9,
        marginTop: SCREENHEIGHT/25,
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
          marginTop: SCREENHEIGHT/150,   
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
          marginTop: SCREENHEIGHT/30,
          marginLeft: SCREENWIDTH/14,
          alignItems: 'center',
          justifyContent: 'center',
      }, 
      dropdown: {
          marginTop: SCREENHEIGHT/500,   
          marginLeft: SCREENHEIGHT/20,
          marginRight: SCREENHEIGHT/5000,
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
          paddingBottom: 5,
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

export default LogHour;