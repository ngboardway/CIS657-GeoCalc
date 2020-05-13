import React, { useState } from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';

const CalculatorScreen = () => {
  const [state, setState] = useState({
    latP1: '',
    longP1: '',
    latP2: '',
    longP2: '',
    calculatedDistance: '',
    calculatedBearing: ''
  });

  const updateStateObject = (vals) => {
    setState({
      ...state,
      ...vals
    });
  };


  const getErrorMessage = (val) => {
    return isValidInput(val) ? "" : "Value must be a number";
  }

  const isValidInput = (val) => {
    let n = Number(val);
    return !Number.isNaN(n);
  }

  const clearInputs = () => {
    updateStateObject({
      latP1: '',
      longP1: '',
      latP2: '',
      longP2: '',
      calculatedDistance: '',
      calculatedBearing: ''
    });

    Keyboard.dismiss();
  }

  const calculate = () => {
    if (!isValidInput(state.latP1) || !isValidInput(state.longP1)
      || !isValidInput(state.latP2) || !isValidInput(state.longP2)) {
      return;
    } else {
      let calculatedDistance = computeDistance(state.latP1, state.longP1, state.latP2, state.longP2);
      let calculatedBearing = computeBearing(state.latP1, state.longP1, state.latP2, state.longP2);

      updateStateObject({
        calculatedDistance: `Distance: ${calculatedDistance}`,
        calculatedBearing: `Bearing: ${calculatedBearing}`
      });
    }
  }

  // Converts from degrees to radians.
  const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  }

  // Converts from radians to degrees.
  const toDegrees = (radians) => {
    return (radians * 180) / Math.PI;
  }

  // Computes distance between two geo coordinates in kilometers.
  const computeDistance = (lat1, lon1, lat2, lon2) => {
    console.log(`p1={${lat1},${lon1}} p2={${lat2},${lon2}}`);

    var R = 6371; // km (change this constant to get miles)

    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return `${round(d, 3)} km`;

    // if (d > 1) return Math.round(d) + "km";
    //else if (d <= 1) return Math.round(d * 1000) + "m";
    // return d;
  }


  // Computes bearing between two geo coordinates in degrees.
  const computeBearing = (startLat, startLng, destLat, destLng) => {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    var y = Math.sin(destLng - startLng) * Math.cos(destLat);

    var x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);

    var brng = Math.atan2(y, x);
    brng = toDegrees(brng);

    let degrees = (brng + 360) % 360;
    return `${round(degrees, 3)} degrees`;
  }


  const round = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder='Enter latitude for point 1'
        errorMessage={getErrorMessage(state.latP1)}
        onChangeText={(val) => updateStateObject({ latP1: val })}
        value={state.latP1}
      />
      <Input
        placeholder='Enter longitude for point 1'
        errorMessage={getErrorMessage(state.longP1)}
        onChangeText={(val) => updateStateObject({ longP1: val })}
        value={state.longP1}
      />
      <Input
        placeholder='Enter latitude for point 2'
        errorMessage={getErrorMessage(state.latP2)}
        onChangeText={(val) => updateStateObject({ latP2: val })}
        value={state.latP2}
      />
      <Input
        placeholder='Enter longitude for point 2'
        errorMessage={getErrorMessage(state.longP2)}
        onChangeText={(val) => updateStateObject({ longP2: val })}
        value={state.longP2}
      />
      <Button
        title='Calculate'
        onPress={calculate}
        style={styles.button} />
      <Button
        title='Clear'
        onPress={clearInputs}
        style={styles.button} />
      <Text>{state.calculatedDistance}</Text>
      <Text>{state.calculatedBearing}</Text>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  button: {
    margin: 10
  }
});

export default CalculatorScreen;