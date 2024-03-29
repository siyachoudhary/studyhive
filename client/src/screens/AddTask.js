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

const AddTask = ({route}) => {

    const navigation = useNavigation();
    const {digit} = route.params;
    let arr = {};

    console.log('you have gone to task')

    console.log(done)

    if(digit == "no"){
        done = true;
        isThere = false;
        item = {};
    } else if (!done){
        console.log(digit)
        done = true
        isThere = true;
        loadArray();
    }

    function loadArray() {
        AsyncStorage.getItem("recentArray").then(value => {
          if(value != null){
            arr = JSON.parse(value);
            console.log('loaded array')
            console.log(arr)
            findItem();
          }
        }).catch(err => {
          console.log(err.message);  
        })
    }

    function findItem(){
        for (let i = 0; i < Object.keys(arr).length; i++) {
            let initialDay = arr[Object.keys(arr)[i]][0].day;
            for (let j = 0; j < arr[initialDay].length; j++) {
                if(arr[initialDay][j].digit == digit){
                    item = JSON.parse(JSON.stringify(arr[initialDay][j]));
                    console.log(item)
                    updateStates();
                    done = true;
                    return;
                }
            }
        }
    }
    
    function updateStates(){
        setValue('title', item.name)
        setValue('notes', item.notes)
        setValue('type', item.type)
        setValue('importance', item.importance)
        setValue('doRemind', item.doRemind)
        setValue('remind', item.remind)
        setIsEnabled(item.doRemind)
    
        let date2 = item.day
        let time = item.time

        let year = date2.slice(0, 4) * 1;
        let month = date2.slice(5, 7) * 1 - 1;
        let day = date2.slice(8) * 1;
        let hours = time.substring(0, time.indexOf(":")) * 1;
        let minutes = time.substring(time.indexOf(":") + 1, time.indexOf(" ")) * 1;
        if(time.includes('PM')){
            hours += 12;            
        }
        setDate1(new Date(year, month, day, hours, minutes))
        console.log('done')
    }

    const [open, setOpen] = React.useState(false);
    const [date1, setDate1] = React.useState(new Date());
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    const [titleErr, setTitleErr] = React.useState("");
    const [dateErr, setDateErr] = React.useState("");

    const {control, handleSubmit, errors, register, setValue} = useForm(
        {
        'title': "",
        'notes': "",
        'type': "",
        'importance': "",
        'date': date1,
        'remind': "",
        'doRemind': false,
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

    const dueReminder = [
        { label: '1 minute before', value: '1' },
        { label: '5 minutes before', value: '2' },
        { label: '10 minutes before', value: '3' },
        { label: '30 minutes before', value: '4' },
        { label: '1 hour before', value: '5' },
    ]

    function submit(data){
        console.log()
        let date = date1;
        console.log(date)
        console.log(date1.getUTCHours());
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth()+1)).slice(-2); 
        var year = date.getFullYear();
        var hours = date.getHours()
        var minutes =  ('0' + date.getMinutes()).slice(-2);
        let num;

        if(!data.doRemind){
            setValue('remind', "")
            console.log("1 " + item.remind)
            if(item.remind != undefined){
                PushNotificationIOS.removePendingNotificationRequests([item.digit])
            }
        } else {
            console.log("2 " + item.remind)
            if(item.remind != undefined){
                PushNotificationIOS.removePendingNotificationRequests([item.digit])
            }
            let placeholderMinutes = minutes
            let placeholderHours = hours

            let notificationText = `${data.title} is due now!`

            if(data.remind==1){
                if(placeholderMinutes!=0){
                    placeholderMinutes-=1
                }else{
                    if(placeholderHours!=0){
                        placeholderHours-=1
                    }else{
                        placeholderHours=23
                    }
                    placeholderMinutes=59
                }
                notificationText = `${data.title} is due in 1 minute!`
            }else if(data.remind==2){
                if(placeholderMinutes<5){
                    if(placeholderHours!=0){
                        placeholderHours-=1
                    }else{
                        placeholderHours=23
                    }
                    placeholderMinutes=60-(5-placeholderMinutes)
                }else{
                    placeholderMinutes-=5
                }
                notificationText = `${data.title} is due in 5 minutes!`
            }else if(data.remind==3){
                
                if(placeholderMinutes<10){
                    if(placeholderHours!=0){
                        placeholderHours-=1
                    }else{
                        placeholderHours=23
                    }
                    placeholderMinutes=60-(10-placeholderMinutes)
                }else{
                    placeholderMinutes-=10
                }

                console.log("FN:",placeholderMinutes)

                notificationText = `${data.title} is due in 10 minutes!`
            }else if(data.remind==4){
                if(placeholderMinutes<30){
                    if(placeholderHours!=0){
                        placeholderHours-=1
                    }else{
                        placeholderHours=23
                    }
                    placeholderMinutes=60-(30-placeholderMinutes)
                }else{
                    placeholderMinutes-=30
                }
                notificationText = `${data.title} is due in 30 minutes!`
            }else if(data.remind==5){
                if(placeholderHours!=0){
                    placeholderHours-=1
                }else{
                    placeholderHours=23
                }
                notificationText = `${data.title} is due in 1 hour!`
            }

            console.log("FIREDATE:", `${year}-${month}-${day}T${placeholderHours}:${placeholderMinutes}:00`)

            PushNotificationIOS.addNotificationRequest({
                id: data.digit,
                fireDate: new Date(`${year}-${month}-${day}T${placeholderHours}:${placeholderMinutes}:00`),
                title:"StudyHive Upcoming Task",
                subtitle: notificationText
              })
        }

        if(!item.digit){
            num = Math.random().toString(36).substring(2,10);
        } else {
            num = item.digit
            console.log(item.digit)
        }
        var period = '';
        if(hours > 12){
            hours -= 12;
            period = "PM"
        } else {
            if(hours == 12){
                period = "PM"
            }
            if(hours < 12){
                period = "AM"
                if(hours == 0){
                    hours += 12
                }
            }
        }

        console.log(`${year}-` + month + `-` + day)
        let newTask = {
            title: data.title, 
            type: data.type,
            notes: data.notes, 
            importance: data.importance,
            date: `${year}-${month}-${day}`, 
            time: `${hours}:${minutes} ` + period,
            doRemind: data.doRemind,
            remind: data.remind,
            digit: num
        }

        console.log(newTask)

        if(newTask.title==undefined || newTask.title == ''){
            console.log("title required")
            setTitleErr("PLEASE ENTER AN TITLE FOR YOUR TASK")
            setDateErr("")
            return
        }

        if(newTask.date==undefined){
            console.log("date required")
            setDateErr("PLEASE ENTER A DUE DATE FOR YOUR TASK")
            setTitleErr("")
            return
        }

        if(newTask.notes==undefined){
            newTask.notes=''
        }
        
        if(newTask.type==undefined){
            newTask.type='7'
        }

        if(newTask.importance==undefined){
            newTask.importance=''
        }

        if(newTask.remind==undefined){
            console.log('fuckthishitbitch');
            newTask.remind=''
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
        console.log('this is owrkikng ')
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
            <Text style={styles.header}>{isThere ? 'EDIT' : 'NEW'} TASK</Text>

            <Text style={styles.text}>TITLE:</Text>
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
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red", marginTop:0}]}>{titleErr}</Text>

            <Text style={[styles.text, {marginTop: -SCREENHEIGHT/1000}]}>NOTES:</Text>
            <Controller
            control={control}
            name='notes'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox, {height: 70}]}
                       value={value}
                       onChangeText={value=>onChange(value)}
                       multiline={true}
                    />
                )
            }> </Controller>

            <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column"}}>
                    <Text style={[styles.text, {marginRight: SCREENHEIGHT/8.5}]}>TYPE:</Text>
                    <Controller
                    control={control}
                    name='type'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconColor={styles.iconStyle}
                                data={data2}
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
                </View>
                <View style={{flexDirection: "column"}}>
                    <Text style={[styles.text, {marginLeft: SCREENHEIGHT/60}]}>IMPORTANCE:</Text>
                    <Controller
                    control={control}
                    name='importance'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={[styles.dropdown, {marginLeft: SCREENHEIGHT/60, marginRight: -SCREENHEIGHT/70}]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={ranking}
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
                </View>
            </View>

            <Text style={styles.text}>DUE DATE:</Text>
            <Controller
            control={control}
            name='date'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                       value={date1.toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric"})}
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

            {/* <View style={{ flexDirection: "row", marginTop: -SCREENHEIGHT/30}}>
                <Text style={[styles.text, {marginTop: SCREENHEIGHT/25}]}>REMINDER NOTIFICATION:</Text>
                <Controller
                    control={control}
                    name='doRemind'
                    render={
                        ({field:{onChange, value}})=>(
                            <Switch
                                value={value}
                                style={styles.switch}
                                trackColor={{false: '#767577', true: '#EDA73A'}}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={
                                    value=>onChange(value)
                                }
                            />
                    )}> 
                </Controller>  
            </View> */}

<View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column"}}>
                    <Text style={[styles.text, {marginRight: SCREENHEIGHT/15}]}>REMINDER:</Text>
                    <Controller
                    control={control}
                    name='doRemind'
                    render={
                        ({field:{onChange, value}})=>(
                            <Switch
                                value={value}
                                style={styles.switch}
                                trackColor={{false: '#767577', true: '#EDA73A'}}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={
                                    value=>onChange(value, toggleSwitch())
                                        // setIsEnabled(!isEnabled)
                                }
                            />
                    )}> 
                </Controller>  
                </View>

                {isEnabled?
                <View style={{flexDirection: "column"}}>
                    <Text style={[styles.text, {marginLeft: SCREENHEIGHT/60}]}>REMIND TIME:</Text>
                    <Controller
                    control={control}
                    name='remind'
                    render={
                        ({field:{onChange, value}})=>(
                            <Dropdown
                                style={[styles.dropdown, {marginLeft: SCREENHEIGHT/60, marginRight: -SCREENHEIGHT/70}]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={dueReminder}
                                // search
                                maxHeight={150}
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
                </View>:null}
            </View>

            <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: SCREENHEIGHT/1.2, marginLeft: SCREENWIDTH/20, position:'absolute'}}>
                    <Pressable 
                        style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#EDA73A': '#ffab00',
                        },
                        styles.button]} 
                        onPress={handleSubmit(submit)}
                    >
                        <Text style={styles.buttonText}>{isThere ? 'UPDATE' : 'ADD'} TASK</Text>
                    </Pressable>
                    <Pressable 
                            style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#EDA73A': '#ffab00',
                            },
                            styles.button]} 
                            onPress={()=>
                                navigation.navigate("calendarScreen") +
                                (done = false)
                            }
                            >
                        <Text style={[styles.buttonText]}> BACK TO CALENDAR </Text>
                    </Pressable>
        </View>

            {/* <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'column'}}>
                    <Pressable 
                        style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#EDA73A': '#ffab00',
                        },
                        styles.button]} 
                        onPress={handleSubmit(submit)}
                    >
                        <Text style={styles.buttonText}>{isThere ? 'UPDATE' : 'ADD'} TASK</Text>
                    </Pressable>
                </View>
            
                <View style={{flexDirection:'column'}}>
                    <Pressable 
                            style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#EDA73A': '#ffab00',
                            },
                            styles.button, {marginTop: SCREENHEIGHT/40}]} 
                            onPress={()=>
                                navigation.navigate("calendarScreen") +
                                (done = false)
                            }
                            >
                        <Text style={[styles.buttonText]}> BACK TO CALENDAR </Text>
                    </Pressable>
            </View>
            </View> */}
            
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
        marginHorizontal: SCREENHEIGHT/80,
        marginVertical: SCREENHEIGHT/100,
        width:150
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
        fontSize: 15,
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

export default AddTask;