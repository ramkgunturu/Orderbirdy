import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  ImageBackground,
  I18nManager,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { Images, Fonts, Colors } from "../../Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { SettingsContext } from "@context/settings-context";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("screen");

const ProductDisplay = ({ item, onPressModal, index, onPressWishList }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const regex = /(<([^>]+)>)/gi;
  // const desc = item.description ? item.description.replace(regex, "") : "";
  // console.log(item, "----ppppp");
  const [imageLoader, setImageLoader] = useState(true);
  const { settings, setSettings } = useContext(SettingsContext);
  const { country, setCountry } = useContext(CountryContext);

  // console.log(item.whishlist);
  return (
    <View
      style={{
        width: width / 2,
        height: "auto",
        marginBottom: 15,
        marginTop: index === 0 || index === 1 ? 10 : 0,
        marginLeft: responsiveWidth(2),
        borderWidth: 1,
        borderColor: "#f2f2f2",
      }}
    >
      <TouchableOpacity onPress={() => onPressModal(item)}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: responsiveWidth(50),
            height: responsiveWidth(50),
            resizeMode: "contain",
          }}
          onLoadStart={() => setImageLoader(true)}
          onLoad={() => setImageLoader(false)}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(45),
                height: responsiveWidth(45),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <ActivityIndicator color="black" /> */}
            </View>
          }
        />
      </TouchableOpacity>
      {!imageLoader ? (
        <View
          style={{
            backgroundColor: Colors.white,
            padding: responsiveWidth(1),
          }}
        >
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),

              fontFamily: Fonts.textfont,
              marginTop: responsiveWidth(1),
              marginLeft: responsiveWidth(2),
              textAlign: "center",
              color: Colors.grey,
            }}
            numberOfLines={2}
          >
            {I18nManager.isRTL ? item.title_ar : item.title}
            {/* {I18nManager.isRTL
            ? item.title.length > 15
              ? item.title_ar.substring(0, 15) + "..."
              : item.title_ar
            : item.title.length > 15
            ? item.title.substring(0, 15) + "..."
            : item.title} */}
          </Text>

          <Text
            style={{
              fontSize: responsiveFontSize(1.4),
              color: settings.settings.color1,
              // paddingTop: responsiveHeight(0.5),

              fontFamily: Fonts.textfont,
              marginLeft: responsiveWidth(1),
              textAlign: "center",
            }}
          >
            {parseFloat(item.price) > 0
              ? (I18nManager.isRTL
                  ? country.currency.currency
                  : country.currency.currency_ar) +
                " " +
                (parseFloat(country.currency.price) * item.price).toFixed(3)
              : language["Price On Selection"]}
            {/* {I18nManager.isRTL
            ? country.currency.currency
            : country.currency.currency_ar}{" "}
          {(parseFloat(country.currency.price) * item.price).toFixed(3)} */}
          </Text>
        </View>
      ) : null}

      {/* {item && item.whishlist ? (
        <TouchableOpacity onPress={() => onPressWishList()}>
          <View
            style={{
              backgroundColor: Colors.white,
              // padding: responsiveWidth(1),
              flexDirection: "row",
              height: responsiveWidth(8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 0.15,
                marginLeft: responsiveWidth(2),
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),

                  resizeMode: "contain",
                  tintColor: Colors.red,
                }}
                source={Images.heart}
              />
            </View>

            <View
              style={{
                flex: 0.85,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  color: "red",
                  // paddingTop: responsiveHeight(0.5),
              
                  fontFamily: Fonts.textfont,
                  marginLeft: responsiveWidth(1),
                  textAlign: "left",
                }}
              >
                KD {item.price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => onPressWishList()}>
          <View
            style={{
              backgroundColor: Colors.white,
              // padding: responsiveWidth(1),
              flexDirection: "row",
              height: responsiveWidth(8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 0.15,
                marginLeft: responsiveWidth(2),
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),

                  resizeMode: "contain",
                  tintColor: Colors.black,
                }}
                source={Images.emptyheart}
              />
            </View>

            <View
              style={{
                flex: 0.85,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  color: "red",
                  // paddingTop: responsiveHeight(0.5),
               
                  fontFamily: Fonts.textfont,
                  marginLeft: responsiveWidth(1),
                  textAlign: "left",
                }}
              >
                KD {item.price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default ProductDisplay;
