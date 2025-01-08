import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "@Themes";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const { height, screenWidth } = Dimensions.get("screen");

export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fffdf2",
  },
  item: {
    marginTop: responsiveWidth(5),
    marginBottom: responsiveWidth(5),
    width: responsiveWidth(43),
    height: responsiveHeight(100),
    backgroundColor: "white",
    borderRadius: responsiveWidth(3),
  },
  title: {
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
  },
  itemimage: {
    width: responsiveWidth(100) - 60,
    height: responsiveWidth(100),
    marginTop: responsiveHeight(0.1),
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
});
