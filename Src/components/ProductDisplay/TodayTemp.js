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
} from "react-native";
import { Images, Fonts, Colors } from "../../Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import AutoHeightImage from "react-native-auto-height-image";
import { Image } from "react-native-elements";

const { height, width } = Dimensions.get("screen");

const ProductDisplay = ({ item, onPressModal, index, onPressWishList }) => {
  // const { language, setLanguage } = useContext(LanguageContext);
  const regex = /(<([^>]+)>)/gi;
  // const desc = item.description ? item.description.replace(regex, "") : "";
  // console.log(item, "----ppppp");
  const [imageLoader, setImageLoader] = useState(true);
  // console.log(item.whishlist);
  return (
    <View
      onPress={() => onPressModal(item)}
      style={{
        width: width / 2,
        height: "auto",
        marginBottom: 15,
        marginTop: index === 0 || index === 1 ? 10 : 0,
        marginLeft: (index + 1) % 2 === 0 ? responsiveWidth(1) : 0,
      }}
    >
      <TouchableOpacity onPress={() => onPressModal(item)}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: responsiveWidth(50),
            height: responsiveWidth(70),
            resizeMode: "cover",
          }}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(50),
                height: responsiveWidth(70),
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
      <View
        style={{
          backgroundColor: Colors.e4e4e4,
          padding: responsiveWidth(1),
        }}
      >
        <Text
          style={{
            fontSize: responsiveFontSize(1.6),
            fontFamily: Fonts.textfont,
            marginTop: responsiveWidth(1),
            marginLeft: responsiveWidth(2),
            textAlign: "left",
            color: Colors.grey,
          }}
        >
          {I18nManager.isRTL ? item.title_ar : item.title}
        </Text>
      </View>

      {item && item.whishlist ? (
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
                {/* {language["KD"]} {item.price} */}
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
                {/* {language["KD"]} {item.price} */}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductDisplay;
