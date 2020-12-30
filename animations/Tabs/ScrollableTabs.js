import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  findNodeHandle,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const images = {
  man:
    "https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  women:
    "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  kids:
    "https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  skullcandy:
    "https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  help:
    "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}));

const Tab = React.forwardRef(({ item, onItemPress }, ref) => (
  <TouchableOpacity onPress={onItemPress}>
    <View ref={ref}>
      <Text
        style={{
          color: "#fff",
          fontSize: 84 / data.length,
          fontWeight: "700",
          textTransform: "uppercase",
        }}
      >
        {item.title}
      </Text>
    </View>
  </TouchableOpacity>
));

const Indicator = ({ scrollX, measures }) => {
  const inputRange = data.map((_, i) => i * 360);

  const width = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((item) => item.width),
  });

  const left = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((item) => item.x),
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        height: 4,
        width,
        left: 0,
        bottom: -10,
        backgroundColor: "#fff",
        transform: [{ translateX: left }],
      }}
    />
  );
};

const Tabs = ({ data, scrollX, onItemPress }) => {
  const containerRef = React.useRef();
  const [measures, setMeasures] = useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      const m = [];
      data.forEach((item) => {
        item.ref.current.measureLayout(
          containerRef.current,
          (x, y, width, height) => {
            m.push({ x, y, width, height });

            if (m.length === data.length) {
              setMeasures(m);
            }
          }
        );
      });
    }, 500);
  }, []);

  return (
    <View style={{ position: "absolute", top: 50, width }}>
      <View
        ref={containerRef}
        style={{ flexDirection: "row", justifyContent: "space-evenly" }}
      >
        {data.map((item, index) => (
          <Tab
            key={item.key}
            item={item}
            ref={item.ref}
            onItemPress={() => onItemPress(index)}
          />
        ))}
      </View>
      {measures.length > 0 && (
        <Indicator scrollX={scrollX} measures={measures} />
      )}
    </View>
  );
};

export default function ScrollableTabs() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();

  const onItemPress = React.useCallback(
    (itemIndex) => {
      ref?.current?.scrollToOffset({
        offset: itemIndex * width,
      });
    },
    [ref]
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        ref={ref}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: "cover" }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: "rgba(0,0,0,.3)",
                  },
                ]}
              />
            </View>
          );
        }}
      />
      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
