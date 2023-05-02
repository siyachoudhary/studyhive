import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput, Switch} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseURL } from './BaseUrl';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
let logDays = [];
let logFull = {};
let fakeLogFull = {};

const LogHour = () => {    
    const navigation = useNavigation();

    const [hourErr, setHourErr] = useState("")
    const [dateErr, setDateErr] = useState("")

    const [open, setOpen] = React.useState(false);
    const [date1, setDate1] = React.useState(new Date());
    const [user, setUser] = useState(null)

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
              setUser(obj)
            }
          } catch(e) {
            console.log(e.message)
          }
    }

    // let lifetimeHours; 
    // const getLifeTimeHours = async () =>{
    //     if(!(!user)){
    //       await axios
    //          .get(`${BaseURL}getLifeTimeHours/${user._id}`)
    //          .then(function (res) {
    //             lifetimeHours = res.data.lifetimeHours
    //             console.log('lifetime')
    //             console.log(lifetimeHours)
    //          })
    //          .catch(function (err) {
    //              // handle error
    //              console.log("error: "+err.message);
    //          });
    //        }
    // }

    async function submit(data){
        await loadLog();
        await retrieveData();
        // await getLifeTimeHours();

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

            if(newTask.hours==undefined){
                console.log("duration of study required")
                setHourErr("DURATION OF STUDY REQUIRED")
                setDateErr("")
                return
            }
            if(parseInt(newTask.hours) >= 24){
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

        console.log(logFull)
        await storeLog(JSON.stringify(logFull))

        navigation.navigate("calendarScreen")
        // storeData(JSON.stringify(newTask))
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