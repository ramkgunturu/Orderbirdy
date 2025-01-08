import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  I18nManager,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Fonts, Images, Colors } from "@Themes";
import { SettingsContext } from "@context/settings-context";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { CountryContext } from "@context/country-context";
import { LanguageContext } from "@context/lang-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

var formattedArray = [];
var subArray = [];

export default function Countries(props) {
  const [arr, setArr] = useState([]);
  const [sublist, setSublist] = useState([]);
  const [textinput, setTextInput] = useState("");
  const { settings, setSettings } = useContext(SettingsContext);
  const { country, setCountry } = useContext(CountryContext);
  const [countries, setCountries] = useState(settings.countries);
  const { language, setLanguage } = useContext(LanguageContext);

  function onItemSelected(item) {
    AsyncStorage.setItem("CountryDetails", JSON.stringify(item));
    setCountry(item);
    props.onClose();
  }
  useEffect(() => {
    setCountries(settings.countries);
  }, [countries]);

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 15,
          height: 35,
          borderBottomWidth: 1,
          borderColor: Colors.lightgrey,
        }}
        onPress={() => onItemSelected(item)}
      >
        <View
          style={{
            flex: 0.9,
            flexDirection: "row",
            marginHorizontal: responsiveWidth(5),
          }}
        >
          <Image
            source={{ uri: item.currency.image }}
            style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
          />

          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.textfont,
              paddingHorizontal: responsiveWidth(4),
            }}
          >
            {I18nManager.isRTL ? item.title_ar : item.title}
          </Text>
        </View>
        <View
          style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}
        >
          {country && country.id === item.id ? (
            <Image
              source={Images.checkCountry}
              style={{
                width: responsiveWidth(6),
                height: responsiveWidth(6),
              }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          // backgroundColor: "#0e0e0e4f",
          // backgroundColor: "transparent",
          // paddingHorizontal: 30,

          // paddingBottom: 30,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <View
          style={{
            flex: 0.1,
            backgroundColor: "transparent",
            // borderTopLeftRadius: 40,
            // borderTopRightRadius: 40,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // paddingHorizontal: 8,
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightgrey,
            }}
            onPress={() => props.onClose()}
          >
            {I18nManager.isRTL ? (
              <Image
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: "black",
                  resizeMode: "contain",
                }}
                source={Images.backarrow}
              />
            ) : (
              <Image
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: "black",
                  resizeMode: "contain",
                }}
                source={Images.frontarrow}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              flex: 0.85,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightgrey,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                // fontWeight: "700",
                color: "black",
                textAlign: "left",
                fontFamily: Fonts.textbold,
              }}
            >
              {language["Select Country"]}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 0.9,
            backgroundColor: "white",
            // borderBottomLeftRadius: 40,
            // borderBottomRightRadius: 40,
          }}
        >
          {countries && countries.length > 0 ? (
            <FlatList
              data={countries}
              keyExtractor={(item, index) => item + index}
              renderItem={_renderItem}
              keyboardShouldPersistTaps="always"
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
