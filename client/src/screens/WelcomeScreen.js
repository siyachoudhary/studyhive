import * as React from "react";
import { StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const WelcomeScreen = () => {
    const navigation = useNavigation();
  
    return (
      <View>
        <ImageBackground source={require('../assets/images/welcomeScreen2.png')} style={styles.image}>
          <Pressable 
            style={({pressed}) => [
            {
              backgroundColor: pressed ? '#EDA73A': '#ffab00',
            },
            styles.button]} 
            // onPress={onPress}
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
  