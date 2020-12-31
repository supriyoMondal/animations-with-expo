import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// Animations
import TextAnimations from "./animations/TextAnimations";
import WheelOfFortune from "./animations/WheelOfFortune";
import SliderAnimation from "./animations/SliderAnimation";
import List from "./animations/StickyFooter.js/Index";
import AdvanceCarousel from "./animations/Carosel/AdvanceCarosel";
import Timer from "./animations/Timer/Timer";
import ParallaxCarosel from "./animations/Carosel/ParallaxCarosel";
import ScrollableTabs from "./animations/Tabs/ScrollableTabs";
import StackCards from "./animations/CardSwipe/StackCards";

export default function App() {
  return <StackCards />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
