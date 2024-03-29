import React, {useState, useEffect, useRef} from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import { BADGE_IMAGES } from './BadgeRoutes';

import axios from 'axios';

import PushNotificationIOS from '@react-native-community/push-notification-ios';

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;

const TabBarHeight = SCREENHEIGHT/16;
const HeaderHeight = SCREENHEIGHT/2.4;
const SafeStatusBar = Platform.select({
  ios: 40,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (SCREENWIDTH - 40) / 3;
const tab2ItemHeight = (SCREENWIDTH - 50) / 5;
const tab2ItemWidth = (SCREENWIDTH - 50);

import { useIsFocused } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { BaseURL } from './BaseUrl';
let lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let logDays = [];
let logFull = {};

const Profile = () => {
  const baseURL = BaseURL

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileImg, setProfileImg] = useState("")
  const [user, setUser] = useState(null)

  const navigation = useNavigation();
  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'BADGES'},
    {key: 'tab2', title: 'STREAKS'},
    {key: 'tab3', title: 'FRIENDS'},
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab1Data, setTab1Data] = useState([]);
  const [tab2Data, setTab2Data] = useState([]);
  const [tab3Data, setTab3Data] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const dataFetchedRef = useRef(false);

  /**
   * ref
   */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);

  const isFocused = useIsFocused()

  useEffect(()=>{
    if (dataFetchedRef.current) return;
    if(email==""){
      retrieveData()
    }
  })

  useEffect(() => {
    if(isFocused){
      console.log("is focused on profile page")
        // retrieveData()
        setEmail("")
        setName("")
        dataFetchedRef.current=false
        friendsFound=false
        getUserScores()
        getUserBadges()
    }
  }, [isFocused])

  useEffect(() => {
    if(email!="" && firstLoad){
      console.log("getting all info")
      getCurrentStreak();
      getUserFriends()
      getUserBadges()
      getUserScores()
      loadLog();
      // getCurrentStreak();
    }
  }, [email])

  // useEffect(() => {

  // }, [currentStreak])

  async function loadLog() {
    await AsyncStorage.getItem("studyLog").then(value => {
      if(value != null){
        logFull = JSON.parse(value);
        console.log('loaded study log')
        console.log(logFull)
      }
    }).catch(err => {
      console.log(err.message);  
    })
    const ordered = Object.keys(logFull).sort().reduce(
      (obj, key) => { 
        obj[key] = logFull[key]; 
        return obj;
      }, 
      {}
    );
    findStreaks(ordered)
    return;
  }

  let currentStreak;
  const getCurrentStreak = async () =>{
    // console.log('RUNNING THIS')
    // console.log(email)
    if(email != ""){
        // console.log('passed first test')
      await axios
         .get(`${baseURL}getCurrentStreak/${user._id}`)
         .then(function (res) {
            currentStreak = res.data.currentStreak
            console.log('current streak')
            console.log(currentStreak)
         })
         .catch(function (err) {
             // handle error
             console.log("error: "+err.message);
         });
       }
}

  const findStreaks = (ordered) => {
    console.log('FIND STREAKS')
    console.log(ordered)
    let now = JSON.stringify(new Date())
    let year = now.slice(1, 5);
    let month = now.slice(6, 8);
    let day =  now.slice(9, 11);
    let newDate = `${year}-${month}-${day}`;
    let oldNum = (Object.keys(ordered)[0]).slice(8) * 1; 
    console.log(Object.keys(ordered)[0])
    let thatMonth = (Object.keys(ordered)[0]).slice(5, 7) * 1;
    if(lastDates[thatMonth-1] == oldNum){
        oldNum = 0;
    }
    let newNum;
    let tempCurrent = 0;
    console.log(newDate)
    console.log(Object.keys(ordered)[Object.keys(ordered).length-1])
    if(!(Object.keys(ordered)[Object.keys(ordered).length-1] == newDate)){
      currentStreak = 0;
    }
    console.log("currentStreak: " + currentStreak)
    // console.log("longestStreak: " + longestStreak)
    updateCurrentStreak(currentStreak)
}

  const updateCurrentStreak = (days) =>{
    // console.log('RUNNING THIS')
    // console.log(email)
    if(email != ""){
        // console.log('passed first test')
        axios
        .post(`${baseURL}updateCurrentStreak/${user._id}`, {
            currentStreak: days
        }).then(function(response){
            console.log("current streak updated")
            console.log(currentStreak)
        }).catch(function (err) {
            console.log('THIS IS NOT WORKING BRO')
            console.log(err.message);
        })
    }
    getUserScores();
}

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },

      onPanResponderRelease: (evt, gestureState) => {
        syncScrollOffset();
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        headerScrollY.setValue(scrollY._value);
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        listRefArr.current.forEach((item) => {
          if (item.key !== routes[_tabIndex.current].key) {
            return;
          }
          if (item.value) {
            item.value.scrollToOffset({
              offset: -gestureState.dy + headerScrollStart.current,
              animated: false,
            });
          }
        });
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    }),
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    }),
  ).current;

  /**
   * effect
   */

  async function retrieveData(){
    console.log("retrieving")
    try {
        const value = await AsyncStorage.getItem('user')
        console.log(email)
        const obj = JSON.parse(value);
        // console.log("user value:" + value)
        if(value !== null) {
          setUser(obj)
          // console.log("obj " + obj)
          setName(user.name)
          setEmail(user.email)
          setProfileImg(user.profile)
          setFirstLoad(true)
        }
      } catch(e) {
        console.log(e.message)
      }
  }

  const getUserBadges = async () =>{
    if(email!=""){
      await axios
         .get(`${baseURL}getBadges/${user._id}`)
         .then(function (res) {
            setTab1Data(res.data.badges)
         })
         .catch(function (err) {
             // handle error
             console.log("error: "+err.message);
         });
       }
  }

  const getUserScores = async () =>{
    const scoresData = [];
    if(email!=""){
      await axios
         .get(`${baseURL}getUserScores/${user._id}`)
         .then(function (res) {
            // scoresData.push(res.data.lifetimeHours)
            console.log(res.data.dataStuff)
            scoresData.push(res.data.dataStuff[0])
            scoresData.push(res.data.dataStuff[2])
            scoresData.push(res.data.dataStuff[1])
         })
         .catch(function (err) {
             // handle error
             console.log("error: "+err.message);
         });
         setTab2Data(scoresData)
       }
  }

  const getUserFriends = async ()=>{
    if(email!=""){
      console.log("getting user friends")
      // const friends = [" "];
     await axios
        .get(`${baseURL}findFriends/${user._id}`)
        .then(function (res) {
              // getUserNames(res.data)
              // console.log(res.data)
              // friends.push(res.data)
              setTab3Data(res.data)
              dataFetchedRef.current = true;
              friendsFound = true
        })
        .catch(function (err) {
            // handle error
            console.log("error: "+err.message);
        });
      }
  }

  const getUserNames = async(data)=>{
    const friends = [" "];
    for(var i = 0; i<data.length; i++){
      await axios
        .get(`${baseURL}findUser/${data[i]}`)
        .then(function (res) {
            friends.push(res.data)
        })
        .catch(function (err) {
            // handle error
            console.log("error: "+err.message);
        });
    }
    setTab3Data(friends)
    dataFetchedRef.current = true;
    friendsFound = true
  }

  useEffect(() => {
    scrollY.addListener(({value}) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({value}) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };

  /**
   * render Helper
   */
  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={[styles.header, {transform: [{translateY: y}]}]}>

        <View style={{position: "absolute",top: 50}}>
          <Pressable
            onPress={()=>navigation.navigate("Requests")} style={styles.requests}>
            <Image source={require('../assets/images/inbox.png')} style={styles.smallimage2}></Image>
          </Pressable>
          <Pressable
            onPress={()=>navigation.navigate("Settings")} style={styles.settings}>
            <Image source={require('../assets/images/settingsIcon.png')} style={styles.smallimage}></Image>
          </Pressable>
        </View>
        <Image source={{uri:`${baseURL}images/${profileImg}`}} style={styles.image}></Image>
        <Text style={styles.headertext}>{name}</Text>
        <Text style={styles.text}>{email}</Text>
      </Animated.View>
    );
  };

  const renderTab1Item = ({item, index}) => {
    let imgSource = null
    if (item === 'newBee') {
      imgSource = BADGE_IMAGES.newBee.uri;
    }else if (item === 'hiveBee') {
      imgSource = BADGE_IMAGES.hiveBee.uri;
    }else if (item === 'friendlyBee') {
      imgSource = BADGE_IMAGES.friendlyBee.uri;
    }else if (item === 'busyBee') {
      imgSource = BADGE_IMAGES.busyBee.uri;
    }
    return (
      <View
        style={{
          borderRadius: 16,
          marginLeft: index % 3 === 0 ? 0 : 10,
          width: tab1ItemSize,
          height: tab1ItemSize,
          backgroundColor: '#4a4a4a',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <Text>{item}</Text> */}
        <Image source={imgSource} style={{width:tab1ItemSize-10, height:tab1ItemSize-10, margin:10}}/>
      </View>
    );
  };

  const renderTab2Item = ({item, index}) => {
    return (
      <View
        style={{
          marginHorizontal: tab2ItemWidth/23,
          marginVertical: tab2ItemWidth/400,
          width: tab2ItemWidth,
          height: tab2ItemHeight*1.3,
          backgroundColor: '#4a4a4a',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection:'row'
        }}>
          <View
            style={{
              position:'absolute',
              left: 20,
              top: 25
            }}
          >
            {index==0?
              <Text style={styles.buttonTextStreaks}>Lifetime Hours</Text>
              :
              index==1?
              <Text style={styles.buttonTextStreaks}>Current Streak</Text>
              :
              <Text style={styles.buttonTextStreaks}>Longest Streak</Text>
            }
          </View>

          <View
            style={{
              position:'absolute',
              right: 20,
            }}
          >
            {index==0?
              <View
                style={{
                  flexDirection:"row"
                }}
              >
                <Text style={[styles.buttonTextScore, {marginRight:10}]}>{item}</Text>
                <Text style={[styles.buttonTextUnit, {top:10}]}>HOURS</Text>
              </View>
              :
              index==1?
                <View
                  style={{
                    flexDirection:"row",
                    right: 15
                  }}
                >
                  <Text style={[styles.buttonTextScore, {marginRight:10}]}>{item}</Text>
                <Text style={[styles.buttonTextUnit, {top:10}]}>DAYS</Text>
                </View>
              :
              <View
                style={{
                  flexDirection:"row",
                  right: 15
                }}
              >
                <Text style={[styles.buttonTextScore, {marginRight:10}]}>{item}</Text>
                <Text style={[styles.buttonTextUnit, {top:10}]}>DAYS</Text>
              </View>
            }
          </View>
      </View>
    );
  };

  const removeFriend=(friendId)=>{
    axios
        .post(`${baseURL}removeFriend/${user._id}`, {
          friend: friendId._id,
        })
        .then(function (response) {
          console.log(`${friendId._id} removed`)
          getUserFriends()
          friends.remove(friendId)
          return
        })
        .catch(function (err) {
            // handle error
            console.log("error removing friend");
        });
    // console.log(friendId)
  }

  const getCorrectDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(23);
    date.setMinutes(54);
    return date;
  };

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };

  const renderTab3Item = ({item, index}) => {
    return (
      <View>
        {index==0?
          <Pressable style={{
            marginHorizontal: tab2ItemWidth/23,
            marginVertical: tab2ItemWidth/400,
            marginBottom: 10,
          }} onPress={
            ()=>navigation .navigate("AddFriend")
            }>
            <Text style={{color:"white", fontSize:20, backgroundColor: "grey", padding: 20}}>+ ADD FRIENDS</Text>
          </Pressable>: null
          }

        {item!=" "?
        <View
          style={{
            marginHorizontal: tab2ItemWidth/23,
            marginVertical: tab2ItemWidth/400,
            padding:tab2ItemWidth/23,
            width: tab2ItemWidth,
            height: tab2ItemHeight,
            backgroundColor: '#4a4a4a',
            flexDirection: "row",
          }}>
          <Pressable 
                  style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#EDA73A': '#ffab00',
                  },
                  styles.button1]} 
                  onPress={()=>navigation.navigate("FriendProfile", {
                    friendId: item._id,
                    userFriends: tab3Data,
                    myId: user._id
                  })}
                  >
              <Text style={styles.buttonText}> View </Text>
          </Pressable>

          <View style={styles.friendDetails}>
            <Text style={[{textAlign: "left"}, styles.buttonText2]}>{item.name}</Text>
            <Text style={[{textAlign: "left", fontSize: 15}, styles.buttonText3]}>{item.email}</Text>
          </View>

          <Pressable 
                  style={({pressed}) => [
                  styles.button]} 
                  onPress={()=>removeFriend(item)}
                  >
              <Text style={[styles.buttonText, {color:"red"}]}> Remove </Text>
          </Pressable>
      </View>:null
    }
      </View>
    );
  };

  const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = ({route}) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case 'tab1':
        numCols = 3;
        data = tab1Data;
        renderItem = renderTab1Item;
        break;
      case 'tab2':
        numCols = 1;
        data = tab2Data;
        renderItem = renderTab2Item;
        break;
      case 'tab3':
        numCols = 1;
        {tab3Data.length>0?data = tab3Data:data=" "}
        renderItem = renderTab3Item;
        break;
      default:
        return null;
    }
    return (
      <View>
      <Animated.FlatList
        // scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
                [
                  {
                    nativeEvent: {contentOffset: {y: scrollY}},
                  },
                ],
                {useNativeDriver: true},
              )
            : null
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight + 5,
          paddingHorizontal: 10,
          minHeight: SCREENHEIGHT - SafeStatusBar + HeaderHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{translateY: y}],
          width: '100%',
        }}>
        <TabBar
          {...props}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
        }}
        navigationState={{index: tabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: SCREENWIDTH,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderTabView()}
      {renderHeader()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2F",
  },
  header: {
    height: HeaderHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: "#2F2F2F",
    paddingTop: 50
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    position: 'absolute',
    right: 10,
    top: 10,
    bottom: 10
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10
  },
  image: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 150,
      height: 150, 
      marginTop: SCREENHEIGHT/200,
      borderRadius: 75,
  }, 
  smallimage2: {
    width: 45,
    height: 45, 
    marginLeft: SCREENHEIGHT/1000,
  },
  smallimage: {
    width: 45,
    height: 45, 
    marginLeft: SCREENHEIGHT/2.8,
    top: -40
  },
  headertext: {
      fontFamily:'Mohave-Bold',
      fontSize: 22,
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#FFFFFF',        
      textAlign: 'center',
      marginTop: SCREENHEIGHT/65,
  },
  text: {
      fontFamily:'Mohave-Light',
      fontSize: 18,
      // lineHeight: 25,
      letterSpacing: 1,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: SCREENHEIGHT/140,
  },
  label: {
    fontFamily:'Mohave-Light',
    fontSize: 17.5, 
    color: '#FFFFFF',
  },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#292929',
    height: TabBarHeight,
    justifyContent: 'center',
    // marginTop: 10,
  },
  indicator: {backgroundColor: '#FFFFFF'},
  buttonText: {
    fontFamily:'Mohave-Bold',
    fontSize: 15,
    fontWeight: 'bold',
    // lineHeight: 25,
    letterSpacing: 1,
    color: '#303030',
},
buttonText2: {
  fontFamily:'Mohave-Bold',
  fontSize: 15,
  fontWeight: 'bold',
  letterSpacing: 1,
  color: 'white',
},
buttonTextStreaks:{
  fontFamily:'Mohave-Bold',
  fontSize: 25,
  fontWeight: 'bold',
  letterSpacing: 1,
  color: 'white',
},
buttonTextScore:{
  fontFamily:'Mohave-Bold',
  fontSize: 35,
  fontWeight: 'bold',
  letterSpacing: 1,
  color: '#ffab00',
},
buttonTextUnit:{
  fontFamily:'Mohave-Bold',
  fontSize: 25,
  fontWeight: 'bold',
  letterSpacing: 1,
  color: 'white',
},
buttonText3: {
  fontFamily:'Mohave-Bold',
  fontSize: 14,
  fontWeight: '500',
  letterSpacing: 1,
  color: '#aaa',
},
friendDetails:{
  position:'absolute',
  left: 80,
  top: 15
}
});

export default Profile;