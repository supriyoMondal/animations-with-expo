import * as React from "react";
import {
  Vibration,
  StatusBar,
  Easing,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
const { width, height } = Dimensions.get("window");
const colors = {
  black: "#323F4E",
  red: "#F76A6A",
  text: "#ffffff",
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

export default function Timer() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [duration, setDuration] = React.useState(timers[0]);
  const timerAnimation = React.useRef(new Animated.Value(height)).current;
  const [viewHeight, setViewHeight] = React.useState(height);
  const bottomAnimation = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef();
  const textInputAnimation = React.useRef(new Animated.Value(timers[0]))
    .current;

  React.useEffect(() => {
    const listener = textInputAnimation.addListener(({ value }) => {
      inputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString(),
      });
    });

    return () => {
      textInputAnimation.removeListener(listener);
      textInputAnimation.removeAllListeners();
    };
  }, []);

  const animation = React.useCallback(() => {
    textInputAnimation.setValue(duration);
    Animated.sequence([
      Animated.timing(bottomAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(timerAnimation, {
          toValue: viewHeight,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textInputAnimation, {
          toValue: 0,
          duration: duration * 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(400),
    ]).start(() => {
      Vibration.cancel();
      Vibration.vibrate();
      textInputAnimation.setValue(duration);
      Animated.timing(bottomAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [duration, viewHeight]);

  const opacity = bottomAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const translateY = bottomAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const textOpacity = bottomAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        timerAnimation.setValue(height);
        setViewHeight(height);
      }}
    >
      <StatusBar hidden />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height: viewHeight,
            width,
            transform: [{ translateY: timerAnimation }],
            backgroundColor: colors.red,
          },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 100,
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity onPress={animation}>
          <View style={styles.roundButton} />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: "absolute",
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: ITEM_SIZE,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            opacity: textOpacity,
          }}
        >
          <TextInput
            ref={inputRef}
            style={[styles.text]}
            defaultValue={duration.toString()}
          />
        </Animated.View>
        <Animated.FlatList
          data={timers}
          keyExtractor={(item) => item.toString()}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: ITEM_SPACING,
          }}
          onMomentumScrollEnd={({
            nativeEvent: {
              contentOffset: { x },
            },
          }) => {
            const index = Math.round(x / ITEM_SIZE);
            setDuration(timers[index]);
          }}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          style={{ flexGrow: 1, opacity }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
            });
            return (
              <View
                style={{
                  width: ITEM_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    {
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                >
                  {item}
                </Animated.Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: ITEM_SIZE * 0.8,
    // fontFamily: "Menlo",
    color: colors.text,
    fontWeight: "900",
  },
});
