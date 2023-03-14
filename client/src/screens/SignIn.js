import * as React from "react";
import { SafeAreaView, StyleSheet, View, ImageBackground, Dimensions, Text, Image, Pressable, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "react-native-screens";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const SignIn = () => {
    const navigation = useNavigation();
    const [username, onChangeUsername] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    return(
        <View style={styles.backGround}>
            <Text style={styles.header}>SIGN IN</Text>
            <Text style={styles.text}>USERNAME:</Text>
            <TextInput style={[styles.inputBox]}
                       onChangeText={onChangeUsername}
                       value={username}/>
            <Text style={styles.text}>PASSWORD:</Text>
            <TextInput style={[styles.inputBox]}
                       onChangeText={onChangePassword}
                       value={password}
                       secureTextEntry={true}/>
            <Pressable 
                style={({pressed}) => [
                {
                    backgroundColor: pressed ? '#EDA73A': '#ffab00',
                },
                styles.button]} 
                // onPress={onPress}
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
      marginTop: SCREENHEIGHT/2.43,
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

export default SignIn;