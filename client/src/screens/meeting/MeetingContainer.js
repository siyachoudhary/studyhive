import {
  useMeeting,
  ReactNativeForegroundService,
} from "@videosdk.live/react-native-sdk";
import { useEffect, useState } from "react";
import OneToOneMeetingViewer from "./OneToOne";
import ConferenceMeetingViewer from "./Conference/ConferenceMeetingViewer";
import ParticipantLimitViewer from "./OneToOne/ParticipantLimitViewer";
import WaitingToJoinView from "./Components/WaitingToJoinView";
import React from "react";

export default function MeetingContainer({ webcamEnabled, meetingType }) {
  const [isJoined, setJoined] = useState(false);
  const [participantLimit, setParticipantLimit] = useState(false);

  const { join, changeWebcam, participants, leave } = useMeeting({
    onMeetingJoined,
    onParticipantLeft,
  })


    function onMeetingJoined(){
      console.log("JOINED")
      setTimeout(() => {
        setJoined(true);
      }, 500);
    }

    function onParticipantLeft(){
      if (participants.size < 2) {
        setParticipantLimit(false);
      }
    }

  useEffect(() => {
    if (isJoined) {
      if (participants.size > 2) {
        setParticipantLimit(true);
      }
    }
  }, [isJoined]);

  useEffect(() => {
    setTimeout(() => {
      if (!isJoined) {
        join()
        // console.log("not joined")
        if (webcamEnabled) changeWebcam();
      }
    }, 1000);

    return () => {
      leave();
      ReactNativeForegroundService.stopAll();
    };
  }, []);

  return isJoined ? (
    meetingType === "GROUP" ? (
      <ConferenceMeetingViewer />
    ) : participantLimit ? (
      <ParticipantLimitViewer />
    ) : (
      <OneToOneMeetingViewer />
    )
  ) : (
    <WaitingToJoinView />
  );
}
