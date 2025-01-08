import React from "react";
import { StyleSheet, Dimensions, I18nManager } from "react-native";
import { Colors, Fonts } from "@Themes";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const { height, width } = Dimensions.get("screen");

export default StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "gray",
    // borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,

    color: "black",
    paddingRight: 0, // to ensure the text is never behind the icon
  },
});
