import React, {useState, useEffect, useRef} from 'react';

import { StyleSheet, View, Dimensions, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddFriends = () => {
  const baseURL = "http://192.168.1.85:3000/"
    const [searchTxt, setSearchTxt] = useState("")
  
    const [list,setList] = useState([])

    const navigate = useNavigation()

    const dataFetchedRef = useRef(false);
    const [user, setUser] = useState(null)

    async function retrieveData(){
        try {
            const value = await AsyncStorage.getItem('user')
            const obj = JSON.parse(value);
            if(value !== null) {
              setUser(obj)
              dataFetchedRef.current= true
            }
          } catch(e) {
            console.log(e.message)
          }
      }

    useEffect(()=>{
      retrieveData()
      if (dataFetchedRef.current) return;
    })

    useEffect(()=>{
      console.log("searching")
        getData()
        // getFriends()
    }, [searchTxt])

    const getData = async () =>{
      if(user!=null){
        await axios
        .get(`${baseURL}getUsers/${searchTxt}`)
        .then(function (res) {
            getFriends(res.data.users.filter(friendUser => friendUser._id != user._id))
        })
        .catch(function (err) {
            console.log("error: "+ err.message);
        });
      }
    }

    const getFriends = async(data1)=>{
      await axios
        .get(`${baseURL}findFriends/${user.email}`)
        .then(function (res) {
          filtered = data1
          console.log(filtered)
          for(var i = 0; i<res.data.length; i++){
            filtered = filtered.filter(friendUser => friendUser._id != res.data[i])
          }
          setList(filtered)
        })
        .catch(function (err) {
            // handle error
            console.log("error: "+err.message);
        });
    }

    const sendRequest = async (friendReqId)=>{
      console.log(friendReqId._id)
      await axios
      .post(`${baseURL}addFriendReq/${friendReqId._id}`, {
        "friendReq": user._id
      })
      .then(function (res) {
          console.log(res.data)
      })
      .catch(function (err) {
          // handle error
          console.log("error: "+ err.message);
      });
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>FIND FRIENDS</Text>
        <TextInput style={[styles.inputBox]}
            // value={value}
            onChangeText={(value) => setSearchTxt(value)}
        />

            <ScrollView style={styles.scrollingView} contentContainerStyle={{ flexGrow: 1 }}>
            {list.map((listItem) => {
                // console.log(listItem)
                    return (
                            <View key={listItem._id}
                                style={{
                                marginHorizontal: (SCREENWIDTH - 50)/23,
                                marginVertical: (SCREENWIDTH - 50)/100,
                                padding:(SCREENWIDTH - 50)/23,
                                backgroundColor: '#aaa',
                                flexDirection: "row"
                            }}>

                                <View>
                                  <Text style={[{textAlign: "left"}, styles.buttonText2]}>{listItem.name}</Text>
                                  <Text style={[{textAlign: "left"}, styles.buttonText3]}>{listItem.email}</Text>
                                </View>

                                <Pressable 
                                        style={({pressed}) => [
                                        {
                                            backgroundColor: pressed ? '#EDA73A': '#ffab00',
                                        },
                                        styles.button2]} 
                                        onPress={()=>sendRequest(listItem)}
                                        >
                                    <Text style={styles.buttonText2}> Send Request </Text>
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
        // marginTop: SCREENHEIGHT/500,
        // backgroundColor: "#aaa",
        // height: SCREENHEIGHT,
        padding:(SCREENWIDTH - 50)/12,
        transform: [{translateY: 220}],
        top: 10,
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        bottom: 350
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
        right: 10,
        top: 10,
        bottom: 10
      },
      buttonText2: {
        fontFamily:'Mohave-Bold',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#303030',
      },
      buttonText3: {
        fontFamily:'Mohave-Bold',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
        color: '#303030',
      },
  });
  
  export default AddFriends;
  