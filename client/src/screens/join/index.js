import { RTCView, mediaDevices } from "@videosdk.live/react-native-sdk";
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { MicOff, MicOn, VideoOff, VideoOn } from "../../assets/icons";
import TextInputContainer from "../../components/TextInputContainer";
import Button from "../../components/Button";
import colors from "../../styles/colors";
import { createMeeting, getToken, validateMeeting } from "../../api/api";
import { SCREEN_NAMES } from "../../navigators/screenNames";
import { useFocusEffect } from "@react-navigation/native";
// import Toast from "react-native-simple-toast";
import Menu from "../../components/Menu";
import MenuItem from "../meeting/Components/MenuItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import { ROBOTO_FONTS } from "../../styles/fonts";

import { BaseURL } from "../BaseUrl";

export default function Join({ navigation }) {
  const baseURL = BaseURL

  const [tracks, setTrack] = useState("");
  const [micOn, setMicon] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [userId, setUserId] = useState("")
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [idError, setIdError] = useState("")
  // const meetingTypes = [
  //   { key: "ONE_TO_ONE", value: "One to One Meeting" },
  //   { key: "GROUP", value: "Group Meeting" },
  // ];

  // const [meetingType, setMeetingType] = useState(meetingTypes[0]);

  async function retrieveData(){
    try {
        const value = await AsyncStorage.getItem('user')
        const obj = JSON.parse(value);
        if(value !== null) {
          setName(obj.name)
          setUserId(obj._id)
        }
      } catch(e) {
        console.log(e.message)
      }
  }

  useEffect(()=>{
    retrieveData()
  })

  useEffect(()=>{
    setIdError("")
  }, [])

  const [isVisibleCreateMeetingContainer, setisVisibleCreateMeetingContainer] =
    useState(false);
  const [isVisibleJoinMeetingContainer, setisVisibleJoinMeetingContainer] =
    useState(false);

  const disposeVideoTrack = () => {
    setTrack((stream) => {
      stream.getTracks().forEach((track) => {
        track.enabled = false;
        return track;
      });
    });
  };

  const optionRef = useRef();
  const isMainScreen = () => {
    return !isVisibleJoinMeetingContainer && !isVisibleCreateMeetingContainer;
  };

  useFocusEffect(
    React.useCallback(() => {
      mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then((stream) => {
          setTrack(stream);
        })
        .catch((e) => {
          console.log(e);
        });
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!isMainScreen()) {
          setisVisibleCreateMeetingContainer(false);
          setisVisibleJoinMeetingContainer(false);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [isVisibleCreateMeetingContainer, isVisibleJoinMeetingContainer])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "#2F2F2F"
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#2F2F2F",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              paddingTop: "15%",
              height: "45%",
            }}
          >
            <View
              style={{
                flex: 1,
                width: "50%",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {videoOn && tracks ? (
                  <RTCView
                    streamURL={tracks.toURL()}
                    objectFit={"cover"}
                    mirror={true}
                    style={{
                      flex: 1,
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#202427",
                    }}
                  >
                    <Text style={{ color: colors.primary[100] }}>
                      Camera Off
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  justifyContent: "space-evenly",
                  position: "absolute",
                  bottom: 10,
                  right: 0,
                  left: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setMicon(!micOn);
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                    backgroundColor: micOn ? colors.primary["100"] : "red",
                  }}
                >
                  {micOn ? (
                    <MicOn width={25} height={25} fill={colors.black} />
                  ) : (
                    <MicOff
                      width={25}
                      height={25}
                      fill={colors.primary["100"]}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVideoOn(!videoOn);
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 100,
                    backgroundColor: videoOn ? colors.primary["100"] : "red",
                  }}
                >
                  {videoOn ? (
                    <VideoOn width={25} height={25} fill={colors.black} />
                  ) : (
                    <VideoOff
                      width={35}
                      height={35}
                      fill={colors.primary["100"]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 32 }}>
            {!isVisibleCreateMeetingContainer &&
              !isVisibleJoinMeetingContainer && (
                <>
                  <Button
                    text={"Create a meeting"}
                    backgroundColor={"#ffab00"}
                    color={'#2F2F2F'}
                    onPress={() => {
                      setisVisibleCreateMeetingContainer(true);
                    }}
                    
                  />
                  <Button
                    text={"Join a meeting"}
                    backgroundColor={"#ffab00"}
                    onPress={() => {
                      setisVisibleJoinMeetingContainer(true);
                    }}
                  />
                </>
              )}
            {isVisibleCreateMeetingContainer ? (
              <>
                {/* <TouchableOpacity
                  onPress={async () => {
                    optionRef.current.show();
                  }}
                  style={{
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#202427",
                    borderRadius: 12,
                    marginVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary["100"],
                      fontSize: 16,
                      // fontFamily: ROBOTO_FONTS.RobotoBold,
                    }}
                  >
                    {meetingType.value}
                  </Text>
                </TouchableOpacity>
                <Menu
                  ref={optionRef}
                  menuBackgroundColor={colors.primary[700]}
                  fullWidth
                >
                  {meetingTypes.map((meetingType, index) => {
                    return (
                      <>
                        <MenuItem
                          title={meetingType.value}
                          onPress={() => {
                            optionRef.current.close(true);
                            setMeetingType(meetingType);
                          }}
                        />
                        {index != meetingTypes.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: colors.primary["600"],
                            }}
                          />
                        )}
                      </>
                    );
                  })}
                </Menu> */}
                {/* <TextInputContainer
                  placeholder={"Enter your name"}
                  value={name}
                  setValue={setName}
                /> */}
                <Button
                  text={"Enter Meeting"}
                  backgroundColor={'#ffab00'}
                  onPress={async () => {
                    if (name.length <= 0) {
                      // Toast.show("Please enter your name");
                      return;
                    }
                    const token = await getToken();
                    let meetingId = await createMeeting({ token: token });
                    console.log("meetingID: "+meetingId)
                    disposeVideoTrack();
                    axios.post(`${baseURL}addBadge/${userId}`, {
                      badge: "hiveBee"
                      }).then(function(response){
                          console.log("badge added")
                          PushNotificationIOS.addNotificationRequest({
                            id: 'openProfile',
                            title:"StudyHive",
                            subtitle: "You just earned the Hive Starter Badge!",
                            body: "Congratulations on creating your first StudyHive Hive Session."
                          })
                      })
                    navigation.navigate(SCREEN_NAMES.Meeting, {
                      name: name.trim(),
                      token: token,
                      meetingId: meetingId,
                      micEnabled: micOn,
                      webcamEnabled: videoOn,
                      meetingType: "GROUP",
                    }
                    );
                  }}
                />
                <Button
                  text={"Go Back"}
                  backgroundColor={'#2F2F2F'}
                  onPress={() => {
                    setisVisibleCreateMeetingContainer(false);
                  }}
                />
              </>
            ) : isVisibleJoinMeetingContainer ? (
              <>
                {/* <TouchableOpacity
                  onPress={async () => {
                    optionRef.current.show();
                  }}
                  style={{
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#202427",
                    borderRadius: 12,
                    marginVertical: 12,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary["100"],
                      fontSize: 16,
                      // fontFamily: ROBOTO_FONTS.RobotoBold,
                    }}
                  >
                    {meetingType.value}
                  </Text>
                </TouchableOpacity>
                <Menu
                  ref={optionRef}
                  menuBackgroundColor={colors.primary[700]}
                  fullWidth
                  bottom={120}
                >
                  {meetingTypes.map((meetingType, index) => {
                    return (
                      <>
                        <MenuItem
                          title={meetingType.value}
                          onPress={() => {
                            optionRef.current.close(true);
                            setMeetingType(meetingType);
                          }}
                        />
                        {index != meetingTypes.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: colors.primary["600"],
                            }}
                          />
                        )}
                      </>
                    );
                  })}
                </Menu> */}
                {/* <TextInputContainer
                  placeholder={"Enter your name"}
                  value={name}
                  setValue={setName}
                /> */}
                <TextInputContainer
                  placeholder={"Enter meeting code"}
                  value={meetingId}
                  setValue={setMeetingId}
                />
                <Text style={[styles.text, {textAlign: "center", fontSize: 15, color:"red"}]}>{idError}</Text>
                <Button
                  text={"Join a meeting"}
                  backgroundColor={'#ffab00'}
                  onPress={async () => {
                    if (name.trim().length <= 0) {
                      // Toast.show("Please enter your name");
                      return;
                    }
                    if (meetingId.trim().length <= 0) {
                      // Toast.show("Please enter meetingId");
                      setIdError("Please enter meeting code")
                      return;
                    }

                    const token = await getToken();
                    let valid = await validateMeeting({
                      token: token,
                      meetingId: meetingId.trim(),
                    });
                    
                    if (valid) {
                      setIdError("")
                      console.log("joining with: "+token)
                      disposeVideoTrack();
                      navigation.navigate(SCREEN_NAMES.Meeting, {
                        name: name.trim(),
                        token: token,
                        meetingId: meetingId.trim(),
                        micEnabled: micOn,
                        webcamEnabled: videoOn,
                        meetingType: "GROUP",
                      });
                      setMeetingId("")
                    }else{
                      setIdError("ID is not valid")
                    }
                  }}
                />
                <Button
                  text={"Go Back"}
                  backgroundColor={'#2F2F2F'}
                  onPress={() => {
                    setisVisibleJoinMeetingContainer(false);
                  }}
                />
              </>
            ) : null}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  text: {
      fontFamily:'Mohave-Light',
      fontSize: 20,
      color: '#FFFFFF',
      marginVertical: -5
  }
});