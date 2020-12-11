import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

const TextAnimator = ({ content, textStyle, containerStyle }) => {
  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{content}</Text>
    </View>
  );
};

TextAnimator.defaultProps = {
  textStyle: {},
  containerStyle: {},
};

TextAnimator.propTypes = {
  content: PropTypes.string.isRequired,
  textStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

export default TextAnimator;
