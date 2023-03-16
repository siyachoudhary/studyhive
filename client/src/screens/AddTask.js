import * as React from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable, TextInput, Switch} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
import {useForm, Controller} from "react-hook-form"
import DatePicker from 'react-native-date-picker'
import { getCalendarDateString } from "react-native-calendars/src/services";

// import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const AddTask = () => {
    const navigation = useNavigation();

    const [open, setOpen] = React.useState(false);
    const [date1, setDate1] = React.useState(new Date());
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    const {control, handleSubmit, errors, reset} = useForm({
        'title': "",
        'notes': "",
        'subject': "",
        'date': date1,
        'doRemind': false,
    })

    return (
        <View style={styles.backGround}>
            <Text style={styles.header}>NEW TASK</Text>

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

            <Text style={styles.text}>NOTES:</Text>
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

            <Text style={styles.text}>SUBJECT:</Text>
            <Controller
            control={control}
            name='subject'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                       value={value}
                       onChangeText={value=>onChange(value)}
                    />
                )
            }> </Controller>

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
                      setDate(date1)
                    }}
                    onCancel={() => {
                      setOpen(false)
                    }}
                  />
                )}> 
            </Controller>

            <View style={{ flexDirection: "row" }}>
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
                                onValueChange={value=>onChange(value)}
                            />
                    )}> 
                </Controller>  
            </View>

            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                // onPress={onPress}
            >
                <Text style={styles.buttonText}> ADD TASK </Text>
            </Pressable>

            <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginTop: SCREENHEIGHT/40}]} 
                    // onPress={onPress}
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
      marginTop: SCREENHEIGHT/12,
    },
    header: {
      fontFamily:'Mohave-Medium',
      fontSize: 45,
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: SCREENHEIGHT/9,
      marginBottom: SCREENHEIGHT/40,
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
        marginTop: SCREENHEIGHT/60,   
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
    }
});

export default AddTask;