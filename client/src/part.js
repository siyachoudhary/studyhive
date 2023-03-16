import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'

export default class Part extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.center}>
        <Text style={{ marginTop: 20, fontWeight: 'bold', }}>{ this.props.title }</Text>
        <View style={styles.inputContainer}>
          <Text style={{fontFamily: 'Mohave-Light', color: 'white', fontSize: 17}}>Min: </Text>
          {/* props of the work timer minutes */}
          <TextInput style={styles.input} maxLength={2} defaultValue={`${this.props.m}`} keyboardType='number-pad' onChange={ this.props.onChangeM } />

          <Text style={{ marginLeft: 50, fontFamily: 'Mohave-Light', color: 'white', fontSize: 17}}> Sec: </Text>
          {/* props of the work timer minutes */}
          <TextInput style={styles.input} maxLength={2} defaultValue={`${this.props.s}`} keyboardType='number-pad' onChange={ this.props.onChangeS } />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#1d2124',
    height: 25,
    width: 50,
    textAlign: 'center',
    fontFamily: 'Mohave-Medium', 
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Mohave-Medium', 
    color: 'white'
  },
  center: {
    fontFamily: 'Mohave-Medium', 
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white'
  },
})
