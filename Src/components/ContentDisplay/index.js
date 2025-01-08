import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Keyboard,
  Modal,
  I18nManager,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Colors } from "@Themes";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";

export default function ContentDisplay(props) {
  const { language, setLanguage } = useContext(LanguageContext);
  const regex = /(<([^>]+)>)/gi;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView>
        <View style={{ flex: 1, margin: responsiveWidth(1) }}>
          <Text
            style={{
              fontSize: responsiveFontSize(1.8),
              fontFamily: Fonts.textfont,
              textAlign: "left",
              lineHeight: 30,
            }}
          >
            {I18nManager.isRTL
              ? props.data.description_ar.replace(regex, "")
              : props.data.description.replace(regex, "")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
