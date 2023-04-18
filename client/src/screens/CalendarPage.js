import React, { Component } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, Pressable, Dimensions} from "react-native"
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars"
import testIDs from "../testIDs"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import CheckBox from '@react-native-community/checkbox';
import EventBlock from "react-native-calendars/src/timeline/EventBlock";

const SCREENHEIGHT = Dimensions.get('window').height;
const date1 = new Date();
let dayy = date1.getDate() + 1;
let month = date1.getMonth() + 1;
let year = date1.getFullYear();
let arr = {};
let userObject;
let newArr;
let typeColors = ["#5A80F1", "#F08000", "#FFC300", "#B87333", "#00A36C", "#7B68EE", "black"]
let typeName = ["Work", "Exercise", "School", "Chores", "Extracurriculars", "Personal", "Other"]

export default class CalendarPage extends Component {

  componentDidMount() {
    const { navigation } = this.props;
    this.focusUnsubscriber = navigation.addListener('focus', () => {
          this.fetchData();
    });
  }

  componentWillUnmount() {
    this.focusUnsubscriber();
  }

  fetchData() {
    console.log('WHY WONT THIS WORKKKKKKKKKKKKK')
    this.retrieveData(true);
  }

  async saveData(value) {
    try {
      await AsyncStorage.setItem('recentArray', value)
      console.log("stored array")
      console.log(JSON.parse(value))
      this.loadArray()
    } catch (e) {
      // saving error
      console.log('error: ' + e.message)
    }
  }

  async loadArray() {

    AsyncStorage.getItem("recentArray").then(value => {
      if(value != null){
        arr = JSON.parse(value);
        console.log('loaded array')
        console.log(arr)
      } else {
        arr = [];
      }
    }).catch(err => {
      console.log(err.message);  
    })
  }

  state = {
    items: undefined, 
    value0: true,
    value1: false,
    value2: true,
    value3: false,
    value4: false
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
    console.log('RENDERING RAHHHHH')
    return (
      <View style={{flex: 1}} >
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          selected={`${year}-${month}-${dayy}`}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
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
                    onPress={()=>this.props.navigation.navigate("Tasks")}
                >
                    <Text style={styles.buttonText}> ADD TASK </Text>
            </Pressable>
        </View>
      </View>
    )
  }

  retrieveData = rerender => {
    this.loadArray();
    AsyncStorage.getItem("newTask").then(value => {
           if(value != null){
              userObject = JSON.parse(value);
              console.log(userObject);
              console.log(Object.keys(arr).length)
              for (let i = 0; i < Object.keys(arr).length; i++) {
                // console.log(arr[Object.keys(arr)[i]][0].day);
                // console.log(arr[Object.keys(arr)[0]][0]);
                let daynum = arr[Object.keys(arr)[i]][0].day;
                console.log(daynum)
                for (let j = 0; j < arr[daynum].length; j++) {
                  if(daynum == userObject.date && arr[daynum][j].name == userObject.title){
                    console.log("same")
                    return;
                  }
                }
              }
              console.log(arr)
              if (!arr[userObject.date]) {
                arr[userObject.date] = []
              }
              console.log(!arr[userObject.date])
              arr[userObject.date].push({
                name: userObject.title,
                day: userObject.date, 
                time: userObject.time, 
                type: userObject.type, 
                importance: userObject.importance, 
                notes: userObject.notes,
              })
              console.log(arr)
              this.saveData(JSON.stringify(arr))
              if(rerender){
                this.loadItems();
              }
           }
         })
          .catch(err => {
            console.log(err.message);  
          })
  }

  loadItems = date => {
    console.log("rerendering");

    this.retrieveData(false)
    console.log(arr)
    const items = this.state.items || {}

    setTimeout(() => {
      for (let i = 0; i < Object.keys(arr).length; i++) {
        let initialDay = arr[Object.keys(arr)[i]][0].day;
        // console.log(arr[initialDay][0].name);

        // this.canAdd(items[initialDay], arr[Object.keys(arr)[i]])
        // console.log(items[initialDay])
        // console.log(arr[initialDay])
        // console.log(this.canAdd(items[initialDay], arr[Object.keys(arr)[i]]))
        if (!items[initialDay]) {
          items[initialDay] = []

          for (let j = 0; j < arr[initialDay].length; j++) {

            // if(arr[initialDay][j].type == '8'){
            //   arr[initialDay][j].type = '7'
            //   this.saveData(JSON.stringify(arr))
            // }

            items[initialDay].push({
              name: arr[initialDay][j].name,
              height: 85,
              day: arr[initialDay][j].day,
              time: arr[initialDay][j].time, 
              type: arr[initialDay][j].type, 
              importance: arr[initialDay][j].importance, 
              notes: arr[initialDay][j].notes
            })
          }
        } 
        else if (this.canAdd(items[initialDay], arr[Object.keys(arr)[i]])){
          items[initialDay] = []

          for (let j = 0; j < arr[initialDay].length; j++) {
            items[initialDay].push({
              name: arr[initialDay][j].name,
              height: 85,
              day: arr[initialDay][j].day,
              time: arr[initialDay][j].time, 
              type: arr[initialDay][j].type, 
              importance: arr[initialDay][j].importance, 
              notes: arr[initialDay][j].notes
            })
            console.log('items: ' + items[initialDay][j])
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

  canAdd = (arr1, arr2) => {
      for(let i = 0; i < arr2.length; i++) {
        for(let j = 0; j < arr1.length; j++) {
            if(arr2[i].name == arr1[j].name && arr2.length == arr1.length){
              console.log('FALSE')
              return false;
            }
        }
      }
      return true;
  }

  renderItem = (reservation) => {
    const fontSize = 20;
    const color = "black";
    const borderColor = typeColors[+reservation.type - 1]
    console.log(+reservation.type - 1)
    console.log(typeName[7])

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height:reservation.height, borderColor}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <View style={{flexDirection: "row"}}>
          <Text style={{fontSize, color, fontFamily: 'Mohave-Medium'}}>{reservation.name}</Text>
          <View style={{flex: 1}}>
            <Text style={{fontSize, color:borderColor, fontFamily: 'Mohave-Medium', textAlign: 'right'}}>{typeName[[+reservation.type - 1]]}</Text>
          </View>
        </View>
        <Text style={{fontSize: 12, color, fontFamily: 'Mohave-Light', letterSpacing: .5}}>{reservation.notes}</Text>
      </TouchableOpacity>
    )
  }

  renderEmptyDate = () => {
    const fontSize = 18;
    const color = "white";

    return(      
      <View style={styles.emptyDate}>
        <Text style={{fontSize, color, fontFamily: 'Mohave-Medium'}}>You Have No Future Events</Text>
      </View>
    );
    // return (
    //   <TouchableOpacity
    //     testID={testIDs.agenda.ITEM}
    //     style={[styles.item, { height:50}]}
    //     onPress={() => Alert.alert('reservation.name')}
    //   >
    //     <Text style={{fontSize, color, fontFamily: 'Mohave-Medium'}}>{'bffr'}</Text>
    //   </TouchableOpacity>
    // )
  }

  rowHasChanged = (r1, r2) => {
    return r1 !== r2
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
    marginTop: 17, 
    borderWidth: 5, 
  },
  emptyDate: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
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
