import * as React from "react";

import axios from "axios";
import { SafeAreaView, StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable, TextInput, Button, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";
// import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import {useForm, Controller} from "react-hook-form"

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const SignUp = () => {
    const navigation = useNavigation();
    // const [name, onChangeName] = React.useState('');
    // // const [username, onChangeUsername] = React.useState('');
    // const [email, onChangeEmail] = React.useState('');
    // const [password, onChangePassword] = React.useState('');
    // const [confirm, onChangeConfirm] = React.useState('');

    const {control, handleSubmit, errors, reset} = useForm({
        'name': '',
        'email': '',
        'password': '',
        'confirm': '',
    })

    function submit(data){
        if(data.password != data.confirm){
            console.log("passwords do not match")
        }else{
            const name = data.name
            const email = data.email
            const password = data.password

            // const configuration = {
            //     method: "post",
            //     url: "https://localhost:3000/register",
            //     data: {
            //         name,
            //         email,
            //         password,
            //     },
            // };
            // axios(configuration)
            // .then((result) => {
            //     console.log("registered!")
            //   })
            //   .catch((error) => {
            //     error = new Error();
            //     console.log("error")
            //   });

            axios
        .post('http://localhost:3000/register', {
            name: name,
            email: email,
            password: password,
        })
        .then(function (response) {
            // handle success
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            // handle error
            console.log(error.message);
        });

            // reset()
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

          <Text style={[styles.text, {textAlign: "center", fontSize: 16}]}>ALREADY HAVE AN ACCOUNT? SIGN IN</Text>
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
      marginTop: SCREENHEIGHT/9,
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

export default SignUp;