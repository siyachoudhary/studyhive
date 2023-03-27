import React, {useState, useEffect, useRef} from 'react';

import axios from "axios";
import {StyleSheet, View, Dimensions, Text, Pressable, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const Requests = () => {
    const baseURL = "http://192.168.1.85:3000/"
    const navigate = useNavigation()
    const dataFetchedRef = useRef(false);
    const [user, setUser] = useState(null)

    const [reqsData, setReqsData] = useState([]);

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
    
      let friendsFound = false;
    
      useEffect(()=>{
        retrieveData()
        if (dataFetchedRef.current) return;
           if(!friendsFound){
            getUserFriends()
           }
      })

    const getUserFriends = async ()=>{
        if(user!=null){
         await axios
            .get(`${baseURL}getFriendReqs/${user._id}`)
            .then(function (res) {
                getUserNames(res.data.users)
                dataFetchedRef.current = true;
            })
            .catch(function (err) {
                // handle error
                console.log("error: "+err.message);
            });
          }
      }

      const getUserNames = async(data)=>{
        const friends = [];
        for(var i = 0; i<data.length; i++){
          await axios
            .get(`${baseURL}findUser/${data[i]}`)
            .then(function (res) {
                friends.push(res.data)
            })
            .catch(function (err) {
                // handle error
                console.log("error: "+err.message);
            });
        }
        friendsFound=true
        setReqsData(friends)
      }

    const accept = () =>{
        console.log("pressed")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollingView}>
            {reqsData.map((listItem) => {
                    return (
                        <View style={{flexDirection: "row", marginVertical: 10}}>
                            <View>
                                <Text style={styles.invite}>{listItem.name}</Text>
                                <Text style={styles.invite}>{listItem.email}</Text>
                            </View>
                        
                        <Pressable onPress={accept} style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#EDA73A': '#ffab00',
                            }, styles.button2]}>
                            <Text style={styles.buttonText2}>Accept</Text>
                        </Pressable>
                        <Pressable onPress={accept} style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#EDA73A': '#ffab00',
                            }, styles.button3]}>
                            <Text style={styles.buttonText2}>X</Text>
                        </Pressable>
                    </View>
                    );
                })}
                
            </ScrollView>
            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                onPress={()=>navigate.navigate("profileScreen")}
                >
            <Text style={styles.buttonText}> BACK TO PROFILE </Text>
          </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
      resizeMode: 'cover',
      height: SCREENHEIGHT,
      width: SCREENWIDTH,
    },
    scrollingView:{
        padding:(SCREENWIDTH - 50)/12,
        marginTop: 50,
        width: '100%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 6,
      // elevation: 8,
      marginHorizontal: SCREENWIDTH/10,
      marginTop: SCREENHEIGHT/1.8,
    },
    buttonText: {
      fontFamily:'Mohave-Bold',
      fontSize: 23,
      fontWeight: 'bold',
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#303030',
    },
    container: {
        flex: 1,
        backgroundColor: "#2F2F2F",
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
      button2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 6,
        position: 'absolute',
        right: 40,
      },
      button3: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 6,
        position: 'absolute',
        right: 0,
      },
      buttonText2: {
        fontFamily:'Mohave-Bold',
        fontSize: 15,
        fontWeight: 'bold',
        // lineHeight: 25,
        letterSpacing: 1,
        color: '#303030',
    },
    invite:{
        color: 'white',
        fontFamily:'Mohave-Bold',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
  });

export default Requests;