import React, { Component } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, Pressable, Dimensions} from "react-native"
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars"
import testIDs from "../testIDs"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
// import CheckBox from '@react-native-community/checkbox';
import EventBlock from "react-native-calendars/src/timeline/EventBlock";
import CheckBox from 'react-native-check-box'
import { convertAbsoluteToRem } from "native-base/lib/typescript/theme/tools";

const SCREENHEIGHT = Dimensions.get('window').height;
const date1 = new Date();
let dayy = date1.getDate() + 1;
let month = date1.getMonth() + 1;
let year = date1.getFullYear();
let arr = {"2023-04-17": [{"day": "2023-04-17", "importance": "- Major", "name": "CS Class", "notes": "", "time": "11:03 PM", "type": "7"}]};
let userObject;
let lastUserObject;
let newArr;
let typeColors = ["#5A80F1", "#F08000", "#FFC300", "#B87333", "#00A36C", "#7B68EE", "black"]
let typeName = ["Work", "Exercise", "School", "Chores", "Extracurriculars", "Personal", "Other"]
let impName = ['- Major', '- Moderate', '- Minor']
let itemNames = [];
let deleteItem = false;
let deleted;
let indexOfObj;

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

  async saveValue(value) {
    try {
      await AsyncStorage.setItem('recentValue', value)
      console.log("stored value")
      console.log(JSON.parse(value))
      this.loadValue()
    } catch (e) {
      // saving error
      console.log('error: ' + e.message)
    }
  }

  loadArray() {
    AsyncStorage.getItem("recentArray").then(value => {
      if(value != null){
        arr = JSON.parse(value);
        console.log('loaded array')
        console.log(arr)
      }
    }).catch(err => {
      console.log(err.message);  
    })
  }

  loadValue() {
    AsyncStorage.getItem("recentValue").then(value => {
      if(value != null){
        lastUserObject = JSON.parse(value);
        console.log('loaded value')
        console.log(lastUserObject)
      }
    }).catch(err => {
      console.log(err.message);  
    })
  }

  state = {
    items: undefined, 
    boxChecked: []
  }

