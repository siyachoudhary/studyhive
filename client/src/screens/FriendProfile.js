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

import axios from 'axios';

import placeholderImg from "../assets/images/blankProfile.png"

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

const FriendProfile = ({route}) => {
  // const baseURL = "http://localhost:3000"
  const baseURL = "http://192.168.1.122:3000/"
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const [userId, setUserId] = useState(route.params.friendId)
  const [userFriends, setUserFriends] = useState(route.params.userFriends)

  const [user, setUser] = useState(null)
  const [friends, setFriends] = useState(null)

  const navigation = useNavigation();

  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'BADGES'},
    {key: 'tab2', title: 'SCORES'},
    {key: 'tab3', title: 'MUTUAL FRIENDS'},
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab1Data] = useState(Array(30).fill(0));
  const [tab2Data] = useState(Array(30).fill(0));
  const [tab3Data, setTab3Data] = useState([]);
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

  let friendsFound = false;

  useEffect(()=>{
    if (dataFetchedRef.current) return;
       if(!friendsFound){
        getUserFriends()
       }
  })

  const getUserFriends = async ()=>{
    // if(userId!=""){
     await axios
        .get(`${baseURL}findUser/${userId}`)
        .then(function (res) {

              setName(res.data.name)
              setEmail(res.data.email)
              setFriends(res.data.friends)

              setProfilePic(`${baseURL}images/${res.data.profile}`)

              const tempFriends = [];
                for (let i = 0; i < res.data.friends.length; i++) {
                    for (let j = 0; j < userFriends.length; j++) {
                        if(res.data.friends[i] == userFriends[j]._id){
                            tempFriends.push(res.data.friends[i])
                        }
                    }
                }
                getUserNames(tempFriends)
        })
        .catch(function (err) {
            // handle error
            console.log("error: "+err.message);
        });
  }

  const getUserNames = async(data)=>{
    const friendsTemp = [];
    for(var i = 0; i<data.length; i++){
      await axios
        .get(`${baseURL}findUser/${data[i]}`)
        .then(function (res) {
            friendsTemp.push(res.data)
        })
        .catch(function (err) {
            // handle error
            console.log("error: "+err.message);
        });
    }
    setTab3Data(friendsTemp)
    friendsFound=true
    dataFetchedRef.current = true;
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
        <Pressable
            onPress={()=>navigation.navigate("profileScreen")} style={styles.goBack}>
            <Image source={require('../assets/images/backArrow.png')} style={styles.smallimage}></Image>
        </Pressable>
        <Image source={{uri: profilePic}} style={styles.image}></Image>
        <Text style={styles.headertext}>{name}</Text>
        <Text style={styles.text}>{email}</Text>
      </Animated.View>
    );
  };

  const renderTab1Item = ({item, index}) => {
    return (
      <View
        style={{
          borderRadius: 16,
          marginLeft: index % 3 === 0 ? 0 : 10,
          width: tab1ItemSize,
          height: tab1ItemSize,
          backgroundColor: '#aaa',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>{index}</Text>
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
          height: tab2ItemHeight,
          backgroundColor: '#aaa',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>{index}</Text>
      </View>
    );
  };

  const removeFriend=(friendId)=>{
    console.log(friendId._id)
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

  const renderTab3Item = ({item, index}) => {
    return (
      <View>
        {item!=" "?
        <View
          style={{
            marginHorizontal: tab2ItemWidth/23,
            marginVertical: tab2ItemWidth/400,
            padding:tab2ItemWidth/23,
            width: tab2ItemWidth,
            height: tab2ItemHeight,
            backgroundColor: '#aaa',
            flexDirection: "row",
          }}>

            <Pressable 
                  style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#EDA73A': '#ffab00',
                  },
                  styles.button1]} 
                  onPress={
                //     ()=>navigation.navigate("FriendProfile", {
                //     friendId: item._id,
                //     userFriends: userFriends
                //   })
                ()=>navigation.push('FriendProfile', {
                    friendId: item._id,
                    userFriends: userFriends
                })
                }
                // onPress={FriendProfile({
                //     friendId: item._id,
                //     userFriends: userFriends
                // })}
                  >
              <Text style={styles.buttonText}> View </Text>
          </Pressable>

          <View style={styles.friendDetails}>
            <Text style={[{textAlign: "left"}, styles.buttonText2]}>{item.name}</Text>
            <Text style={[{textAlign: "left", fontSize: 15}, styles.buttonText3]}>{item.email}</Text>
          </View>

          {/* <Pressable 
                  style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#EDA73A': '#ffab00',
                  },
                  styles.button]} 
                  onPress={()=>removeFriend(item)}
                  >
              <Text style={styles.buttonText}> Remove Friend </Text>
          </Pressable> */}
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
  color: '#303030',
},
buttonText3: {
  fontFamily:'Mohave-Bold',
  fontSize: 14,
  fontWeight: '500',
  letterSpacing: 1,
  color: '#303030',
},
goBack:{
    left: -300,
    top: 40
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
  friendDetails:{
    position:'absolute',
    left: 80,
    top: 15
  }
});

export default FriendProfile;