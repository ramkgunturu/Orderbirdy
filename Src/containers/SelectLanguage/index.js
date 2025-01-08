import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  I18nManager,
  Image,
  ActivityIndicator,
  DevSettings,
} from "react-native";
import FastImage from "react-native-fast-image";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Colors, Images } from "@Themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "@context/settings-context";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import RNRestart from "react-native-restart";

const Data = [
  {
    id: "1",
    title: "English",
    image: Images.en,
  },
  {
    id: "2",
    title: "عربى",
    image: Images.ar,
  },
];

export default function SelectLanguage() {
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);
  const { language, setLanguage } = useContext(LanguageContext);

  function onItemSelected(item) {
    if (item.id === "1") {
      AsyncStorage.setItem("language", "english");
      setLanguage(settings.words.en);
      I18nManager.forceRTL(false);
    } else {
      I18nManager.forceRTL(true);
      AsyncStorage.setItem("language", "arabic");
      setLanguage(settings.words.ar);
      RNRestart.Restart();
      // DevSettings.reload();
    }
  }

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          backgroundColor: Colors.white,
          // backgroundColor: "red",
          borderColor: Colors.e4e4e4,
          borderWidth: 1,
          // justifyContent: "center",
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 5,
          margin: 8,
          shadowOpacity: 0.5,
          shadowOffset: { width: 1, height: 1 },
          shadowColor: "grey",
          elevation: 5,
          flexDirection: "row",
        }}
        onPress={() => onItemSelected(item)}
      >
        <View
          style={{
            flex: 0.9,
            justifyContent: "center",
            // marginHorizontal: responsiveWidth(5),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.textfont,
              marginLeft: 10,
              color: Colors.lightblack,
              textAlign: "left",
              // paddingHorizontal: responsiveWidth(4),
            }}
          >
            {item.title}
          </Text>
        </View>
        <View
          style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={item.image}
            style={{
              width: responsiveWidth(4),
              height: responsiveWidth(4),
              tintColor: "black",
              resizeMode: "contain",
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        // alignItems: "center",
        paddingTop: responsiveHeight(
          settings && settings.countries.length > 7 ? 4 : 14
        ),
      }}
    >
      <View style={{ alignItems: "center" }}>
        <FastImage
          style={{ width: responsiveWidth(30), height: responsiveWidth(20) }}
          source={{
            uri: settings.settings.image,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text
          style={{
            fontSize: responsiveFontSize(1.8),
            color: Colors.grey,
            paddingTop: responsiveHeight(2),
            fontFamily: Fonts.textbold,
          }}
        >
          Please Select Language
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.8),
            color: Colors.grey,
            paddingTop: responsiveHeight(1),
            fontFamily: Fonts.textbold,
          }}
        >
          Please select your preferred language
        </Text>
      </View>
      {Data.length > 0 ? (
        <FlatList
          data={Data}
          keyExtractor={(item, index) => item + index}
          renderItem={_renderItem}
          keyboardShouldPersistTaps="always"
          style={{ marginHorizontal: 15, marginTop: 15 }}
        />
      ) : null}
      {spinner ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <ActivityIndicator size="small" color={Colors.black} />
        </View>
      ) : null}
    </View>
  );
}