//   constructor(props) {
//     super(props)
//     this.state = {
//         boxChecked: []
//     };
// }
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

  retrieveData = async rerender => {
    this.loadArray();
    this.loadValue();
    console.log(arr)
    AsyncStorage.getItem("newTask").then(value => {
           if(value != null){
              userObject = JSON.parse(value);
              console.log(userObject);
              console.log(Object.keys(arr).length)
              // console.log((deleted.day == userObject.date && deleted.name == userObject.title))
              console.log(deleted)
              if(deleted){
                if(deleted.day == userObject.date && deleted.name == userObject.title){
                  return;
                }
                console.log(deleted.day)
              }
              for (let i = 0; i < Object.keys(arr).length; i++) {
                // console.log(arr[Object.keys(arr)[i]][0].day);
                // console.log(arr[Object.keys(arr)[0]][0]);
                //userObject.day + " " + userObject.name

                let daynum = arr[Object.keys(arr)[i]][0].day;
                let box = this.state.boxChecked;

                for (let j = 0; j < arr[daynum].length; j++) {
                  if((daynum == userObject.date && arr[daynum][j].name == userObject.title)){
                      console.log('same1')
                      return;
                  } else if (!(!lastUserObject)){
                    if((lastUserObject.date == userObject.date && lastUserObject.title == userObject.title)){
                      console.log('same2')
                      return;
                    } else (
                      console.log('didnt happen')
                    )
                  }
                }
              }
              
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
              lastUserObject = JSON.parse(JSON.stringify(userObject));
              this.saveValue(JSON.stringify(lastUserObject))
              console.log('is this even working')
              console.log(lastUserObject)
              console.log((lastUserObject.date == userObject.date && lastUserObject.title == userObject.title))
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

      // deleteItem = false;
      console.log("items")
      console.log(items)

      console.log("array")
      console.log(arr)
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
              height: 90,
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
              height: 90,
              day: arr[initialDay][j].day,
              time: arr[initialDay][j].time, 
              type: arr[initialDay][j].type, 
              importance: arr[initialDay][j].importance, 
              notes: arr[initialDay][j].notes
            })
            // console.log('items: ' + items[initialDay][j])
          }
        }
      }
    
      console.log('items')
      console.log(items)
      if(Object.keys(arr).length != Object.keys(items).length){
        console.log('NOT EQUAL')
        console.log(deleted.day)
        delete items[deleted.day]
        // const sliced = Object.keys(items).slice(0, indexOfObj).reduce((result, key) => {
        //   result[key] = items[key];

        //   return result;
        // }, {});
        // const sliced2 = Object.keys(items).slice(indexOfObj + 1).reduce((result, key) => {
        //     result[key] = items[key];

        //     return result;
        // }, {});

        // const sliced3 = {
        //   ...sliced, 
        //   ...sliced2
        // };
        
        // console.log(sliced3);

        // items = JSON.parse(JSON.stringify(sliced3))

        // console.log(items)
      } else {
        console.log('IS EQUAL')
      }

      console.log(items)
      itemNames = [];
      Object.keys(items).forEach(key => {
        for (let index = 0; index < items[key].length; index++) {
          itemNames.push(items[key][index].day  + " " +  items[key][index].name)
          console.log(items[key][index].day + " " + items[key][index].name);
        }
      })

      const newItems = {}
      Object.keys(items).forEach(key => {
        newItems[key] = items[key]
      })
      this.setState({
        items: newItems
      })

    }, 500)
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

  removeItem = (info) => {
    let date = info.substring(0, 10)
    let name = info.substring(11)
    let newArr = {};
    let index;
    
    setTimeout(() => {
      if(deleteItem){
        console.log('RUNNINGGGG')
        for (let i = 0; i < Object.keys(arr).length; i++) {
          let initialDay = arr[Object.keys(arr)[i]][0].day;
          for (let j = 0; j < arr[initialDay].length; j++) {
            if(initialDay != date || arr[initialDay][j].name != name){
              // console.log(newArr)
              if (!Object.keys(newArr).length) {
                console.log("i ran")
                Object.assign(newArr, {[initialDay]: [{name: arr[initialDay][j].name,
                  day: arr[initialDay][j].day,
                  time: arr[initialDay][j].time, 
                  type: arr[initialDay][j].type, 
                  importance: arr[initialDay][j].importance, 
                  notes: arr[initialDay][j].notes}]});
              } else {
                if (!newArr[initialDay]) {
                  newArr[initialDay] = []
                }
                newArr[initialDay].push({
                  name: arr[initialDay][j].name,
                  day: arr[initialDay][j].day,
                  time: arr[initialDay][j].time, 
                  type: arr[initialDay][j].type, 
                  importance: arr[initialDay][j].importance, 
                  notes: arr[initialDay][j].notes
                })
              }
            } else {
              indexOfObj = i
              deleted = {
                name: arr[initialDay][j].name,
                day: arr[initialDay][j].day,
                time: arr[initialDay][j].time, 
                type: arr[initialDay][j].type, 
                importance: arr[initialDay][j].importance, 
                notes: arr[initialDay][j].notes};
            }
          }
        }

        // deleted = JSON.parse(JSON.stringify(newDeleted))
        console.log(" ")
        console.log(" ")
        console.log(deleted)
        console.log(" ")
        console.log(" ")
        console.log(newArr)
        console.log(" ")
        console.log(" ")
        console.log(arr)
        console.log(" ")
        this.saveData(JSON.stringify(newArr))

        // this.loadItems()
        setTimeout(() => {
          console.log(" ")
          console.log(arr)
          console.log(" ")
          // if(deleteItem){
          //   console.log('set to undefined')
          //   this.setState({
          //     items: undefined
          //   })      
          // }
          this.loadItems()
        }, 50)
      }
    }, 1000)
    // let index = itemNames.indexOf(deleted.day + deleted.name)

    // let toRemove = arr[date].findIndex((object) => object.key == arr[date][j].key)
    // console.log('what r u' + arr[daynum][j])
    // console.log(toRemove)
    // console.log(arr[daynum].slice(0, 1))
    // arr[daynum].slice(toRemove, 1)

  }

  renderItem = (reservation) => {
    const fontSize = 20;
    const color = "black";
    const borderColor = typeColors[+reservation.type - 1]
    // console.log(+reservation.type - 1)
    let timeColor = 'black';
    let timeName = "Due";
    let addTask = "";
    if(this.isLate(reservation.day, reservation.time)){
      timeColor = 'red';
      timeName = "Overdue";
    }
    if(reservation.importance != ""){
      addTask = "Task"
    }

    // console.log(itemNames)
    // console.log(itemNames.indexOf(reservation.day + reservation.name))
    let index = itemNames.indexOf(reservation.day + reservation.name)
    // console.log(reservation.name + " " + index)
    // if(!items){
    //   if(items[reservation.date] == []){
    //     return;
    //   }
    // }
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height:reservation.height, borderColor}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <View style={{flexDirection: "row", marginTop: -1}}>
          <Text style={{fontSize, color, fontFamily: 'Mohave-Medium'}}>{reservation.name}</Text>
          <View style={{flex: 1}}>
            <Text style={{fontSize, color:borderColor, fontFamily: 'Mohave-Medium', textAlign: 'right'}}>{typeName[[+reservation.type - 1]]} </Text>
          </View>
        </View>
        <Text style={{fontSize: 12, color, fontFamily: 'Mohave-Light', letterSpacing: .5}}>{reservation.notes}</Text>
        <View style={{flexDirection: "row"}}>
          <Text style={{fontSize: 15, color: timeColor, fontFamily: 'Mohave-Medium', letterSpacing: 0}}>{timeName}: {reservation.time} {impName[[reservation.importance -1]]} {addTask}</Text>
          <View style={{flex: 1, alignItems:'stretch'}}>
          <CheckBox
              style={{alignSelf: 'flex-end', marginTop: -2}}
              onClick={()=>{
                this.boxIsChecked(reservation.day + " " + reservation.name)
              }}
              isChecked={this.state.boxChecked.includes(reservation.day + " " + reservation.name)}
          />
            {/* <Text style={{fontSize: 15, color: timeColor, fontFamily: 'Mohave-Medium', letterSpacing: 0, textAlign: 'right'}}>{impName[[reservation.importance -1]]} {addTask}</Text> */}
          </View>
        </View>
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

  isLate(date, time) {
    let now = new Date()  
    let year = date.slice(0, 4) * 1;
    let month = date.slice(5, 7) * 1;
    let day = date.slice(8) * 1;
    let hours = time.substring(0, time.indexOf(":")) * 1;
    let minutes = time.substring(time.indexOf(":") + 1, time.indexOf(" ")) * 1;
    // console.log(hours + " " + minutes)
    // console.log(time)
    if(time.includes('PM')){
      hours += 12;
    }

    let total = hours*60 + minutes;

    var day2 = ('0' + now.getDate()).slice(-2) * 1;
    var month2 = ('0' + (now.getMonth()+1)).slice(-2) * 1; 
    var year2 = now.getFullYear() * 1;
    var hours2 = now.getHours() * 1
    var minutes2 =  ('0' + now.getMinutes()).slice(-2) * 1;

    let total2 = hours2*60 + minutes2;

    if(hours2 > 12){
      hours -= 12;
    }

    if(year < year2){
      return true;
    } else if(year == year2){
      if (month < month2){
        return true;
      } else if(month == month2){
        if(day < day2){
          return true;
        } else if(day == day2){
          if(total < total2){
            return true;
          }
        }
      }
    }

    return false;
  }

  boxIsChecked(info){
    // this.setState(prevState => {
    //   const {boxChecked} = prevState
    //   let index2 = boxChecked.indexOf(index, 1);
    //   if (index2 === -1) { //not found
    //     boxChecked.push(index) // add id to selected list
    //   } else {
    //     boxChecked.splice(index, 1) // remove from selected list
    //   }
    //   return {boxChecked}
    // });
    console.log('clicked')
    let box = this.state.boxChecked;
    console.log("box1: " + box)
    console.log(box.includes(info))
    // let index = itemNames.indexOf(info)
    let index2 = box.indexOf(info, 1);
    console.log(index2)
    if (!box.includes(info)) { 
      box.push(info)
      console.log('checked')
      deleteItem = true;
      this.removeItem(info)
    }
    else {
       box.splice(info, 1) 
       deleteItem = false;
       console.log('unchecked')
    }
    console.log("box2: " + box)
    this.setState({boxChecked: box})
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
