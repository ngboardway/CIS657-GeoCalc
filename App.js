import React from 'react';
import { StyleSheet } from 'react-native';
import CalculatorScreen from './screens/CalculatorScreen';
import CalculatorHistory from './screens/CalculatorHistory';
import CalculatorSettingsScreen from './screens/CalculatorSettings';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const Stack = createStackNavigator();

  const headerOptions = {
    headerStyle: {
      backgroundColor: '#457D5A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    cardStyle: styles.card
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={headerOptions} >
        <Stack.Screen
          name="Calculator"
          component={CalculatorScreen} />
        <Stack.Screen
          name="Calculator Settings"
          component={CalculatorSettingsScreen} />
        <Stack.Screen
          name="Calculator History"
          component={CalculatorHistory} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b0e8c6'
  }
})