import React from "react";
import { StyleSheet, Dimensions } from "react-native";
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
    width: "100%",
    height: responsiveHeight(60),
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
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
    fontSize: 16,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 5,
    color: Colors.black,
    marginTop: 10,
    height: 40,
    paddingRight: 30, // to ensure the text is never behind the icon
    // fontWeight: 'bold',
    fontFamily: Fonts.textfont,
    paddingLeft: 5,
  },
  inputAndroid: {
    fontSize: 16,
    marginHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "lightgrey",
    borderRadius: 5,
    color: Colors.black,
    marginTop: 10,
    height: 40,
    paddingRight: 30, // to ensure the text is never behind the icon
    // fontWeight: 'bold',
    fontFamily: Fonts.textfont,
    paddingLeft: 5,
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
    fontWeight: "bold",
    color: "white",
    fontSize: 32,
  },
});
