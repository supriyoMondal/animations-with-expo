import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { keyframes } from "popmotion";

const CallerAnimation = () => {
  return (
    <View style={styles.container}>
      <Text>Caller</Text>
    </View>
  );
};

export default CallerAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
