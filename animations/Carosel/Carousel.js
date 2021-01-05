import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

const logo =
  "https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/assets/ue_black_logo.png?raw=true";

const data = [
  {
    type: "Humlan P",
    imageUri: {
      uri:
        "https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/assets/urbanears_blue.png?raw=true",
    },
    heading: "Vibrant colors",
    description: "Four on-trend colorways to seamlessly suit your style.",
    key: "first",
    color: "#9dcdfa",
  },
  {
    type: "Pampas",
    imageUri: {
      uri:
        "https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/assets/urbanears_pink.png?raw=true",
    },
    heading: "Redefined sound",
    description: "A bold statement tuned to perfection.",
    key: "second",
    color: "#db9efa",
  },
  {
    type: "Humlan P",
    imageUri: {
      uri:
        "https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/assets/urbanears_grey.png?raw=true",
    },
    heading: "Great quality",
    description:
      "An Urbanears classic! Listen-all-day fit. Striking the perfect balance of effortless technology",
    key: "third",
    color: "#999",
  },
  {
    type: "Humlan B",
    imageUri: {
      uri:
        "https://github.com/catalinmiron/react-native-headphones-carousel/blob/master/assets/urbanears_mint.png?raw=true",
    },
    heading: "From Sweden",
    description:
      "The “Plattan” in Plattan headphones is Swedish for “the slab.”",
    key: "fourth",
    color: "#a1e3a1",
  },
];

const Item = ({ imageUri, heading, description, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.1, 1, 0.1],
    extrapolate: "clamp",
  });
  const imageOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  });
  const textOpacity = scrollX.interpolate({
    inputRange: [(index - 0.3) * width, index * width, (index + 0.3) * width],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });
  const translateXHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.2, 0, -width * 0.2],
    extrapolate: "clamp",
  });

  const translateXDescription = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.6, 0, -width * 0.6],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[
          styles.imageStyle,
          {
            transform: [{ scale }],
            opacity: imageOpacity,
          },
        ]}
      />
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.heading,
            {
              transform: [{ translateX: translateXHeading }],
              opacity: textOpacity,
            },
          ]}
        >
          {heading}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.description,
            {
              transform: [{ translateX: translateXDescription }],
              opacity: textOpacity,
            },
          ]}
        >
          {description}
        </Animated.Text>
      </View>
    </View>
  );
};

const Ticker = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
  });

  return (
    <View style={styles.tickerContainer}>
      <Animated.View
        style={{ height: TICKER_HEIGHT, transform: [{ translateY }] }}
      >
        {data.map(({ type }, index) => {
          return (
            <Text style={styles.tickerText} key={`${type}-${index}`}>
              {type}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Circle = ({ scrollX }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map(({ color }, index) => {
        const inputRange = [
          (index - 0.55) * width,
          index * width,
          (index + 0.56) * width,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, 0.4, 0],
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              { backgroundColor: color, transform: [{ scale }], opacity },
            ]}
          />
        );
      })}
    </View>
  );
};

const Pagination = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-DOT_SIZE, 0, DOT_SIZE],
  });
  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: "absolute",
            transform: [{ translateX }],
          },
        ]}
      />
      {data.map((item) => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

const Carousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Circle scrollX={scrollX} />
      <Animated.FlatList
        keyExtractor={(item) => item.key}
        data={data}
        renderItem={({ item, index }) => (
          <Item {...item} index={index} index={index} scrollX={scrollX} />
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
      <Image style={styles.logo} source={{ uri: logo }} />
      <Pagination scrollX={scrollX} />
      <Ticker scrollX={scrollX} />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: "contain",
    flex: 1,
  },
  textContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-end",
    flex: 0.5,
  },
  heading: {
    color: "#444",
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
  },
  description: {
    color: "#ccc",
    fontWeight: "600",
    textAlign: "left",
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: "contain",
    position: "absolute",
    left: 10,
    bottom: 10,
    transform: [
      { translateX: -LOGO_WIDTH / 2 },
      { translateY: -LOGO_HEIGHT / 2 },
      { rotateZ: "-90deg" },
      { translateX: LOGO_WIDTH / 2 },
      { translateY: LOGO_HEIGHT / 2 },
    ],
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  pagination: {
    position: "absolute",
    right: 20,
    bottom: 40,
    flexDirection: "row",
    height: DOT_SIZE,
  },
  tickerContainer: {
    position: "absolute",
    top: 16,
    left: 20,
    overflow: "hidden",
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    height: TICKER_HEIGHT,
    textTransform: "uppercase",
    fontWeight: "800",
  },

  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    top: "15%",
  },
});
