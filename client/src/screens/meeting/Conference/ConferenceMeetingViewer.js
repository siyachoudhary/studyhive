import React, { useEffect, useRef, useState, useMemo, Component } from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  useMeeting,
  getAudioDeviceList,
  switchAudioDevice,
  Constants,
} from "@videosdk.live/react-native-sdk";
import {
  CallEnd,
  CameraSwitch,
  Chat,
  Copy,
  EndForAll,
  Leave,
  MicOff,
  MicOn,
  More,
  Participants,
  Recording,
  ScreenShare,
  VideoOff,
  VideoOn,
} from "../../../assets/icons";
import colors from "../../../styles/colors";
import IconContainer from "../../../components/IconContainer";
import LocalParticipantPresenter from "../Components/LocalParticipantPresenter";
import Menu from "../../../components/Menu";
import MenuItem from "../Components/MenuItem";
// import { ROBOTO_FONTS } from "../../../styles/fonts";
// import Toast from "react-native-simple-toast";
import BottomSheet from "../../../components/BottomSheet";
import ParticipantListViewer from "../Components/ParticipantListViewer";
import ChatViewer from "../Components/ChatViewer";
import Lottie from "lottie-react-native";
import recording_lottie from "../../../assets/animation/recording_lottie.json";
import Blink from "../../../components/Blink";
import ParticipantView from "./ParticipantView";
import RemoteParticipantPresenter from "./RemoteParticipantPresenter";
import VideosdkRPK from "../../../../VideosdkRPK";
import { convertRFValue } from "../../../styles/spacing";
import { Button } from "react-native";
import Part from "../../../part";

const MemoizedParticipant = React.memo(
  ParticipantView,
  ({ participantId }, { participantId: oldParticipantId }) =>
    participantId === oldParticipantId
);
import { MemoizedParticipantGrid } from "./ConferenceParticipantGrid";
import { useOrientation } from "../../../utils/useOrientation";

