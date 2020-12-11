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
      <TextAnimator
        containerStyle={{ marginHorizontal: 24 }}
        duration={1000}
        textStyle={styles.text}
        content="Animating text with react native is fairly simple and fun to learn hope you ❤️ it. "
      />
    </View>
  );
};

export default TextAnimations;

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 35,
    letterSpacing: 0.5,
  },
});
