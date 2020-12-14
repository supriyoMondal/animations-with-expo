import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text as RNText,
  Animated,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Path, G, Text, TSpan, Svg } from "react-native-svg";
import color from "randomcolor";
import * as d3Shape from "d3-shape";
import { snap } from "@popmotion/popcorn";

const { width } = Dimensions.get("window");
const numberOfSegments = 10;
const wheelSize = width * 0.9;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;

const makeWheel = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);
  const colors = color({
    luminosity: "dark",
    count: numberOfSegments,
  });

  return arcs.map((arc, i) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    return {
      path: instance(arc),
      color: colors[i],
      value: Math.round(Math.random() * 10 + 1) * 200,
      centroid: instance.centroid(arc),
    };
  });
};

const WheelOfFortune = () => {
  const wheelPaths = makeWheel();
  const [enabled, setEnabled] = useState(true);

  const angle = new Animated.Value(0);

  const addListenerToAngle = () => {
    angle.addListener(() => {
      if (enabled) {
        console.log("enabled");
        setEnabled(false);
      }
    });
  };

  useEffect(() => {
    addListenerToAngle();
  }, []);

  const onPan = ({ nativeEvent }) => {
    const { velocityY } = nativeEvent;

    Animated.decay(angle, {
      velocity: velocityY / 1000,
      deceleration: 0.999,
      useNativeDriver: true,
    }).start(() => {
      console.log("disabled");
      setEnabled(true);
    });
  };

  const SvgWheel = () => {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            alignItems: "center",
            justifyContent: "center",
            transform: [
              {
                rotate: angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                }),
              },
            ],
          }}
        >
          <Svg
            height={wheelSize}
            width={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{
              transform: [{ rotate: `-${angleOffset}deg` }],
            }}
          >
            <G x={width / 2} y={width / 2}>
              {wheelPaths.map((arc, i) => {
                const number = arc.value.toString();
                const [x, y] = arc.centroid;
                return (
                  <G key={`arc -${i}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G
                      origin={`${x},${y}`}
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    >
                      <Text
                        fontSize={fontSize}
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                      >
                        {Array.from({ length: number.length }).map((_, j) => (
                          <TSpan x={x} dy={fontSize} key={j}>
                            {number.charAt(j)}
                          </TSpan>
                        ))}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };

  return (
    <PanGestureHandler enabled={enabled} onHandlerStateChange={onPan}>
      <View style={styles.container}>
        <SvgWheel />
      </View>
    </PanGestureHandler>
  );
};

export default WheelOfFortune;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
