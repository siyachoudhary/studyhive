import React, { Component,useState } from 'react';
import { StyleSheet, Text, ScrollView, StatusBar, Dimensions, View, Pressable} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// importing components from other files
import Timer from '../timer.js';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const PomodoroTimer = () => {

    const [isPlaying, setPlaying] = useState(false)
    const [cycles, setCycles] = useState(0)
    const [key, setKey] = useState(0)
    const [time, setTime] = useState(300)
    const children = ({ remainingTime }) => {
      const minutes = Math.floor(remainingTime / 60)
      const seconds = ("0" + (remainingTime % 60)).slice(-2)
    
      return `${minutes}:${seconds}`
    }

    return (
      // <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
      //   <StatusBar barStyle='dark-content' />
      //   <Text style={[styles.text, styles.boxShadow]}>Work Timer</Text>
      //   <Timer/>
      // </ScrollView>
      <View style={styles.backGround}>
        <Text style={styles.header}>BEE TIME</Text>
        <Text style={[styles.text, {textAlign: 'center', fontSize: 26, fontWeight:'500', letterSpacing: 1}]}>WORK SESSION</Text>
        <View style={styles.container}>
          <CountdownCircleTimer
            key={key}
            style={styles.timer}
            isPlaying={isPlaying}
            duration={time}
            size={270}
            strokeWidth={18}
            strokeLinecap={'butt'}
            colors="#EDA73A"
            onComplete={() => {
              // do your stuff here
              setCycles(cycles => cycles+1)
              return { shouldRepeat: true, delay: 1.5 } // repeat animation in 1.5 seconds
            }}
            // children = {({ remainingTime }) => {
            //   const minutes = Math.floor(remainingTime / 60)
            //   const seconds = remainingTime % 60
            //   console.log('minutes')
            //   return `${minutes}:${seconds}`
            // }}
            >

            {({remainingTime}) => <Text style={[styles.buttonText, {color: "#FFFFFF", fontSize: 60}]}>{children({remainingTime})}</Text>}
            </CountdownCircleTimer>
        </View>
        
        <View style={{flexDirection: "row"}}>
          <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginRight: SCREENHEIGHT/150, paddingHorizontal: 8}]} 
                    onPress={() =>
                      // setTime(600) +
                      setKey(key => key+1)}
                    >
                <AntDesign name={'banckward'} size={28}/>
            </Pressable>
          {/* <View style={{flexDirection: "column"}}> */}
            <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginHorizontal: SCREENHEIGHT/100, paddingHorizontal: 6}]} 
                    onPress={() =>
                      setPlaying(isPlaying => !isPlaying)}
                    >
                {/* <Text style={[styles.buttonText, {letterSpacing: 0}]}>▐▐ </Text> */}
                <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={38}/>
            </Pressable>
          {/* </View>
          <View style={{flexDirection: "column"}}> */}
            <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button, {marginLeft: SCREENHEIGHT/150, paddingHorizontal: 8}]} 
                    // onPress={}
                    >
                <AntDesign name={'forward'} size={28}/>
            </Pressable>
          {/* </View> */}
        </View>

        <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button, {marginHorizontal: SCREENHEIGHT/8}]} 
                // onPress={handleSubmit(submit)}
                >
            <Text style={styles.buttonText}> EXIT POMODORO </Text>
          </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  backGround: {
    resizeMode: 'cover',
    height: SCREENHEIGHT,
    width: SCREENWIDTH,
    backgroundColor: "#2F2F2F"
  },
  container: {
    marginTop: SCREENHEIGHT/20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 6,
      // elevation: 8,
      marginHorizontal: SCREENHEIGHT/7.3,
      marginTop: SCREENHEIGHT/30,
      marginBottom: 15
  },
  timer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREENHEIGHT/9,
  },
  header: {
    fontFamily:'Mohave-Medium',
    fontSize: 45,
    // lineHeight: 25,
    letterSpacing: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: SCREENHEIGHT/9,
    marginBottom: SCREENHEIGHT/150,
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
      marginTop: SCREENHEIGHT/100,   
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
      marginTop: SCREENHEIGHT/75,
      marginLeft: SCREENWIDTH/10,
      alignItems: 'center',
      justifyContent: 'center',   
      marginLeft: SCREENHEIGHT/20,
      marginRight: SCREENHEIGHT/5000,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
  }, 
  dropdown: {
      marginTop: SCREENHEIGHT/500,   
      marginLeft: SCREENHEIGHT/20,
      marginRight: SCREENHEIGHT/20,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 0,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    item: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
    placeholderStyle: {
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
    selectedTextStyle: {
      fontSize: 20,
      fontFamily:'Mohave-Light',
    },
});

export default PomodoroTimer;