export default function ConferenceMeetingViewer() {

  const {
    localParticipant,
    participants,
    pinnedParticipants,
    localWebcamOn,
    localMicOn,
    leave,
    end,
    changeWebcam,
    toggleWebcam,
    toggleMic,
    presenterId,
    localScreenShareOn,
    toggleScreenShare,
    meetingId,
    startRecording,
    stopRecording,
    meeting,
    recordingState,
    enableScreenShare,
    disableScreenShare,
    activeSpeakerId,
  } = useMeeting({
    onError: (data) => {
      const { code, message } = data;

      // Toast.show(`Error: ${code}: ${message}`);
    },
  });

  const leaveMenu = useRef();
  const bottomSheetRef = useRef();
  const audioDeviceMenuRef = useRef();
  const moreOptionsMenu = useRef();
  const recordingRef = useRef();
  const orientation = useOrientation();

  const [isRestingScreen, setIsRestingScreen] = useState(isResting)

  const participantIds = useMemo(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      (participantId) => {
        return participantId != localParticipant.id;
      }
    );
    const regularParticipantIds = [...participants.keys()].filter(
      (participantId) => {
        return (
          ![...pinnedParticipants.keys()].includes(participantId) &&
          localParticipant.id != participantId
        );
      }
    );
    const ids = [
      localParticipant?.id,
      ...pinnedParticipantId,
      ...regularParticipantIds,
    ].slice(0, presenterId ? 2 : 6);

    if (activeSpeakerId) {
      if (!ids.includes(activeSpeakerId)) {
        ids[ids.length - 1] = activeSpeakerId;
      }
    }
    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
  ]);

  const [bottomSheetView, setBottomSheetView] = useState("");

  const [audioDevice, setAudioDevice] = useState([]);

  async function updateAudioDeviceList() {
    const devices = await getAudioDeviceList();
    setAudioDevice(devices);
  }

  useEffect(() => {
    if (recordingRef.current) {
      if (
        recordingState === Constants.recordingEvents.RECORDING_STARTING ||
        recordingState === Constants.recordingEvents.RECORDING_STOPPING
      ) {
        recordingRef.current.start();
      } else {
        recordingRef.current.stop();
      }
    }
  }, [recordingState]);

  useEffect(() => {
    if (Platform.OS == "ios") {
      VideosdkRPK.addListener("onScreenShare", (event) => {
        if (event === "START_BROADCAST") {
          enableScreenShare();
        } else if (event === "STOP_BROADCAST") {
          disableScreenShare();
        }
      });

      return () => {
        VideosdkRPK.removeAllListeners("onScreenShare");
        // VideosdkRPK.removeSubscription("onScreenShare");
      };
    }
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {(recordingState === Constants.recordingEvents.RECORDING_STARTED ||
          recordingState === Constants.recordingEvents.RECORDING_STOPPING ||
          recordingState === Constants.recordingEvents.RECORDING_STARTING) && (
          <View>
            <Blink ref={recordingRef} duration={500}>
              <Lottie
                source={recording_lottie}
                autoPlay
                loop
                style={{
                  height: 30,
                  width: 5,
                }}
              />
            </Blink>
          </View>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            marginLeft:
              recordingState === Constants.recordingEvents.RECORDING_STARTED ||
              recordingState === Constants.recordingEvents.RECORDING_STOPPING ||
              recordingState === Constants.recordingEvents.RECORDING_STARTING
                ? 8
                : 0,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 16,
                // fontFamily: ROBOTO_FONTS.RobotoBold,
                color: colors.primary[100],
              }}
            >
              {meetingId ? meetingId : "xxx - xxx - xxx"}
            </Text>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                marginLeft: 10,
              }}
              onPress={() => {
                Clipboard.setString(meetingId);
                // Toast.show("Meeting Id copied Successfully");
              }}
            >
              <Copy fill={colors.primary[100]} width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => {
              changeWebcam();
            }}
          >
            <CameraSwitch height={26} width={26} fill={colors.primary[100]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setBottomSheetView("PARTICIPANT_LIST");
              bottomSheetRef.current.show();
            }}
            activeOpacity={1}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 8,
            }}
          >
            <Participants height={24} width={24} fill={colors.primary[100]} />
            <Text
              style={{
                fontSize: convertRFValue(14),
                color: colors.primary[100],
                marginLeft: 4,
                // fontFamily: ROBOTO_FONTS.RobotoMedium,
              }}
            >
              {participants ? [...participants.keys()].length : 1}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Center */}

      <TimerMain/>

      <View
        style={{
          flex: 1,
          flexDirection: orientation == "PORTRAIT" ? "column" : "row",
          marginVertical: 12,
        }}
      >
        {presenterId && !localScreenShareOn ? (
          <RemoteParticipantPresenter presenterId={presenterId} />
        ) : presenterId && localScreenShareOn ? (
          <LocalParticipantPresenter />
        ) : null}

        <MemoizedParticipantGrid
          participantIds={participantIds}
          isPresenting={presenterId != null}
        />
      </View>
      <Menu
        ref={leaveMenu}
        menuBackgroundColor={colors.primary[700]}
        placement="left"
      >
        <MenuItem
          title={"Leave"}
          description={"Only you will leave the call"}
          icon={<Leave width={22} height={22} />}
          onPress={() => {
            leave();
            moreOptionsMenu.current.close();
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.primary["600"],
          }}
        />
        <MenuItem
          title={"End"}
          description={"End call for all participants"}
          icon={<EndForAll />}
          onPress={() => {
            end();
            moreOptionsMenu.current.close();
          }}
        />
      </Menu>
      <Menu
        ref={audioDeviceMenuRef}
        menuBackgroundColor={colors.primary[700]}
        placement="left"
        left={70}
      >
        {audioDevice.map((device, index) => {
          return (
            <>
              <MenuItem
                title={
                  device == "SPEAKER_PHONE"
                    ? "Speaker"
                    : device == "EARPIECE"
                    ? "Earpiece"
                    : device == "BLUETOOTH"
                    ? "Bluetooth"
                    : "Wired Headset"
                }
                onPress={() => {
                  switchAudioDevice(device);
                  audioDeviceMenuRef.current.close();
                }}
              />

              {index != audioDevice.length - 1 && (
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
      </Menu>
      <Menu
        ref={moreOptionsMenu}
        menuBackgroundColor={colors.primary[700]}
        placement="right"
      >
        <MenuItem
          title={`${
            !recordingState ||
            recordingState === Constants.recordingEvents.RECORDING_STOPPED
              ? "Start"
              : recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPING
              ? "Stopping"
              : "Stop"
          } Recording`}
          icon={<Recording width={22} height={22} />}
          onPress={() => {
            if (
              !recordingState ||
              recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ) {
              startRecording();
            } else if (
              recordingState === Constants.recordingEvents.RECORDING_STARTED
            ) {
              stopRecording();
            }
            moreOptionsMenu.current.close();
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.primary["600"],
          }}
        />
        {(presenterId == null || localScreenShareOn) && (
          <MenuItem
            title={`${localScreenShareOn ? "Stop" : "Start"} Screen Share`}
            icon={<ScreenShare width={22} height={22} />}
            onPress={() => {
              moreOptionsMenu.current.close();
              if (presenterId == null || localScreenShareOn)
                Platform.OS === "android"
                  ? toggleScreenShare()
                  : VideosdkRPK.startBroadcast();
            }}
          />
        )}
      </Menu>
      {/* Bottom */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <IconContainer
          backgroundColor={"red"}
          Icon={() => {
            return <CallEnd height={26} width={26} fill="#FFF" />;
          }}
          onPress={() => {
            leaveMenu.current.show();
          }}
        />
        <IconContainer
          style={{
            paddingLeft: 0,
            height: 52,
          }}
          isDropDown={true}
          onDropDownPress={async () => {
            await updateAudioDeviceList();
            audioDeviceMenuRef.current.show();
          }}
          backgroundColor={!localMicOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localWebcamOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleWebcam();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          onPress={() => {
            setBottomSheetView("CHAT");
            bottomSheetRef.current.show();
          }}
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          Icon={() => {
            return <Chat height={22} width={22} fill="#FFF" />;
          }}
        />
        {/* <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
            transform: [{ rotate: "90deg" }],
          }}
          onPress={() => {
            moreOptionsMenu.current.show();
          }}
          Icon={() => {
            return <More height={18} width={18} fill="#FFF" />;
          }}
        /> */}
      </View>
      <BottomSheet
        sheetBackgroundColor={"#2B3034"}
        draggable={false}
        radius={12}
        hasDraggableIcon
        closeFunction={() => {
          setBottomSheetView("");
        }}
        ref={bottomSheetRef}
        height={Dimensions.get("window").height * 0.5}
      >
        {bottomSheetView === "CHAT" ? (
          <ChatViewer />
        ) : bottomSheetView === "PARTICIPANT_LIST" ? (
          <ParticipantListViewer participantIds={[...participants.keys()]} />
        ) : null}
      </BottomSheet>
    </>
  );
}

let isResting = null

class TimerMain extends Component {

  constructor() {
    super()
    this.state = {
      preMW: 25, // value to reset mW to
      mW: 25,
      preSW: 0, // value to reset sW to
      sW: 0,
      preMR: 5, // value to reset mR to
      mR: 5,
      preSR: 0, // value to reset sR to
      sR: 0,
      workTime: true,
      preTimer: '25:00', // value to reset timer to
      timer: '25:00',
      condition: 'Start',
      isRest: "Start your pomodoro timer!"
    }
  }

  formatNumber(num) {
    var str = String(num)
    if (str.length === 1) {
      str = '0' + str;
    }
    return str;
  }


  runTimer = () => {
    if (this.state.workTime){
      if (this.state.sW === 0) {
        this.setState(pre => ({mW: pre.mW - 1, sW: 59 }))
      } else if (this.state.sW >= 0) {
        this.setState(pre => ({sW: pre.sW - 1}))
      }
      this.setState({timer: this.formatNumber(this.state.mW) + ':' + this.formatNumber(this.state.sW)})

      if (this.state.mW === 0 && this.state.sW === 0) {
        this.toggleTimer()
        isResting = true
      }
    } else {
      if (this.state.sR === 0) {
        this.setState(pre => ({mR: pre.mR - 1, sR: 59 }))
      } else if (this.state.sR >= 0) {
        this.setState(pre => ({sR: pre.sR - 1}))
      }
      this.setState({timer: this.formatNumber(this.state.mR) + ':' + this.formatNumber(this.state.sR)})

      if (this.state.mR === 0 && this.state.sR === 0) {
      this.toggleTimer()
        this.setState(state => ({mW: state.preMW, sW: state.preSW, sR: state.preSR, mR: state.preMR, timer: state.preTimer}))
        isResting = false
      }
    }
  }

  controlTimer = () => {
    if(isResting==null){
      isResting=false
    }
    clearInterval(this.clock)
    if (this.state.condition === 'Start') {
      this.setState({condition: 'Pause'})
      this.clock = setInterval(this.runTimer, 1000)
    } else {
      this.setState({condition: 'Start'})
      clearInterval(this.clock)
    }
  }

  reset = () => {
    this.setState(state => ({mW: state.preMW, sW: state.preSW, sR: state.preSR, mR: state.preMR, timer: state.preTimer}))
    this.setState({condition: 'Start'})
    clearInterval(this.clock)
    this.setState({workTime: true})
  }

  toggleTimer = () => {
    this.setState(pre => ({workTime: !pre.workTime}))
  }

  updateTimer = () => {
    this.setState(pre => ({preTimer: this.formatNumber(pre.preMW) + ':' + this.formatNumber(pre.preSW) }))
    this.setState(pre => ({timer: this.formatNumber(pre.preMW) + ':' + this.formatNumber(pre.preSW) }))
  }

  // used in the onChange prop in the 'Part' Component
  changeValueMW(id, value) {
    if (value === '' || value === null || value === 'NaN') {
      return false;
    }
    var num = Number(value.nativeEvent.text);
    switch(id) {
      case 0:
        this.setState({preMW: num, mW: num});
        this.updateTimer();
        break;
      case 1:
        this.setState({preSW: num, sW: num});
        this.updateTimer();
        break;
      case 2:
        this.setState({preMR: num, mR: num});
        this.updateTimer();
        break;
      case 3:
        this.setState({preSR: num, sR: num});
        this.updateTimer();
        break;
    }
    this.reset();
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  render() {
    return(
      <View style={styles.center}>
        {/* <Text style={styles.title}>{this.state.isRest}</Text>
        {isResting?<Text style={styles.title}>Rest</Text>:
        isResting!=null?
        <Text style={styles.title}>Working</Text>:
        <Text style={styles.title}>Start Work Timer</Text>}
        <Text style={styles.timer}>{this.state.timer}</Text>
        <View style={styles.btnContainer}>
          <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} />
          <Button title='Reset' color='red' onPress={this.reset} />
        </View> */}

        {isResting?

        <View style={styles.workTime}>
          <Text style={styles.title}>Rest Break</Text>
          <Text style={styles.timer}>{this.state.timer}</Text>
          <View style={styles.btnContainer}>
          <Pressable style={styles.start} onPress={this.controlTimer}>
              <Text style={styles.startTxt}>{this.state.condition}</Text>
            </Pressable>
            <Pressable style={styles.reset} onPress={this.reset}>
              <Text style={styles.resetTxt}>Reset</Text>
            </Pressable>
            {/* <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} />
            <Button title='Reset' color='red' onPress={this.reset} style={styles.reset}/> */}
          </View>
          </View>
          :

          isResting!=null?
          <View style={styles.workTime}>
            <Text style={styles.titleWorking}>Working</Text>
            <Text style={styles.timerWorking}>{this.state.timer}</Text>
            <View style={styles.btnContainer}>
            <Pressable style={styles.start} onPress={this.controlTimer}>
              <Text style={styles.startTxt}>{this.state.condition}</Text>
            </Pressable>
            <Pressable style={styles.reset} onPress={this.reset}>
              <Text style={styles.resetTxt}>Reset</Text>
            </Pressable>
              {/* <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} />
              <Button title='Reset' color='red' onPress={this.reset} style={styles.reset}/> */}
            </View>
          </View> 

          :
          <View style={styles.workTime}>
            <Text style={styles.titleWorking}>Start Work Timer</Text>
            <Text style={styles.timerWorking}>{this.state.timer}</Text>
            <View style={styles.btnContainer}>
            <Pressable style={styles.start} onPress={this.controlTimer}>
              <Text style={styles.startTxt}>{this.state.condition}</Text>
            </Pressable>
            <Pressable style={styles.reset} onPress={this.reset}>
              <Text style={styles.resetTxt}>Reset</Text>
            </Pressable>
              {/* <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} /> */}
              {/* <Button title='Reset' color='red' onPress={this.reset} style={styles.reset}/> */}
            </View>
          </View> 
      }

        {/* Work timer inputs */}
        {/* <Part title='Set Working Time' m={this.state.preMW} s={this.state.preSW} onChangeM={text => this.changeValueMW(0, text)} onChangeS={text => this.changeValueMW(1, text)}/> */}

        {/* Rest timer inputs */}
        {/* <Part title='Set Rest Time' m={this.state.preMR} s={this.state.preSR} onChangeM={text => this.changeValueMW(2, text)} onChangeS={text => this.changeValueMW(3, text)}/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title:{
    fontSize: 30,
    alignItems: 'center',
    marginTop:10,
    padding: 10,
    color: 'white', 
    fontFamily: 'Mohave-Medium'
  },
  timer: {
    fontSize: 50,
    alignItems: 'center',
    // padding: 10,
    color: 'white', 
    fontFamily: 'Mohave-Medium'
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleWorking:{
    fontSize: 50,
    alignItems: 'center',
    marginTop:10,
    padding: 10,
    color: 'white', 
    fontFamily: 'Mohave-Medium'
  },
  timerWorking: {
    fontSize: 80,
    alignItems: 'center',
    textAlign:'center',
    backgroundColor:'#EDA73A',
    padding: 10,
    color: 'white', 
    fontFamily: 'Mohave-Medium',
    width:'100%',
    margin:20
  },
  workTime:{
    width:'90%',
    alignItems: 'center',
  },
  start:{
    backgroundColor:'darkgreen',
    padding:10,
    margin:10,
    width:'25%',
    alignItems:'center'
  },
  startTxt:{
    color:'white',
    fontFamily: 'Mohave-Medium',
    fontSize:20
  },
  reset:{
    backgroundColor:'red',
    padding:10,
    margin:10,
    width:'25%',
    alignItems:'center'
  },
  resetTxt:{
    color:'white',
    fontFamily: 'Mohave-Medium',
    fontSize:20
  }
});
