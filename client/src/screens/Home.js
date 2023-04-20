import React, {useEffect, useState} from "react";
import {StyleSheet, View, ImageBackground, Dimensions, Text, Pressable} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

let studyLogFull = {};
let now2;
let obj; 
let studyTopics = {};

const Home = () => {
    const navigation = useNavigation();
    const [displayText, setDisplayText] = useState("YOU HAVEN'T LOGGED A STUDY SESSION");
    const [bottomText, setBottomText] = useState("LET'S GET BEE-ZY!");
    const [buttonStyle, setButtonStyle] = useState(styles.button)
    const [buttonText, setButtonText] = useState(styles.buttonText)
    const [accButtonText, setAccButtonText] = useState("START A HIVE\nSESSION")
    const [renderOther, setRenderOther] = useState(false)
    const [hours, setHours] = useState(0)
    const [extra, setExtra] = useState("")
    const [extra2, setExtra2] = useState("")
    const [main, setMain] = useState("")
    const [margin, setMargin] = useState(SCREENHEIGHT/20)

    useFocusEffect(
      React.useCallback(() => {
        loadStudyLog()
      }, [loadStudyLog])
    );

    useEffect(()=>{
        const retrieveData = async () => {
          try {
              value = await AsyncStorage.getItem('user')
              // console.log(value)
              if(value!=undefined){
                navigation.navigate("Home")
              }
            } catch(e) {
              console.log(e.message)
            }
        }
    
        retrieveData()
      })

      const useForceUpdate = () => {
        const [state, setState] = React.useState(true)
        const forceUpdate = React.useCallback(() => {
          setState(s => !s)
        }, [])
      
        return forceUpdate
      }
      
    async function loadStudyLog() {
      await AsyncStorage.getItem("studyLog").then(value => {
          if(value != null){
            studyLogFull = JSON.parse(value);
            console.log('loaded study log 2')
            console.log(studyLogFull)
            sortLog()
          }
        }).catch(err => {
          console.log(err.message);  
        })
    }

    function sortLog(){
      obj = [];
      studyTopics = [];
      // studyLogDays = []
      for (let i = 0; i < Object.keys(studyLogFull).length; i++) {
        let daynum = studyLogFull[Object.keys(studyLogFull)[i]][0].date;
        console.log(daynum)
        let now = JSON.stringify(new Date())
        let year = now.slice(1, 5);
        let month = now.slice(6, 8);
        let day =  now.slice(9, 11);
        let newDate = `${year}-${month}-${day}`;
        let accHours = 0;
        console.log(newDate)
        if(daynum == newDate){
          console.log('hello')
          for (let j = 0; j < studyLogFull[daynum].length; j++) {
              if(!Object.keys(obj).length){
                obj = [JSON.parse(JSON.stringify(studyLogFull[daynum][j]))]
                studyTopics = [JSON.parse(JSON.stringify(studyLogFull[daynum][j].topic))]
                // accHours = studyLogFull[daynum][j].hours * 1
                console.log('hello1')
              } else {
                obj.push(JSON.parse(JSON.stringify(studyLogFull[daynum][j])))
                accHours += (studyLogFull[daynum][j].hours * 1);
                let name = JSON.parse(JSON.stringify(studyLogFull[daynum][j].topic))
                if(!studyTopics.includes(name)){
                  studyTopics.push(JSON.parse(JSON.stringify(studyLogFull[daynum][j].topic)))
                }
                // setHours(accHours += (studyLogFull[daynum][j].hours * 1))
                // const i = obj.findIndex(e => e.topic === studyLogFull[daynum][j].topic);
                // if (i > -1) {
                //   obj[i].hours += studyLogFull[daynum][j].hours
                // } else {
                //   obj.push(JSON.parse(JSON.stringify(studyLogFull[daynum][j])))
                // }
              }

          }
        // studyLogDays.push(daynum)
          accHours += (studyLogFull[daynum][0].hours * 1)
          setDisplayText((new Date()).toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"}) + " - Study Log")
          setBottomText("KEEP ON BUZZ-ING!")
          setButtonStyle(styles.button2)
          setButtonText(styles.buttonText2)
          setAccButtonText('START A HIVE SESSION')
          setRenderOther(true)
          setHours(accHours)
          setExtra("HOURS")
          if(studyTopics.length>1){
            setExtra2("Topics: ")
          } else {
            setExtra2("Topic: ")
          }
          setMain((JSON.stringify(studyTopics)).slice(2, -2))
          setMargin(SCREENHEIGHT/40)
        }

        console.log(hours)
        console.log('hello')
      console.log(obj)
       
    }
  }

  const renderInfo = () => {
    console.log('length')
    console.log(Object.keys(obj).length)
    console.log(obj)
    if(Object.keys(obj).length == 1){
      return(
        <Text style={[styles.text, {fontWeight: '300'}]}> {hours} {extra}</Text>
      );
    } else {
      return(
        <Text style={[styles.text, {fontWeight: '300'}]}> BYE</Text>
      );
    }
  };

  // const renderExtra = () => {
  //   if(renderOther){
  //     return(
  //       <Text style={[styles.text, {fontWeight: '500', fontSize: 40, marginTop: SCREENHEIGHT/60}]}>{hours} HOURS</Text>

  //       <View
  //           style={{borderBottomColor: 'white', 
  //                   borderBottomWidth: SCREENHEIGHT/860,   
  //                   marginHorizontal: SCREENWIDTH/10,
  //                   marginTop: SCREENWIDTH/20,
  //                   marginBottom: SCREENWIDTH/40,}}
  //         />

  //     <Text style={[styles.text, {fontSize: 26, marginTop: SCREENHEIGHT/100}]}>BREAKDOWN</Text>
  //     <View style={{flexDirection:'row', justifyContent: 'center'}}>
  //       <Text style={[styles.text, {fontSize: 24, marginTop: SCREENHEIGHT/100, marginRight: SCREENWIDTH/7, color: "#FFAF33"}]}>TOPIC</Text>
  //       <Text style={[styles.text, {fontSize: 24, marginTop: SCREENHEIGHT/100, marginLeft: SCREENWIDTH/7, color: "#FFAF33"}]}>HOURS</Text>
  //     </View>
  //     );
  //   }
  // };

  
  return(
      <View style={{flex: 1}}>
          <ImageBackground source={require('../assets/images/homeBackGround.png')} style={styles.image}>
              <Text style={styles.header}>HEY, STUDY BEE</Text>
              <Text style={styles.text}>WELCOME BACK TO STUDYHIVE!</Text>
              <View
                  style={{borderBottomColor: 'white', 
                          borderBottomWidth: SCREENHEIGHT/860,   
                          marginHorizontal: SCREENWIDTH/10,
                          marginTop: SCREENWIDTH/20,
                          marginBottom: SCREENWIDTH/20,}}
              />
              <Text style={styles.text}>{displayText}</Text>

              <Text style={[styles.text, {fontWeight: '500', fontSize: 40, marginTop: SCREENHEIGHT/60, marginBottom: SCREENHEIGHT/1000}]}>{hours} {extra}</Text>
              <Text style={[styles.text, {fontWeight: '100', fontSize: 30, marginTop: -SCREENHEIGHT/500, marginBottom: SCREENHEIGHT/1000}]}>{extra2} {main}</Text>

              {/* {renderOther()} */}

              <Pressable 
              style={({pressed}) => [
              {
                  backgroundColor: pressed ? '#EDA73A': '#ffab00',
              },
              buttonStyle]} 
              onPress={()=>navigation.navigate("Hive Session")}
              >
                  <Text style={styles.buttonText}> {accButtonText} </Text>
              </Pressable>
              <Text style={[styles.text, {fontWeight: '500', marginTop: margin, fontSize: 30}]}>{bottomText}</Text>
          </ImageBackground>
          
      </View>
    );
  }
  //  else {
  //   return(
  //     <View>
  //         <ImageBackground source={require('../assets/images/homeBackGround.png')} style={styles.image}>
  //             <Text style={styles.header}>HEY, STUDY BEE</Text>
  //             <Text style={styles.text}>WELCOME BACK TO STUDYHIVE!</Text>
  //             <View
  //                 style={{borderBottomColor: 'white', 
  //                         borderBottomWidth: SCREENHEIGHT/860,   
  //                         marginHorizontal: SCREENWIDTH/10,
  //                         marginTop: SCREENWIDTH/20,
  //                         marginBottom: SCREENWIDTH/12,}}
  //             />
  //             <Text style={styles.text}>{(new Date()).toLocaleString('en-En',{weekday: "long", month: "long", day: "numeric"}) + " - Study Log"}</Text>

  //             {renderInfo()}

  //             <Pressable 
  //             style={({pressed}) => [
  //             {
  //                 backgroundColor: pressed ? '#EDA73A': '#ffab00',
  //             },
  //             styles.button2]} 
  //             onPress={()=>navigation.navigate("Hive Session")}
  //             >
  //                 <Text style={styles.buttonText2}> START A HIVE SESSION </Text>
  //             </Pressable>
  //             <Text style={[styles.text, {fontWeight: '500', marginTop: SCREENHEIGHT/20, fontSize: 30}]}>KEEP ON BUZZING!</Text>
  //         </ImageBackground>
          
  //     </View>
  //   );
  // }


const styles = StyleSheet.create({
    image: {
      resizeMode: 'cover', 
      height: SCREENHEIGHT,
      width: SCREENWIDTH,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: "center",
      width: 255,
      height: 255,
    //   padding: 10,
      borderRadius: 255/2,
      // elevation: 8,
      marginHorizontal: SCREENWIDTH/5.7,
      marginTop: -SCREENHEIGHT/14,
    },
    button2: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: "center",
      width: 255,
      height: 255,
    //   padding: 10,
      borderRadius: 255/2,
      // elevation: 8,
      marginHorizontal: SCREENWIDTH/5.7,
      marginTop: SCREENHEIGHT/30,
    },
    buttonText2: {
        fontFamily:'Mohave-Bold',
        fontSize: 20,
        fontWeight: 'bold',
        // lineHeight: 25,
        letterSpacing: 1,
        color: '#303030',
    },
    header: {
      fontFamily:'Mohave-Medium',
      fontSize: 43,
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: SCREENHEIGHT/7.8,
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
        textAlign: "center",
        fontSize: 22,
        color: '#FFFFFF',
        marginTop: SCREENHEIGHT/100,   
        marginHorizontal: SCREENHEIGHT/20,
    }, 
    buttonText: {
        fontFamily:'Mohave-Bold',
        textAlign: "center",
        fontSize: 30,
        fontWeight: 'bold',
        // lineHeight: 25,
        letterSpacing: 1,
        color: '#303030',
    },
});

export default Home;