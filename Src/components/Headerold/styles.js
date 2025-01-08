import React, { useState, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { SettingsContext } from "@context/settings-context";

const { height, width } = Dimensions.get("screen");

export default StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "row",
  },

  userImageView: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  userImageStyle: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    //borderRadius: 10,
    //backgroundColor: Colors.navyblue,
  },
  userAlterImageStyle: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    //borderRadius: 25,
    //backgroundColor: Colors.navyblue,
  },
  userTitleView: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  userTitleStyle: {
    //fontSize: width >= 700 && height >= 1000 ? 26 : width <= 320 ? 14 : 18,
    //fontSize: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    color: Colors.black,
    // fontWeight: '800',
    fontFamily: Fonts.textbold,
    textTransform: "capitalize",
    textAlign: "center",
    textTransform: "uppercase",
  },
  menuImageView: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  menuImageStyle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    tintColor: Colors.black,
    resizeMode: "contain",
  },
  ImageStyle: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    resizeMode: "contain",
  },
  CartImageView: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  CartImageStyle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    tintColor: Colors.black,
    resizeMode: "contain",
  },
  guestStyle: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  guestTextStyle: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.red,
    fontFamily: Fonts.textbold,
    textTransform: "capitalize",
    textTransform: "uppercase",
    textAlign: "center",
  },
  languageStyle: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidth(8) / 2,
  },
  languageImageStyle: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    tintColor: Colors.white,
    resizeMode: "contain",
  },
});
