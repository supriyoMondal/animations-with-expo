import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// Animations
import TextAnimations from "./animations/TextAnimations";
import WheelOfFortune from "./animations/WheelOfFortune";
import SliderAnimation from "./animations/SliderAnimation";
import CallerAnimation from "./animations/Carosel/AdvanceCarosel";
import List from "./animations/StickyFooter.js/Index";

export default function App() {
  return <List />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
