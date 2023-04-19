import React, {useState} from 'react';

import axios from "axios";
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
import signUpBadge from "../assets/images/Badges/New.png"

import { BaseURL } from './BaseUrl';

const SignUp = () => {
    const baseURL = BaseURL

    const navigation = useNavigation();

    const [nameErr, setNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passErr, setPassErr] = useState("")
    const [confirmErr, setConfirmErr] = useState("")

    const {control, handleSubmit, errors, reset} = useForm({
        'name': "",
        'email': "",
        'password': "",
        'confirm': "",
    })

    function submit(data){

        if(data.password != data.confirm){
            console.log("passwords do not match")
            setNameErr("")
            setEmailErr("")
            setPassErr("")
            setConfirmErr("PASSWORDS DO NOT MATCH")
        }else{
            let name = data.name
            let email = data.email
            let password = data.password

            if (email.includes(' ')) {
                email = email.trim(); 
            }

            if ( !email.includes('@')&& !email.includes('.')) {
                setNameErr("")
                setEmailErr("PLEASE ENTER A VALID EMAIL")
                setPassErr("")
                setConfirmErr("") 
                return
            }

            if (password.includes(' ')) {
                setNameErr("")
                setEmailErr("")
                setPassErr("PASSWORD CANNOT CONTAIN ANY SPACES")
                setConfirmErr("") 
                return
            }

            if(password.length<6){
                setNameErr("")
                setEmailErr("")
                setPassErr("PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG")
                setConfirmErr("")
                return
            }


            if(name==undefined){
                console.log("name required")
                setNameErr("NAME IS REQUIRED")
                setEmailErr("")
                setPassErr("")
                setConfirmErr("")
                return
            }
            if(email==undefined){
                console.log("email required")
                setNameErr("")
                setEmailErr("EMAIL IS REQUIRED")
                setPassErr("")
                setConfirmErr("")
                return
            }
            if(password==undefined){
                console.log("pasword required")
                setNameErr("")
                setEmailErr("")
                setPassErr("PASSWORD IS REQUIRED")
                setConfirmErr("")
                return
            }

            axios
        .post(`${baseURL}register`, {
            name: name,
            email: email.toLowerCase(),
            password: password,
            imgProfile: 'blankProfile.png'
        })
        .then(function (response) {
            // handle success
            console.log(response);
            setNameErr("")
                setEmailErr("")
                setPassErr("")
                setConfirmErr("")
            storeData(JSON.stringify(response.data))
            
            axios.post(`${baseURL}addBadge/${response.data._id}`, {
                badge: "newBee"
            }).then(function(response){
                console.log("badge added")
            })

            navigation.navigate("HomeFirst")
            reset()
        })
        .catch(function (err) {
            // handle error
            setNameErr("")
                setEmailErr("THIS EMAIL IS LINKED TO ANOTHER USER")
                setPassErr("")
                setConfirmErr("")
            console.log(err.message);
        });
    }
    }

    const storeData = async (value) => {
        try {
            console.log(value)
          await AsyncStorage.setItem('user', value)
          console.log("stored data")
        } catch (e) {
          // saving error
          console.log(e.message)
        }
      }

    return (
        <View style={styles.backGround}>
            <Text style={styles.header}>SIGN UP</Text>

            <Text style={styles.text}>NAME:</Text>
            <Controller
            control={control}
            name='name'
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
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{nameErr}</Text>

            <Text style={styles.text}>EMAIL:</Text>
            <Controller
            control={control}
            name='email'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                    value={value}
                    onChangeText={value=>onChange(value)}
                    // value={email}
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
            

            <Text style={styles.text}>CONFIRM PASSWORD:</Text>
            <Controller
                control={control}
                name='confirm'
                render={
                    ({field:{onChange, value}})=>(
                        <TextInput style={[styles.inputBox]}
                        value={value}
                       onChangeText={value=>onChange(value)}
                    //    value={confirm}
                       secureTextEntry={true}/>
                    )
            }> </Controller>
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{confirmErr}</Text>

            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> CREATE ACCOUNT </Text>
          </Pressable>

            <Pressable onPress={()=>navigation.navigate("Sign In")}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 16}]}>ALREADY HAVE AN ACCOUNT? SIGN IN</Text>
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
      marginTop: SCREENHEIGHT/20,
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
    //   marginBottom: SCREENHEIGHT/100,
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

export default SignUp;