import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("screen");

const minAge = 0;
const segmentLength = 91;
const segmentWidth = 2;
const segmentSpacing = 20;
const snapSegment = segmentWidth + segmentSpacing;
const rulerWidth = (segmentLength - 1) * snapSegment;
const spacerWidth = (width - segmentWidth) / 2;
const initialAge = 25;

const data = [...Array(segmentLength).keys()].map((i) => i + minAge);

const Ruler = () => (
  <View style={styles.ruler}>
    <View style={styles.spacer} />
    {data.map((i) => {
      const tenth = i % 10 === 0;
      return (
        <View
          key={i}
          style={[
            styles.segment,
            {
              backgroundColor: tenth ? "#333" : "#999",
              height: tenth ? 40 : 20,
              marginRight: i === data.length - 1 ? 0 : segmentSpacing,
            },
          ]}
        ></View>
      );
    })}
    <View style={styles.spacer} />
  </View>
);

const SliderAnimation = () => {
  const [scrollX, setScrollX] = useState(0);
  const scrollViewRef = useRef();
  const [inputVal, setInputValue] = useState(25);

  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: snapSegment * initialAge,
          y: 0,
          animated: true,
        });
      }
    }, 200);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/cake.gif")}
        resizeMode="cover"
        style={styles.cake}
      />
      <View
        style={{
          alignSelf: "center",
          position: "absolute",
          bottom: 60,
        }}
      >
        <TextInput
          value={inputVal.toString()}
          style={{ fontSize: 42, textAlign: "center" }}
        />
      </View>
      <View style={styles.mark} />
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollView}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        onScroll={({
          nativeEvent: {
            contentOffset: { x },
          },
        }) => {
          setScrollX(x);
          setInputValue(Math.round(x / snapSegment));
        }}
      >
        <Ruler />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default SliderAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cake: {
    width,
    height: width * 1.2,
  },
  ruler: {
    width: rulerWidth + 2 * spacerWidth + 2,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  segment: {
    width: segmentWidth,
  },
  scrollView: {
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  spacer: {
    backgroundColor: "red",
    width: spacerWidth,
  },
  mark: {
    alignSelf: "center",
    position: "absolute",
    height: 60,
    backgroundColor: "cyan",
    width: 2,
    bottom: 5,
    zIndex: 5,
  },
});
