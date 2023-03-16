import React, {useState, useEffect, useRef} from 'react';

import axios from "axios";
import { SafeAreaView, StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable, TextInput, Button, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
// import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import {useForm, Controller} from "react-hook-form"

import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const Settings = () => {
    const navigation = useNavigation();

    const {control, handleSubmit, errors, reset} = useForm({
        'name': "",
        'email': "",
    })

    function submit(data){
            let nameUpdate = data.name
            let emailUpdate = data.email

            if(emailUpdate!=undefined){
                if (emailUpdate.includes(' ')) {
                    emailUpdate = emailUpdate.trim(); 
                }
            }

            // console.log(nameUpdate+" " + emailUpdate)
            if(nameUpdate==undefined){
                nameUpdate = name
            }
            if(emailUpdate==undefined){
                emailUpdate = email
            }

        axios
        .post(`http://localhost:3000/updateUser/${email}`, {
            name: nameUpdate,
            email: emailUpdate.toLowerCase(),
        })
        .then(function (response) {
            // handle success
            // console.log(JSON.stringify(response.data));
            
            storeData(JSON.stringify(response.data))
            navigation.navigate("Profile")
        })
        .catch(function (err) {
            // handle error
            console.log(err.message);
        });
            reset()        
    }

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [user, setUser] = useState("")

    async function retrieveData(){
        try {
            const value = await AsyncStorage.getItem('user')
            const obj = JSON.parse(value);
            if(value !== null) {
              setUser(obj)
            }
          } catch(e) {
            console.log(e.message)
          }
      }
      useEffect(()=>{
        retrieveData()
        setName(user.name)
        setEmail(user.email)
      })

    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('user', value)
        } catch (e) {
          // saving error
          console.log(e.message)
        }
    }

    function logout(){
        AsyncStorage.removeItem('user')
        navigation.navigate("Welcome Screen")
    }

    function deleteProfile(){
        axios
        .post(`http://localhost:3000/deleteUser/${email}`)
        .then(function (response) {
            // handle success
            // console.log(JSON.stringify(response.data));
            
            AsyncStorage.clear
            navigation.navigate("Welcome Screen")
        })
        .catch(function (err) {
            // handle error
            console.log(err.message);
        });
    }

    return (
        <View style={styles.backGround}>
            <Text style={styles.header}>EDIT INFORMATION</Text>

            <Text style={styles.text}>NAME:</Text>
            <Controller
            control={control}
            name='name'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                        defaultValue={name}
                        value={value}
                       onChangeText={value=>onChange(value)}
                    />
                )
            }> </Controller>

            <Text style={styles.text}>EMAIL:</Text>
            <Controller
            control={control}
            name='email'
            render={
                ({field:{onChange, value}})=>(
                    <TextInput style={[styles.inputBox]}
                    value={value}
                    defaultValue={email}
                    onChangeText={value=>onChange(value)}
                    />
                )
            }> </Controller>

            <Pressable onPress={logout}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 25,  marginTop: SCREENHEIGHT/3}]}>LOGOUT</Text>
            </Pressable>   

            <Pressable onPress={deleteProfile}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 25, color:"red", marginTop: 10}]}>DELETE PROFILE</Text>
            </Pressable>  
    

    {/* <Text style={styles.text}>PASSWORD:</Text>
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
            }> </Controller> */}

            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> SAVE DATA </Text>
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
});

export default Settings;