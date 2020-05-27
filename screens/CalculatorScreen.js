import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Keyboard, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const CalculatorScreen = ({ route, navigation }) => {
  /* state functions */
  const [state, setState] = useState({
    latP1: '',
    longP1: '',
    latP2: '',
    longP2: '',
    calculatedDistance: '',
    calculatedBearing: '',
    distanceUnit: 'Kilometers',
    bearingUnit: 'Degrees'
  });

  const updateStateObject = (vals) => {
    setState({
      ...state,
      ...vals
    });
  };

  /*----------------------------------------------------------------------------*/
  /* input validation functions */
  const getErrorMessage = (val) => {
    return isValidNumber(val) ? "" : "Value must be a number";
  }

  const isValidNumber = (val) => {
    let n = Number(val);
    return !Number.isNaN(n);
  }

  const isValidInput = (val) => {
    return isValidNumber(val) && val != '';
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

  const calculate = (latP1, longP1, latP2, longP2, distanceUnit, bearingUnit) => {
    if (!isValidInput(latP1) || !isValidInput(longP1)
      || !isValidInput(latP2) || !isValidInput(longP2)) {
      return;
    } else {
      let calculatedDistance = computeDistance(latP1, longP1, latP2, longP2, distanceUnit);
      let calculatedBearing = computeBearing(latP1, longP1, latP2, longP2, bearingUnit);

      updateStateObject({
        calculatedDistance,
        calculatedBearing
      });
    }
  }

  /* navigation */
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CalculatorSettings', { distanceUnit: state.distanceUnit, bearingUnit: state.bearingUnit })
        }
      >
        <Feather style={{ marginRight: 10 }} name="settings" size={24} />
      </TouchableOpacity >
    )
  });


  /*----------------------------------------------------------------------------*/
  /* lifecycle hooks */
  getFromStorage = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return '';
    }
  }

  saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function getData() {
      let distanceUnit = await getFromStorage('distance-unit');
      let bearingUnit = await getFromStorage('bearing-unit');

      if (distanceUnit != null && bearingUnit != null) {
        updateStateObject({ distanceUnit, bearingUnit })
      }
    }
    getData();
  }, [])

  useEffect(() => {
    if (route.params?.distanceUnit || route.params?.bearingUnit) {
      const { distanceUnit, bearingUnit } = route.params;
      updateStateObject({ distanceUnit, bearingUnit });
      calculate(state.latP1, state.longP1, state.latP2, state.longP2, distanceUnit, bearingUnit);
      saveToStorage('distance-unit', distanceUnit);
      saveToStorage('bearing-unit', bearingUnit);
    }
  }, [route.params?.distanceUnit, route.params?.bearingUnit]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} >
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
            buttonStyle={styles.button}
            title="Calculate"
            onPress={() => {
              calculate(state.latP1, state.longP1, state.latP2, state.longP2, state.distanceUnit, state.bearingUnit)
            }} />

          <Button
            buttonStyle={styles.button}
            title="Clear"
            onPress={clearInputs} />

          <View style={styles.flexTable}>
            <View style={styles.row}>
              <View style={styles.topLeftCol}>
                <Text>Distance: </Text>
              </View>
              <View style={viewColumn}>
                <Text>{state.calculatedDistance}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.bottomLeftCol}>
                <Text>Bearing: </Text>
              </View>
              <View style={styles.bottomRightCol}>
                <Text>{state.calculatedBearing}</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

/*----------------------------------------------------------------------------*/
/* calculation helper function */

// Converts from degrees to radians.
const toRadians = (degrees) => {
  return (degrees * Math.PI) / 180;
}

// Converts from radians to degrees.
const toDegrees = (radians) => {
  return (radians * 180) / Math.PI;
}

// Computes distance between two geo coordinates in kilometers.
const computeDistance = (lat1, lon1, lat2, lon2, distanceUnit) => {
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

  if (distanceUnit == "Miles") {
    d *= 0.621371;
  }

  return `${round(d, 3)} ${distanceUnit}`;
}


// Computes bearing between two geo coordinates in degrees.
const computeBearing = (startLat, startLng, destLat, destLng, bearingUnit) => {
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

  let bearing = (brng + 360) % 360;
  if (bearingUnit == "Mils") {
    bearing *= 17.777777777778;
  }

  return `${round(bearing, 3)} ${bearingUnit}`;
}


const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

/*----------------------------------------------------------------------------*/
/* styling */
const viewColumn = {
  flex: 2,
  justifyContent: 'center',
  alignItems: 'center',
  borderRightWidth: 1,
  borderRightColor: 'black',
  borderTopWidth: 1,
  borderTopColor: 'black',
  padding: 10
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  button: {
    margin: 15,
    backgroundColor: "#457D5A"
  },
  flexTable: {
    margin: 15
  },
  row: {
    flexDirection: 'row',
  },
  topLeftCol: {
    ...viewColumn,
    borderLeftWidth: 1,
    borderLeftColor: 'black',
  },
  bottomLeftCol: {
    ...viewColumn,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderLeftWidth: 1,
    borderLeftColor: 'black'
  },
  bottomRightCol: {
    ...viewColumn,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  }
});

export default CalculatorScreen;