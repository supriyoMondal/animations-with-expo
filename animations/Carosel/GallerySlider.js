import * as React from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const API_KEY = "563492ad6f9170000100000193d6d54e78034736823f9d76e30008ec";
const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";
const IMAGE_SIZE = 80;
const SPACING = 12;

const fetchImagesFromPixels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });
  const { photos } = await data.json();

  return photos;
};

const GallerySlider = () => {
  const [images, setImages] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const topRef = React.useRef();
  const thumbRef = React.useRef();

  React.useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImagesFromPixels();
      setImages(images);
    };
    fetchImages();
  }, []);

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={images}
        ref={topRef}
        onMomentumScrollEnd={({
          nativeEvent: {
            contentOffset: { x },
          },
        }) => {
          scrollToActiveIndex(Math.floor(x / width));
        }}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        ListEmptyComponent={() => (
          <View
            style={{
              width,
              height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="cyan" size="large" />
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />

      <FlatList
        data={images}
        ref={thumbRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={{ position: "absolute", bottom: 10 }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => scrollToActiveIndex(index)}
            >
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default GallerySlider;
