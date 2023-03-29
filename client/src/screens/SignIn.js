import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";

import {useForm, Controller} from "react-hook-form"
import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const SignIn = () => {
    const baseURL = "http://192.168.1.87:3000/"
    const navigation = useNavigation();

    const [passErr, setPassErr] = useState("")
    const [emailErr, setEmailErr] = useState("")

    const {control, handleSubmit, errors, reset} = useForm({
        'email': '',
        'password': '',
    })

    function submit(data){
            let email = data.email
            const password = data.password

            if (email.includes(' ')) {
                email = email.trim(); 
            }


            if(email==undefined){
                console.log("email required")
                setEmailErr("PLEASE ENTER AN EMAIL")
                setPassErr("")
                return
            }
            if(password==undefined){
                console.log("pasword required")
                setPassErr("PLEASE ENTER A PASSWORD")
                setEmailErr("")
                return
            }

        axios
        .post(`${baseURL}login`, {
            email: email.toLowerCase(),
            password: password,
        })
        .then(function (response) {
            // handle success
            console.log(JSON.stringify(response.data));
            setEmailErr("")
            setPassErr("")
            storeData(JSON.stringify(response.data))
            navigation.navigate("HomeFirst")
            reset()
        })
        .catch(function (error) {
            // handle error
            // console.log(error.message);

            if(error.message=='Request failed with status code 400'){
                console.log("wrong password")
                setPassErr("INCORRECT PASSWORD")
                setEmailErr("")
            }
            if(error.message=='Request failed with status code 404'){
                console.log("email does not exist")
                setEmailErr("THIS EMAIL DOES NOT EXIST")
                setPassErr("")
            }
        });
        
    }

    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('user', value)
          console.log("stored data")
        } catch (e) {
          // saving error
          console.log(e.message)
        }
      }

    return(
        <View style={styles.backGround}>
            <Text style={styles.header}>SIGN IN</Text>

            <Text style={styles.text}>EMAIL:</Text>
            <Controller
            control={control}
            name='email'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                    value={value}
                    onChangeText={value=>onChange(value)}
                    />
                )
            }> </Controller>

    <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{emailErr}</Text>

    

    <Text style={styles.text}>PASSWORD:</Text>
        <Controller
                control={control}
                name='password'
                render={
                    ({field:{onChange, value}})=>(
                        <TextInput style={[styles.inputBox]}
                        value={value}
                       onChangeText={value=>onChange(value)}
                    //    value={password}
                       secureTextEntry={true}/>
                    )
                }> </Controller>

    <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{passErr}</Text>

            

            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> SIGN IN </Text>
          </Pressable>
            <Pressable onPress={()=>navigation.navigate("Sign Up")}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 16}]}>DON'T HAVE AN ACCOUNT? SIGN UP</Text>
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
      marginTop: SCREENHEIGHT/4,
      marginBottom: 15
    },
    header: {
      fontFamily:'Mohave-Bold',
      fontSize: 45,
      fontWeight: 'bold',
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
});

export default SignIn;