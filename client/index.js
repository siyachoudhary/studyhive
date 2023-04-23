/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { register } from "@videosdk.live/react-native-sdk";

var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';

register();
AppRegistry.registerComponent(appName, () => App);


PushNotification.configure({
 
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },
 
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
 
    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",
 
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },
 
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
 
    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});