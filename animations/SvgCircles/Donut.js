import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Donut = ({
  percentage = 75,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = "tomato",
  delay = 0,
  textColor,
  max = 100,
}) => {
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const circleRef = React.useRef();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const animation = (toValue) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay: 100,
      useNativeDriver: true,
    }).start(() => {
      animation(toValue === 0 ? percentage : 0);
    });
  };

  useEffect(() => {
    animation(percentage);
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const maxPercentage = (100 * v.value) / max;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPercentage) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            strokeOpacity={0.2}
            fill="transparent"
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            strokeOpacity={1}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default Donut;

const styles = StyleSheet.create({});
