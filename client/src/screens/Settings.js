import React, {useState, useEffect, useRef} from 'react';

import axios from "axios";
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput, Button, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
var ImagePicker = require('react-native-image-picker');

import { BaseURL } from './BaseUrl';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
const baseURL = BaseURL

const Settings = () => {

    const navigation = useNavigation();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [user, setUser] = useState("")

    const [nameErr, setNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")

    const dataFetchedRef = useRef(false);

    const {control, handleSubmit, errors, reset} = useForm({
        'name': "",
        'email': "",
    })

    async function submit(data){

          // console.log(data.email)
          // console.log(data.name)

            let nameUpdate = data.name
            let emailUpdate = data.email

            if(emailUpdate!=undefined){
                if (emailUpdate.includes(' ')) {
                    emailUpdate = emailUpdate.trim(); 
                }
            }

      // console.log(photoChanged)
      if(photoChanged){
        // handleUpload()
        await fetch(`${baseURL}api/upload`, {
          method: "POST",
          body: createFormData(photo, photoType, photoFileName, { userId: user._id })
        })
          .then(response => response.json())
          .then(response => {
            console.log("upload success", response);
            // alert("New Image Uploaded");
          })
          .catch(error => {
            console.log("upload error", error);
            // alert("Upload failed!");
          });
      }
      
      if(emailUpdate!=undefined){
        console.log(emailUpdate)
        axios
      .post(`${baseURL}checkDuplicates/${emailUpdate.toLowerCase()}`)
      .then(function (response) {
          console.log(response.data.message)
          if(response.data.message=="user found successfully"){
            console.log("email found")
            setEmailErr("YOUR SUGGESTED EMAIL WAS BEING USED BY ANOTHER USER")
            setNameErr("")
            reset() 
            return
          }
      })
      .catch(function (err) {
          // handle error
          console.log("no duplicates found");

          
      });
    }

      // else{
      //   setEmailErr("")
      //   setNameErr("")
      //   navigation.navigate("profileScreen")
      // }

      if(nameUpdate==undefined){
        nameUpdate = name
      }
      if(emailUpdate==undefined){
          emailUpdate = email
      }


        axios
        .post(`${baseURL}updateUser/${email}`, {
            name: nameUpdate,
            email: emailUpdate.toLowerCase(),
            userId: user._id
        })
        .then(function (response) {
            // handle success
            console.log(JSON.stringify(response.data));
            setEmailErr("")
            setNameErr("")
            storeData(JSON.stringify(response.data))
            
        })
        .catch(function (err) {
            // handle error
            console.log(err);
        });
        reset()        
    }

    const [photo, setPhoto] = useState(null)
    const [photoType, setPhotoType] = useState(null)
    const [photoFileName, setPhotoFileName] = useState(null)
    const [photoChanged, setPhotoChanged] = useState(null)

    async function retrieveData(){
        try {
            const value = await AsyncStorage.getItem('user')
            const obj = JSON.parse(value);
            if(value !== null) {
              setUser(obj)

              if(photo==null){
                setPhoto(`${baseURL}images/${obj.profile}`)
              }
              dataFetchedRef.current=true
              // console.log(obj)
            }
          } catch(e) {
            console.log(e.message)
          }
      }
      useEffect(()=>{
        if (dataFetchedRef.current) return;
        retrieveData()
        setName(user.name)
        setEmail(user.email)
      })

    const storeData = async (value) => {
      console.log(value)
        try {
          await AsyncStorage.setItem('user', value)
          navigation.navigate("profileScreen")
          return
        } catch (e) {
          // saving error
          console.log(e.message)
        }
    }

    function logout(){
        AsyncStorage.removeItem('user')
        PushNotificationIOS.removeAllPendingNotificationRequests();

        navigation.navigate("Welcome Screen")
    }

    function deleteProfile(){
        axios
        .post(`${baseURL}deleteUser/${email}`)
        .then(function (response) {
            // handle success
            // console.log(JSON.stringify(response.data));
            AsyncStorage.clear
            PushNotificationIOS.removeAllPendingNotificationRequests();
            navigation.navigate("Welcome Screen")
        })
        .catch(function (err) {
            // handle error
            console.log(err.message);
        });
    }

    handleChoosePhoto = () => {
      const options = {
        noData: true,
      }
      console.log("choosing photo")
      ImagePicker.launchImageLibrary(options, response => {
        if (response && !response.didCancel) {
          setPhotoChanged(true)
          setPhotoType(response.assets[0].type)
          setPhotoFileName(response.assets[0].fileName)
          setPhoto(response.assets[0].uri)
        }
      })
    }

    handleUpload = async () => {
        await fetch(`${baseURL}api/upload`, {
          method: "POST",
          body: createFormData(photo, photoType, photoFileName, { userId: user._id })
        })
          .then(response => response.json())
          .then(response => {
            console.log("upload success", response);
            // profileImgChanged = response
            alert("New Image Uploaded");
            // this.setState({ photo: null });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
          });
      };

    return (
        <View style={styles.backGround}>
            <Text style={styles.header}>EDIT INFORMATION</Text>
            {/* <ImageUpload userIdProp={user._id} starterImage={profileImgStart}/> */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            {photo && (
              <React.Fragment>
                <Image
                  source={{ uri: photo }}
                  style={{ width: 150, height: 150, borderRadius:150/2 }}
                />
                {/* <Button title="Upload" onPress={this.handleUpload} /> */}
              </React.Fragment>
            )}

            <Button title="Choose Photo" onPress={this.handleChoosePhoto} />

          </View>
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
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{nameErr}</Text>

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
            <Text style={[styles.text, {textAlign: "left", fontSize: 15, color:"red"}]}>{emailErr}</Text> 

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

          <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={()=>navigation.navigate("profileScreen")}
                >
            <Text style={styles.buttonText}> BACK TO PROFILE </Text>
          </Pressable>

          <Pressable onPress={logout}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 20,  marginTop: 30}]}>LOGOUT</Text>
            </Pressable>   

            <Pressable onPress={deleteProfile}>
                <Text style={[styles.text, {textAlign: "center", fontSize: 20, color:"red", marginTop: 10}]}>DELETE PROFILE</Text>
            </Pressable> 
        </View>
    );
};

const styles = StyleSheet.create({
    backGround: {
      resizeMode: 'cover',
      height: SCREENHEIGHT,
      width: SCREENWIDTH,
      backgroundColor: "#2F2F2F",
    //   justifyContent:'center',
    //   alignItems:'center',
    //   width:'100%'
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 6,
      // elevation: 8,
      marginHorizontal: SCREENHEIGHT/9,
      marginTop: SCREENHEIGHT/45,
    },
    buttonTextUpload: {
        fontFamily:'Mohave-Bold',
        fontSize: 13,
        fontWeight: 'bold',
        // lineHeight: 25,
        letterSpacing: 1,
        color: '#303030',
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
        // marginTop: SCREENHEIGHT/60,   
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
    uploadBtn:{
        height:125,
        width:125,
        alignSelf:'center',
        borderRadius:125/2,
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor:'gray',
        borderStyle:'dashed',
        borderWidth: 1, 
        borderColor:'white',
        margin:25,
        padding:10
    }
});

export default Settings;

  const createFormData = (photo, photoType, photoFileName, body) => {
    const data = new FormData();
  
    data.append("photo", {
      name: photoFileName,
      type: photoType,
      uri:
        Platform.OS === "android" ? photo : photo.replace("file://", "")
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };