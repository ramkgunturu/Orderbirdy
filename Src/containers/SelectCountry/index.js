import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  I18nManager,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Images, Colors } from "@Themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "@context/settings-context";
import { CountryContext } from "@context/country-context";
import { useNavigation } from "@react-navigation/native";

export default function SelectCountry() {
  const navigation = useNavigation();
  const { settings, setSettings } = useContext(SettingsContext);
  const { country, setCountry } = useContext(CountryContext);
  I18nManager.forceRTL(false);
  function onItemSelected(item) {
    AsyncStorage.setItem("CountryDetails", JSON.stringify(item));
    setCountry(item);
    navigation.push("SelectLanguage");
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
              // paddingHorizontal: responsiveWidth(4),
            }}
          >
            {I18nManager.isRTL ? item.title_ar : item.title}
          </Text>
        </View>
        <View
          style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}
        >
          <FastImage
            style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
            source={{
              uri: item.currency.image,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
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
          Please Select Country
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.8),
            color: Colors.grey,
            paddingTop: responsiveHeight(1),
            fontFamily: Fonts.textbold,
          }}
        >
          Please Select your shipping destination
        </Text>
      </View>
      {settings.countries && settings.countries.length > 0 ? (
        <FlatList
          data={settings.countries}
          keyExtractor={(item, index) => item + index}
          renderItem={_renderItem}
          keyboardShouldPersistTaps="always"
          style={{ marginHorizontal: 10, marginTop: 15 }}
        />
      ) : null}
    </View>
  );
}
