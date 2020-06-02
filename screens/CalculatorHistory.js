import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, FlatList } from 'react-native';

const CalculatorHistory = ({ route, navigation }) => {

  const calculationHistory = route.params?.calculations;

  const renderCalculation = ({ item, separators }) => {
    return (
      <TouchableHighlight
        underlayColor='#85eda6'
        onPress={() => navigation.navigate('Calculator', {
          startLat: item.startLat,
          startLong: item.startLong,
          endLat: item.endLat,
          endLong: item.endLong
        })}>
        <View style={styles.calculation}>
          <Text style={styles.calculationText}>Start: {item.startLat}, {item.startLong}</Text>
          <Text style={styles.calculationText}>End: {item.endLat}, {item.endLong}</Text>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#457D5A",
        }}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={calculationHistory}
        renderItem={renderCalculation}
        keyExtractor={c => c.id}
        ItemSeparatorComponent={renderSeparator} />
    </View>
  )
};

const styles = StyleSheet.create({
  calculation: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  calculationText: {
    fontSize: 17,
    paddingBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    textAlign: "right"
  }
})

export default CalculatorHistory;