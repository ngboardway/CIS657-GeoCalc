import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

const CalculatorSettingsScreen = ({ route, navigation }) => {
  const { distanceUnit: initialDistanceUnit, bearingUnit: initialBearingUnit } = route.params;

  const [distanceUnit, setDistanceUnit] = useState(initialDistanceUnit);
  const [bearingUnit, setBearingUnit] = useState(initialBearingUnit);

  let distanceUnits = [{
    value: 'Miles'
  },
  {
    value: 'Kilometers'
  }];

  let bearingUnits = [{
    value: 'Degrees'
  },
  {
    value: 'Mils'
  }];

  navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Calculator', {
            distanceUnit,
            bearingUnit
          })
        }}>

        <Text> Save </Text>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Calculator')}>
        <Text> Cancel </Text>
      </TouchableOpacity>
    )
  })

  return (
    <View style={styles.container}>
      <Dropdown
        label='Distance Units'
        data={distanceUnits}
        value={distanceUnit}
        onChangeText={(value) => setDistanceUnit(value)} />
      <Dropdown
        label='Bearing Units'
        data={bearingUnits}
        value={bearingUnit}
        onChangeText={(value) => setBearingUnit(value)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  button: {
    margin: 10
  }
});


export default CalculatorSettingsScreen;