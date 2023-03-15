import * as React from "react";
import { StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  let value = undefined
  async function retrieveData(){
    try {
        value = await AsyncStorage.getItem('user')
        console.log(value)
        const obj = JSON.parse(value);
        if(value !== null) {
          console.log(obj.name)
        }
      } catch(e) {
        console.log(e.message)
      }
  }
    const navigation = useNavigation();

    async function getStarted(){
      await retrieveData()
      console.log(value)
      if(value==undefined){
        navigation.navigate("Sign In")
      }else{
        navigation.navigate("Home")
      }
    }

    return (
      <View>
        <ImageBackground source={require('../assets/images/welcomeScreen2.png')} style={styles.image}>
          <Pressable 
            style={({pressed}) => [
            {
              backgroundColor: pressed ? '#EDA73A': '#ffab00',
            },
            styles.button]} 
            onPress={getStarted}
          >
            <Text style={styles.buttonText}> GET STARTED </Text>
          </Pressable>
        </ImageBackground>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    image: {
      resizeMode: 'cover',
      height: SCREENHEIGHT,
      width: SCREENWIDTH,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 6,
      // elevation: 8,
      marginHorizontal: SCREENWIDTH - SCREENWIDTH/1.4,
      marginTop: SCREENHEIGHT - SCREENHEIGHT/6.5,
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
  
  export default WelcomeScreen;
  