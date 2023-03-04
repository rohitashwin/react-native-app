import React, { Component } from "react";
import {
  processColor,
  AppRegistry,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Easing,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;

//HEX version of colors
var gradientColors = [
  "#F15A24",
  "#FBB03B",
  "#D9E021",
  "#8CC63F",
  "#009245",
  "#006837",
  "#22B573",
];

export default function MovingWallpaper(props) {
  const [color1] = React.useState(new Animated.Value(0));
  const [color2] = React.useState(new Animated.Value(1));
  const color1Index = React.useRef(0);
  const color2Index = React.useRef(1);

  React.useEffect(() => {
    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAnimation() {
    Animated.sequence([
      Animated.timing(color1, {
        toValue: -screenWidth,
        duration: props.duration || 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(color2, {
        toValue: -screenWidth,
        duration: props.duration || 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      color1.setValue(0);
      color2.setValue(1);
      color1Index.current++;
      if (color1Index.current == gradientColors.length) {
        color1Index.current = 0;
      }
      color2Index.current++;
      if (color2Index.current == gradientColors.length) {
        color2Index.current = 0;
      }
      startAnimation();
    });
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.gradientContainer,
          { left: screenWidth * -1 + screenWidth / gradientColors.length },
          { transform: [{ translateX: color1 }] },
        ]}
      >
        <LinearGradient
          colors={[
            gradientColors[color1Index.current],
            gradientColors[color2Index.current],
          ]}
          start={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          end={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          locations={[
            0.3 / gradientColors.length + (props.xOffset || {}).value,
          ]}
          style={styles.gradient}
        />
        <LinearGradient
          colors={[
            gradientColors[color2Index.current],
            gradientColors[(color2Index.current + 1) % gradientColors.length],
          ]}
          start={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          end={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          locations={[
            0.3 / gradientColors.length + (props.xOffset || {}).value,
          ]}
          style={styles.gradient}
        />
        <LinearGradient
          colors={[
            gradientColors[(color2Index.current + 1) % gradientColors.length],
            gradientColors[(color2Index.current + 2) % gradientColors.length],
          ]}
          start={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          end={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          locations={[
            0.3 / gradientColors.length + (props.xOffset || {}).value,
          ]}
          style={styles.gradient}
        />
        <LinearGradient
          colors={[
            gradientColors[(color2Index.current + 2) % gradientColors.length],
            gradientColors[(color2Index.current + 3) % gradientColors.length],
          ]}
          start={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          end={{
            x: -3.5 / gradientColors.length + (props.xOffset || {}).value,
          }}
          locations={[
            0.3 / gradientColors.length + (props.xOffset || {}).value,
          ]}
          style={styles.gradient}
        />
      </Animated.View>
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
  gradientContainer: {
    width: screenWidth * 2,
    height: screenHeight,
    flexDirection: "row",
  },
  gradient: {
    width: screenWidth / gradientColors.length,
    height: screenHeight,
  },
});
