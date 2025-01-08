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
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    width: width,
    // marginBottom: responsiveWidth(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "normal",
    paddingLeft: 20,
    paddingTop: 20,
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  inputIOS: {
    fontSize: 14,
    paddingVertical: 4,
    // marginRight: responsiveWidth(5),
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    color: "black",
    // marginTop: 10,
    height: 45,
    paddingRight: 10, // to ensure the text is never behind the icon
    paddingLeft: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
    backgroundColor: "#ffffff",
  },
  inputAndroid: {
    fontSize: 14,
    // paddingHorizontal: 20,
    // marginRight: responsiveWidth(5),
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: "lightgrey",
    borderRadius: 5,
    color: "black",
    // marginTop: 10,
    height: 45,
    paddingRight: 10, // to ensure the text is never behind the icon
    paddingLeft: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },

  ball: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "normal",
    color: "white",
    fontSize: 32,
  },
  checkBoxImage: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(3),
    resizeMode: "contain",
  },
});
