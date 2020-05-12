import React from 'react';
import { StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CalculatorScreen from './screens/CalculatorScreen';


export default function App() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} >
        <CalculatorScreen />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 20,
    flex: 1
  },
});