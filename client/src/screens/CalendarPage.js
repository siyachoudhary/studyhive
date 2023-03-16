import React, { Component } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, Image, Pressable, Dimensions} from "react-native"
import { Agenda } from "react-native-calendars"
import testIDs from "../testIDs"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SlideOutDown } from "react-native-reanimated";

const SCREENHEIGHT = Dimensions.get('window').height;
const SCREENWIDTH = Dimensions.get('window').width;
const date1 = new Date();
let dayy = date1.getDate() + 1;
let month = date1.getMonth() + 1;
let year = date1.getFullYear();
let arr = {"2023-03-16": [{"day": "2023-03-16", "name": "Computer Science Project Due"}], "2023-03-17": [{"day": "2023-03-17", "name": "Work On Debate Speeches"}, {"day": "2023-03-17", "name": "Math Homework Due"}], "2023-03-19": [{"day": "2023-03-19","name": "English Prospectus"}]
};
let userObject;
console.log(Object.keys(arr).length);
export default class CalendarPage extends Component {
  state = {
    items: undefined
  }

  // useEffect(()=>{
  //   const retrieveData = async () => {
  //     try {
  //         value = await AsyncStorage.getItem('user')
  //         console.log(value)
  //         if(value!=undefined){
  //           navigation.navigate("Home")
  //         }
  //       } catch(e) {
  //         console.log(e.message)
  //       }
  //   }

  //   retrieveData()
  // })

  // async function retrieveData(){
  //   try {
  //             value = await AsyncStorage.getItem('user')
  //             console.log(value)
  //             if(value!=undefined){
  //               navigation.navigate("Home")
  //             }
  //           } catch(e) {
  //             console.log(e.message)
  //           }
  // }
  // reservationsKeyExtractor = (item, index) => {
  //   return `${item?.reservation?.day}${index}`;
  // };

  render() {
    return (
      <View style={{flex: 1 }} >
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          selected={`${year}-${month}-${dayy}`}
          renderEmptyDate={this.renderEmptyDate}
          renderItem={this.renderItem}
          rowHasChanged={this.rowHasChanged}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#43515c'},
          //    '2017-05-09': {textColor: '#43515c'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          theme={{calendarBackground: '#2F2F2F', 
                  reservationsBackgroundColor: '#292929',
                  agendaKnobColor: '#FFAF33', 
                  textMonthFontFamily: 'Mohave-Medium', 
                  textMonthFontSize: 25, 
                  monthTextColor: '#979797',
                  textDayFontFamily: 'Mohave-Medium', 
                  textDayFontSize: 16,
                  dayTextColor: '#D4D5D8', 
                  textDisabledColor: '#979797',}}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          // renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
          hideExtraDays={true}
          // showOnlySelectedDayItems
          // reservationsKeyExtractor={this.reservationsKeyExtractor}
          showClosingKnob={true}
        />
        <View style={{backgroundColor: "#292929"}}>
          <Pressable 
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#EDA73A': '#ffab00',
                    },
                    styles.button]} 
                    onPress={()=>this.props.navigation.navigate("AddTask")}
                >
                    <Text style={styles.buttonText}> ADD TASK </Text>
            </Pressable>
        </View>
      </View>
    )
  }

  retrieveData = () => {
    AsyncStorage.getItem("newTask").then(value => {
           if(value != null){
              userObject = JSON.parse(value);
              console.log(userObject);
              console.log(Object.keys(arr).length)
              for (let i = 0; i < Object.keys(arr).length; i++) {
                console.log(i)
                // console.log(arr[Object.keys(arr)[i]][0].day);
                // console.log(arr[Object.keys(arr)[0]][0]);
                let daynum = arr[Object.keys(arr)[i]][0].day;
                for (let j = 0; j < arr[daynum].length; j++) {
                  if(daynum == userObject.date && arr[daynum][j].name == userObject.title){
                    return;
                  }
                }
              }
              console.log(arr[userObject.date])
              if (!arr[userObject.date]) {
                arr[userObject.date] = []
              }
              arr[userObject.date].push({
                name: userObject.title,
                day: userObject.date
              })
              console.log(arr)
           }
         })
          .catch(err => {
            console.log(err.message);  
          })
  }

  loadItems = day => {
    this.retrieveData()
    console.log(arr);
    const items = this.state.items || {}

    setTimeout(() => {
      for (let i = 0; i < Object.keys(arr).length; i++) {
        let initialDay = arr[Object.keys(arr)[i]][0].day;
        // console.log(arr[initialDay][0].name);

        if (!items[initialDay]) {
          items[initialDay] = []

          for (let j = 0; j < arr[initialDay].length; j++) {
            items[initialDay].push({
              name: arr[initialDay][j].name,
              height: 50,
              day: arr[initialDay][j].day
            })
          }
        }
      }

      const newItems = {}
      Object.keys(items).forEach(key => {
        newItems[key] = items[key]
      })
      this.setState({
        items: newItems
      })
    }, 1000)
  }

  renderItem = (reservation) => {
    const fontSize = 18;
    const color = "black";

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height:50}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color, fontFamily: 'Mohave-Medium'}}>{reservation.name}</Text>
      </TouchableOpacity>
    )
  }

  renderEmptyDate = () => {
    console.log('empty date bruh');
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name
  }

  timeToString(time) {
    const date = new Date(time)
    return date.toISOString().split("T")[0]
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }, 
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    // elevation: 8,
    marginHorizontal: SCREENHEIGHT/9,
    marginVertical: SCREENHEIGHT/100,
  },
  buttonText: {
    fontFamily:'Mohave-Bold',
    fontSize: 15,
    fontWeight: 'bold',
    // lineHeight: 25,
    letterSpacing: 1,
    color: '#303030',
}
})