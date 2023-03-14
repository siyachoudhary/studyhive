import * as React from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable, TextInput, Button} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const Home = () => {
    const navigation = useNavigation();

    return(
        <View>
            <ImageBackground source={require('../assets/images/homeBackGround.png')} style={styles.image}>
                <Text style={styles.header}>HEY, STUDY BEE</Text>
                <Text style={styles.text}>WELCOME BACK TO STUDYHIVE!</Text>
                <View
                    style={{borderBottomColor: 'white', 
                            borderBottomWidth: SCREENHEIGHT/860,   
                            marginHorizontal: SCREENWIDTH/10,
                            marginTop: SCREENWIDTH/20,
                            marginBottom: SCREENWIDTH/12,}}
                />
                <Text style={styles.text}>YOU HAVEN'T LOGGED A STUDY SESSION</Text>
                <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                // onPress={onPress}
                >
                    <Text style={styles.buttonText}> START A HIVE{'\n'}SESSION </Text>
                </Pressable>
                <Text style={[styles.text, {fontWeight: '500', marginTop: SCREENHEIGHT/20, fontSize: 30}]}>LET'S GET BEE-ZY!</Text>
            </ImageBackground>
        </View>
    );
}

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
      borderRadius: 150,
      // elevation: 8,
      marginHorizontal: SCREENWIDTH/5.7,
      marginTop: SCREENHEIGHT/25,
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