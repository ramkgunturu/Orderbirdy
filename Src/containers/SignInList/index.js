import React, { useState, useEffect, useContext } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Modal,
  I18nManager,
  Platform,
} from "react-native";
import Services from "@Services";
import constants from "@constants";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Fonts, Colors } from "@Themes";
import { Header } from "@components";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";

export default function SignInList() {
  const navigation = useNavigation();
  const { settings, setSettings } = useContext(SettingsContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const data = [
    // {
    //   id: "1",
    //   title: language["Gmail"],
    //   image: Images.google,
    // },
    // {
    //   id: "2",
    //   title: "Facebook",
    //   image: Images.fb,
    // },
    // {
    //   id: "3",
    //   title: "Apple",
    //   image: Images.apple,
    // },
    {
      id: "4",
      title: language["Email"],
      image: Images.email,
    },
    {
      id: "5",
      title: language["Guest"],
      image: Images.myaccount,
    },
  ];

  const goToLogin = (pushItem) => {
    if (pushItem.id === "4") {
      navigation.push("SignIn", { routeFrom: "SignInList" });
    } else if (pushItem.id === "5") {
      navigation.push("GuestCheckOut");
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: settings.settings.color1,
          paddingVertical: responsiveWidth(3),
          borderRadius: 10,
          marginTop: responsiveWidth(5),
          marginHorizontal: responsiveWidth(5),
          backgroundColor: settings.settings.color1,
        }}
        onPress={() => goToLogin(item)}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: responsiveWidth(6),
            }}
          >
            {item.image != "" ? (
              <Image
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={item.image}
              />
            ) : null}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginHorizontal: responsiveWidth(8),
            }}
          >
            <Text
              style={{
                textAlign: "left",
                color: Colors.white,
                fontFamily: Fonts.textmedium,
                fontSize: responsiveFontSize(1.6),
              }}
            >
              {language["Continue with"]} {item.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: responsiveHeight(Platform.OS === "android" ? 8 : 6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"SignInList"} title={language["Sign In"]} />
      </View>
      <Text
        style={{
          textAlign: "center",
          color: Colors.lightblack,
          fontFamily: Fonts.textmedium,
          fontSize: responsiveFontSize(1.8),
          marginTop: responsiveHeight(5),
          marginHorizontal: responsiveWidth(15),
          lineHeight: 25,
        }}
      >
        {language["Login or Create an Account"]}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: Colors.black,
          fontFamily: Fonts.textlight,
          fontSize: responsiveFontSize(1.8),
          marginTop: responsiveHeight(2),
          marginHorizontal: responsiveWidth(15),
          lineHeight: 20,
        }}
      >
        {
          language[
            "Receive rewards and save your details for a faster checkout experience"
          ]
        }
      </Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
