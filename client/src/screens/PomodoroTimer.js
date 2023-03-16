import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, StatusBar } from 'react-native';

// importing components from other files
import Timer from '../timer.js';

export default class App extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <StatusBar barStyle='dark-content' />
        <Text style={[styles.text, styles.boxShadow]}>Work Timer</Text>
        <Timer/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
  },
  text: {
    fontSize: 50,
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontWeight: 'bold',
    fontFamily: 'Mohave-Bold'
  },
//   boxShadow: {
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.50,
//     shadowRadius: 3.84,
//     elevation: 5,
//   }
});
