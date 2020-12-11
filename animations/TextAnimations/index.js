import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TextAnimator from "./TextAnimator";

const TextAnimations = () => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <TextAnimator content="hello world" />
    </View>
  );
};

export default TextAnimations;

const styles = StyleSheet.create({});
