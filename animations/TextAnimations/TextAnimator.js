import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PropTypes from "prop-types";

const TextAnimator = ({ content, textStyle, containerStyle, duration }) => {
  const animatedValues = [];
  const textArray = content.trim().split(" ");

  const initiateArray = () => {
    textArray.forEach((_, i) => {
      animatedValues[i] = new Animated.Value(0);
    });
  };

  initiateArray();

  const animate = (toValue = 1) => {
    const animations = textArray.map((_, i) => {
      return Animated.timing(animatedValues[i], {
        toValue,
        duration: duration,
        useNativeDriver: true,
      });
    });

    Animated.stagger(duration / 5, animations).start();
  };

  useEffect(() => {
    animate();
  }, []);

  return (
    <View style={[containerStyle, styles.textWrapper]}>
      {textArray.map((word, index) => (
        <Animated.Text
          key={index}
          style={[
            textStyle,
            {
              opacity: animatedValues[index],
              transform: [
                {
                  translateY: Animated.multiply(
                    animatedValues[index],
                    new Animated.Value(-5)
                  ),
                },
              ],
            },
          ]}
        >
          {word}
          {index < textArray.length && " "}
        </Animated.Text>
      ))}
    </View>
  );
};

TextAnimator.defaultProps = {
  textStyle: {},
  containerStyle: {},
  duration: 500,
};

TextAnimator.propTypes = {
  content: PropTypes.string.isRequired,
  textStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  duration: PropTypes.number,
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default TextAnimator;
