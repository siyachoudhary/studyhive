import * as React from "react";
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput, Switch} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-element-dropdown';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from "@react-native-community/push-notification-ios";


const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
let done = false;
let item = {};
let isThere;

const StartPomodoro = () => {

    const navigation = useNavigation();
    // const {digit} = route.params;
    // let arr = {};

    // console.log('you have gone to task')

    // console.log(done)

    // if(digit == "no"){
    //     done = true;
    //     isThere = false;
    //     item = {};
    // } else if (!done){
    //     console.log(digit)
    //     done = true
    //     isThere = true;
    //     loadArray();
    // }

    // function loadArray() {
    //     AsyncStorage.getItem("recentArray").then(value => {
    //       if(value != null){
    //         arr = JSON.parse(value);
    //         console.log('loaded array')
    //         console.log(arr)
    //         findItem();
    //       }
    //     }).catch(err => {
    //       console.log(err.message);  
    //     })
    // }

    // function findItem(){
    //     for (let i = 0; i < Object.keys(arr).length; i++) {
    //         let initialDay = arr[Object.keys(arr)[i]][0].day;
    //         for (let j = 0; j < arr[initialDay].length; j++) {
    //             if(arr[initialDay][j].digit == digit){
    //                 item = JSON.parse(JSON.stringify(arr[initialDay][j]));
    //                 console.log(item)
    //                 updateStates();
    //                 done = true;
    //                 return;
    //             }
    //         }
    //     }
    // }
    
    // function updateStates(){
    //     setValue('title', item.name)
    //     setValue('notes', item.notes)
    //     setValue('type', item.type)
    //     setValue('importance', item.importance)
    
    //     let date2 = item.day
    //     let time = item.time

    //     let year = date2.slice(0, 4) * 1;
    //     let month = date2.slice(5, 7) * 1 - 1;
    //     let day = date2.slice(8) * 1;
    //     let hours = time.substring(0, time.indexOf(":")) * 1;
    //     let minutes = time.substring(time.indexOf(":") + 1, time.indexOf(" ")) * 1;
    //     if(time.includes('PM')){
    //         hours += 12;            
    //     }
    //     setDate1(new Date(year, month, day, hours, minutes))
    //     console.log('done')
    // }

    const [open, setOpen] = React.useState(false);
    const [date1, setDate1] = React.useState(new Date());
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    const [pomodoroErr, setPomodoroErr] = React.useState("");
    const [shortErr, setShortErr] = React.useState("");
    const [longErr, setLongErr] = React.useState("");
    const [afterErr, setAfterErr] = React.useState("");

    const {control, handleSubmit, errors, register, setValue} = useForm(
        {
        'title': "",
        'pomodoro': "",
        'short': "",
        'long': "",
        'after': "",
        // 'notes': "",
        // 'type': "",
        // 'importance': "",
        // 'date': date1,
        // 'time': "",
        // 'doRemind': false,
    })

    const data2 = [
        //blue
        { label: 'Work', value: '1' },
        //orange
        { label: 'Exercise', value: '2' },
        //yellow
        { label: 'School', value: '3' },
        //brown
        { label: 'Chores', value: '4' },
        //green
        { label: 'Extracurriculars', value: '5' },
        //purple
        { label: 'Personal', value: '6' },
        //white
        { label: 'Other', value: '7' },
    ]

    const ranking = [
        { label: 'Major', value: '1' },
        { label: 'Moderate', value: '2' },
        { label: 'Minor', value: '3' },
    ]

    const pomodoroLength = [
        { label: '15 Minutes', value: '1' },
        { label: '20 Minutes', value: '2' },
        { label: '25 Minutes', value: '3' },
        { label: '30 Minutes', value: '4' },
        { label: '35 Minutes', value: '5' },
        { label: '40 Minutes', value: '6' },
        { label: '45 Minutes', value: '7' },
        { label: '50 Minutes', value: '8' },
        { label: '55 Minutes', value: '9' },
        { label: '60 Minutes', value: '10' },
    ]

    const shortBreak = [
        { label: '5 Minutes', value: '1' },
        { label: '10 Minutes', value: '2' },
        { label: '15 Minutes', value: '3' },
        { label: '20 Minutes', value: '4' },
        { label: '25 Minutes', value: '5' },
        { label: '30 Minutes', value: '6' },
    ]


    const longBreak = [
        { label: '10 Minutes', value: '1' },
        { label: '15 Minutes', value: '2' },
        { label: '20 Minutes', value: '3' },
        { label: '25 Minutes', value: '4' },
        { label: '30 Minutes', value: '5' },
    ]

    const longAfter = [   
        { label: '2 Pomodoros', value: '1' },
        { label: '4 Pomodoros', value: '2' },
        { label: '6 Pomodoros', value: '3' },
    ]

    function submit(data){
        // if(data.doRemind){

        //     let placeholderMinutes = minutes
        //     let placeholderHours = hours

        //     let notificationText = `${data.title} is due now!`

        //     if(data.time==1){
        //         if(placeholderMinutes!=0){
        //             placeholderMinutes-=1
        //         }else{
        //             if(placeholderHours!=0){
        //                 placeholderHours-=1
        //             }else{
        //                 placeholderHours=23
        //             }
        //             placeholderMinutes=59
        //         }
        //         notificationText = `${data.title} is due in 1 minute!`
        //     }else if(data.time==2){
        //         if(placeholderMinutes<5){
        //             if(placeholderHours!=0){
        //                 placeholderHours-=1
        //             }else{
        //                 placeholderHours=23
        //             }
        //             placeholderMinutes=60-(5-placeholderMinutes)
        //         }else{
        //             placeholderMinutes-=5
        //         }
        //         notificationText = `${data.title} is due in 5 minutes!`
        //     }else if(data.time==3){
                
        //         if(placeholderMinutes<10){
        //             if(placeholderHours!=0){
        //                 placeholderHours-=1
        //             }else{
        //                 placeholderHours=23
        //             }
        //             placeholderMinutes=60-(10-placeholderMinutes)
        //         }else{
        //             placeholderMinutes-=10
        //         }

        //         console.log("FN:",placeholderMinutes)

        //         notificationText = `${data.title} is due in 10 minutes!`
        //     }else if(data.time==4){
        //         if(placeholderMinutes<30){
        //             if(placeholderHours!=0){
        //                 placeholderHours-=1
        //             }else{
        //                 placeholderHours=23
        //             }
        //             placeholderMinutes=60-(30-placeholderMinutes)
        //         }else{
        //             placeholderMinutes-=30
        //         }
        //         notificationText = `${data.title} is due in 30 minutes!`
        //     }else if(data.time==5){
        //         if(placeholderHours!=0){
        //             placeholderHours-=1
        //         }else{
        //             placeholderHours=23
        //         }
        //         notificationText = `${data.title} is due in 1 hour!`
        //     }

        //     console.log("FIREDATE:", `${year}-${month}-${day}T${placeholderHours}:${placeholderMinutes}:00`)

        //     PushNotificationIOS.addNotificationRequest({
        //         id: data.title,
        //         fireDate: new Date(`${year}-${month}-${day}T${placeholderHours}:${placeholderMinutes}:00`),
        //         title:"StudyHive Upcoming Task",
        //         subtitle: notificationText
        //       })
        // }
        let newPomodoro = {
            title: data.title, 
            pomodoro: data.pomodoro,
            short: data.short, 
            length: data.length,
            after: data.after,
        }

        // if(newTask.title==undefined || newTask.title == ''){
        //     console.log("title required")
        //     setTitleErr("PLEASE ENTER AN TITLE FOR YOUR TASK")
        //     setDateErr("")
        //     return
        // }

        if(newPomodoro.pomodoro==undefined || newPomodoro.pomodoro == ''){
            console.log("Pomodoro DURATION Required")
            setPomodoroErr("PLEASE ENTER POMODORO DURATION FOR BEE TIME")
            setShortErr("")
            setLongErr("")
            setAfterErr("")
            return
        }

        if(newPomodoro.short==undefined || newPomodoro.short == ''){
            console.log("Pomodoro DURATION Required")
            setShortErr("PLEASE ENTER SHORT BREAK DURATION FOR BEE TIME")
            setPomdoroErr("")
            setLongErr("")
            setAfterErr("")
            return
        }

        if(newPomodoro.long==undefined || newPomodoro.long == ''){
            console.log("Pomodoro duration Required")
            setLongErr("PLEASE ENTER LONG BREAK DURATION FOR BEE TIME")
            setShortErr("")
            setPomodoroErr("")
            setAfterErr("")
            return
        }

        if(newPomodoro.after==undefined || newPomodoro.after == ''){
            console.log("Pomodoro duration Required")
            setAfterErr("PLEASE ENTER LONG BREAK AFTER FOR BEE TIME")
            setShortErr("")
            setLongErr("")
            setPomdoroErr("")
            return
        }

        // axios
        // .post('http://localhost:3000/login', {
        //     title: title,
        //     notes: notes,
        //     subject: subject, 
        //     date: date, 
        //     doRemind: doRemind
        // })
        // .then(function (response) {
        //     // handle success
        //     console.log(JSON.stringify(response.data));
        //     setTitleErr("")
        //     setDateErr("")
        //     storeData(JSON.stringify(response.data))
        //     navigation.navigate("CalendarPage")
        //     reset()
        // })
        // .catch(function (error) {
        //     // handle error
        //     console.log(error.message);
        // });
        setTitleErr("")
        setDateErr("")
        storeData(JSON.stringify(newTask))
        done = false;
        navigation.navigate("calendarScreen", {
            edit: isThere
        });
    }

    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('newTask', value)
          console.log("stored data")
        } catch (e) {
          // saving error
          console.log(e.message)
        }
    }

    const renderItem = item => {
        return (
          <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === value}
          </View>
        );
      };

    return (
        <View style={styles.backGround}>
            <Text style={styles.header}>START BEE TIME</Text>

            <Text style={styles.text}>TOPIC:</Text>
            <Controller
            control={control}
            name='title'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                       value={value}
                       onChangeText={value=>onChange(value)}
                    //    value={name}
                    //    autoCapitalize='words'
                       />
                )
            }> </Controller>
            {/* <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{titleErr}</Text> */}

            <Text style={[styles.text]}>POMODORO DURATION:</Text>
            <Controller
                    control={control}
                    name='pomodoro'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconColor={styles.iconStyle}
                                data={pomodoroLength}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Item"
                                value={value}
                                onChange={item => {
                                onChange(item.value);
                                }}
                                renderItem={renderItem}
                            />
                        )
                    }> </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{pomodoroErr}</Text>

            <Text style={[styles.text]}>SHORT BREAK DURATION:</Text>
            <Controller
                    control={control}
                    name='short'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconColor={styles.iconStyle}
                                data={shortBreak}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Item"
                                value={value}
                                onChange={item => {
                                onChange(item.value);
                                }}
                                renderItem={renderItem}
                            />
                        )
                    }> </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{shortErr}</Text>

            <Text style={[styles.text]}>LONG BREAK DURATION:</Text>
            <Controller
                    control={control}
                    name='long'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconColor={styles.iconStyle}
                                data={longBreak}
                                // search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Item"
                                value={value}
                                onChange={item => {
                                onChange(item.value);
                                }}
                                renderItem={renderItem}
                            />
                        )
                    }> </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{longErr}</Text>

            <Text style={[styles.text]}>LONG BREAK AFTER:</Text>
            <Controller
                    control={control}
                    name='after'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconColor={styles.iconStyle}
                                data={longAfter}
                                // search
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Item"
                                value={value}
                                onChange={item => {
                                onChange(item.value);
                                }}
                                renderItem={renderItem}
                            />
                        )
                    }> </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{afterErr}</Text>

          <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> START POMODORO </Text>
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
        marginTop: SCREENHEIGHT/30,
        marginBottom: 15
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

export default StartPomodoro;