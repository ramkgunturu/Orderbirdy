import React, { useContext, useState, createRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  I18nManager,
  ScrollView,
  Linking,
} from "react-native";
import { Header } from "@components";
import { Images, Fonts, Colors } from "../../Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Formik } from "formik";
import * as Yup from "yup";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import Services from "@Services";
import constants from "@constants";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";

const url = constants.API_BASE_URL;

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailidRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

const { height, width } = Dimensions.get("screen");

export default function ContactUs() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);

  function makeCall(fmphone) {
    // console.log(settings.settings.call);
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:" + fmphone;
    } else {
      phoneNumber = "telprompt:${" + fmphone + "}";
    }
    if (fmphone) {
      Linking.openURL(phoneNumber);
    }
  }
  function openWhatsApp(fmphone) {
    if (fmphone) {
      let url = "whatsapp://send?text=" + "&phone=+965" + fmphone;
      Linking.openURL(url)
        .then(() => {
          // console.log('WhatsApp Opened successfully ' + data);
        })
        .catch(() => {
          // alert("Make sure WhatsApp installed on your device");
        });
    } else {
      // alert("Please enter mobile no");
    }
  }
  function openUrl(url) {
    if (url) {
      Linking.openURL(url)
        .then(() => {})
        .catch(() => {});
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          top: responsiveWidth(10),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: responsiveWidth(30), height: responsiveWidth(30) }}
          source={{ uri: settings.settings.app_logo }}
        />
      </View>

      <TouchableOpacity
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: Colors.grey,
          justifyContent: "center",
          alignItems: "center",
          marginTop: responsiveWidth(8),
          flexDirection: "row",
          marginHorizontal: responsiveWidth(1),
          paddingHorizontal: responsiveWidth(2),
          borderRadius: 5,
          marginBottom: responsiveWidth(2),
          backgroundColor: Colors.grey,
        }}
        onPress={() => makeCall(settings.settings.phone)}
      >
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.white,
            textTransform: "capitalize",
          }}
        >
          {language["call"]}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: "#25D366",
          justifyContent: "center",
          alignItems: "center",
          marginTop: responsiveWidth(8),
          flexDirection: "row",
          marginHorizontal: responsiveWidth(1),
          paddingHorizontal: responsiveWidth(2),
          borderRadius: 5,
          marginBottom: responsiveWidth(2),
          backgroundColor: "#25D366",
        }}
        onPress={() => openWhatsApp(settings.settings.whatsapp)}
      >
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.white,
            textTransform: "capitalize",
          }}
        >
          {language["messagewhatsapp"]}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: "#C13584",
          justifyContent: "center",
          alignItems: "center",
          marginTop: responsiveWidth(8),
          flexDirection: "row",
          marginHorizontal: responsiveWidth(1),
          paddingHorizontal: responsiveWidth(2),
          borderRadius: 5,
          marginBottom: responsiveWidth(2),
          backgroundColor: "#C13584",
        }}
        onPress={() => openUrl(settings.settings.instagram)}
      >
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.white,
            textTransform: "capitalize",
          }}
        >
          {language["followusinstagram"]}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: "#00acee",
          justifyContent: "center",
          alignItems: "center",
          marginTop: responsiveWidth(8),
          flexDirection: "row",
          marginHorizontal: responsiveWidth(1),
          paddingHorizontal: responsiveWidth(2),
          borderRadius: 5,
          marginBottom: responsiveWidth(2),
          backgroundColor: "#00acee",
        }}
        onPress={() => openUrl(settings.settings.twitter)}
      >
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.white,
            textTransform: "capitalize",
          }}
        >
          {language["followustwitter"]}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
