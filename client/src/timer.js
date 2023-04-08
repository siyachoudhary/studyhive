// import React, { Component } from 'react'
// import { View, Text, StyleSheet, Button } from 'react-native'

// // importing the timer part from another file
// import Part from './part.js'

// export default class Timer extends Component {

//   constructor() {
//     super()
//     this.state = {
//       preMW: 25, // value to reset mW to
//       mW: 25,
//       preSW: 0, // value to reset sW to
//       sW: 0,
//       preMR: 5, // value to reset mR to
//       mR: 5,
//       preSR: 0, // value to reset sR to
//       sR: 0,
//       workTime: true,
//       preTimer: '25:00', // value to reset timer to
//       timer: '25:00',
//       condition: 'Start',
//     }
//   }

//   formatNumber(num) {
//     var str = String(num)
//     if (str.length === 1) {
//       str = '0' + str;
//     }
//     return str;
//   }

//   runTimer = () => {
//     if (this.state.workTime){
//       if (this.state.sW === 0) {
//         this.setState(pre => ({mW: pre.mW - 1, sW: 59 }))
//       } else if (this.state.sW >= 0) {
//         this.setState(pre => ({sW: pre.sW - 1}))
//       }
//       this.setState({timer: this.formatNumber(this.state.mW) + ':' + this.formatNumber(this.state.sW)})

//       if (this.state.mW === 0 && this.state.sW === 0) {
//         this.toggleTimer()
//       }
//     } else {
//       if (this.state.sR === 0) {
//         this.setState(pre => ({mR: pre.mR - 1, sR: 59 }))
//       } else if (this.state.sR >= 0) {
//         this.setState(pre => ({sR: pre.sR - 1}))
//       }
//       this.setState({timer: this.formatNumber(this.state.mR) + ':' + this.formatNumber(this.state.sR)})

//       if (this.state.mR === 0 && this.state.sR === 0) {
//       this.toggleTimer()
//         this.setState(state => ({mW: state.preMW, sW: state.preSW, sR: state.preSR, mR: state.preMR, timer: state.preTimer}))
//       }
//     }
//   }

//   controlTimer = () => {
//     clearInterval(this.clock)
//     if (this.state.condition === 'Start') {
//       this.setState({condition: 'Pause'})
//       this.clock = setInterval(this.runTimer, 1000)
//     } else {
//       this.setState({condition: 'Start'})
//       clearInterval(this.clock)
//     }
//   }

//   reset = () => {
//     this.setState(state => ({mW: state.preMW, sW: state.preSW, sR: state.preSR, mR: state.preMR, timer: state.preTimer}))
//     this.setState({condition: 'Start'})
//     clearInterval(this.clock)
//     this.setState({workTime: true})
//   }

//   toggleTimer = () => {
//     this.setState(pre => ({workTime: !pre.workTime}))
//   }

//   updateTimer = () => {
//     this.setState(pre => ({preTimer: this.formatNumber(pre.preMW) + ':' + this.formatNumber(pre.preSW) }))
//     this.setState(pre => ({timer: this.formatNumber(pre.preMW) + ':' + this.formatNumber(pre.preSW) }))
//   }

//   // used in the onChange prop in the 'Part' Component
//   changeValueMW(id, value) {
//     if (value === '' || value === null || value === 'NaN') {
//       return false;
//     }
//     var num = Number(value.nativeEvent.text);
//     switch(id) {
//       case 0:
//         this.setState({preMW: num, mW: num});
//         this.updateTimer();
//         break;
//       case 1:
//         this.setState({preSW: num, sW: num});
//         this.updateTimer();
//         break;
//       case 2:
//         this.setState({preMR: num, mR: num});
//         this.updateTimer();
//         break;
//       case 3:
//         this.setState({preSR: num, sR: num});
//         this.updateTimer();
//         break;
//     }
//     this.reset();
//   }

//   componentWillUnmount() {
//     clearInterval(this.clock);
//   }

//   render() {
//     return(
//       <View style={styles.center}>
//         <Text style={styles.timer}>{this.state.timer}</Text>
//         <View style={styles.btnContainer}>
//           <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} />
//           <Button title='Reset' color='red' onPress={this.reset} />
//         </View>

//         {/* Work timer inputs */}
//         <Part title='Set Working Time' m={this.state.preMW} s={this.state.preSW} onChangeM={text => this.changeValueMW(0, text)} onChangeS={text => this.changeValueMW(1, text)}/>

//         {/* Rest timer inputs */}
//         <Part title='Set Rest Time' m={this.state.preMR} s={this.state.preSR} onChangeM={text => this.changeValueMW(2, text)} onChangeS={text => this.changeValueMW(3, text)}/>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//   },
//   timer: {
//     fontSize: 50,
//     alignItems: 'center',
//     padding: 20,
//     color: 'white', 
//     fontFamily: 'Mohave-Medium'
//   },
//   btnContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
// });


import React, { Component, useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

// importing the timer part from another file
import Part from './part.js'

export default class Timer extends Component {

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
      }
    }
  }

  controlTimer = () => {
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
        <Text style={styles.timer}>{this.state.timer}</Text>
        <View style={styles.btnContainer}>
          <Button title={this.state.condition} color='darkgreen' onPress={this.controlTimer} />
          <Button title='Reset' color='red' onPress={this.reset} />
        </View>

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
  timer: {
    fontSize: 50,
    alignItems: 'center',
    padding: 20,
    color: 'white', 
    fontFamily: 'Mohave-Medium'
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
