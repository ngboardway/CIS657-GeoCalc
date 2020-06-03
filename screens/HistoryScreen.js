import React, { useState } from "react";
import { StyleSheet, View, TouchableHighlight, Text, FlatList } from "react-native";

const HistoryScreen = ({ route, navigation }) => {
  const { history } = route.params;

  const renderCalculation = ({ item, separators }) => {
    return (
      <TouchableHighlight
        underlayColor='#85eda6'
        onPress={() => navigation.navigate('Geo Calculator', {
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
    );
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
    <FlatList
      data={history}
      renderItem={renderCalculation}
      keyExtractor={(c) => c.id}
      ItemSeparatorComponent={renderSeparator} />
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

export default HistoryScreen;