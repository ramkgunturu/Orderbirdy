import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  ImageBackground,
  I18nManager,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Images, Fonts, Colors } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import AutoHeightImage from "react-native-auto-height-image";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CountryContext } from "@context/country-context";
import { SettingsContext } from "@context/settings-context";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import { LanguageContext } from "@context/lang-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";


const { height, width } = Dimensions.get("screen");

const ProductRow = ({
  item,
  onPressModal,
  index,
  textdisplay,
  onAddToCart,
}) => {
  // console.log("item-------------", item);
  const [imageLoader, setImageLoader] = useState(true);
  const { country, setCountry } = useContext(CountryContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // const regex = /(<([^>]+)>)/gi;
  // const desc = I18nManager.isRTL
  //   ? item.description_ar
  //     ? item.description_ar.replace(regex, '')
  //     : ''
  //   : item.description
  //   ? item.description.replace(regex, '')
  //   : '';
  var itemFound = false;

  function onAddQuantityItem(item, resquantity, uniqueId) {
    var cartDetailsData = {
      id: item.id,
      item_code: item.item_code,
      addons_count: item.addons_count,
      title: item.title,
      title_ar: item.title_ar,
      order_quantity: item.order_quantity,
      price: item.price,
      quantity: parseInt(resquantity) + 1,
      available_quantity: item.quantity,
      total_price: item.price,
      image: item.image,
      category: item.category,
      uniqueId: uniqueId,
      weight: item?.weight,
      addons: [],
      addonPrice: 0,
    };
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
        contentType: 'product',
        contentId: cartDetailsData.id,
        currency: 'KWD',
        value: cartDetailsData.price,
      });
    }
    cartActions.addToCart(dispatch, cartDetailsData);
  }

  function onSubQuantityItem(item, resquantity, uniqueId) {
    if (parseInt(resquantity) === 1) {
      var cartDetailsData = {
        id: item.id,
        item_code: item.item_code,
        addons_count: item.addons_count,
        title: item.title,
        title_ar: item.title_ar,
        order_quantity: item.order_quantity,
        price: item.price,
        quantity: 1,
        available_quantity: item.quantity,
        total_price: item.price,
        image: item.image,
        category: item.category,
        uniqueId: uniqueId,
        weight: item?.weight,
        addons: [],
        addonPrice: 0,
      };
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: cartDetailsData.id,
          currency: 'KWD',
          value: cartDetailsData.price,
        });
      }
      cartActions.addToCart(dispatch, cartDetailsData);
    } else {
      var cartDetailsData = {
        id: item.id,
        item_code: item.item_code,
        addons_count: item.addons_count,
        title: item.title,
        title_ar: item.title_ar,
        order_quantity: item.order_quantity,
        price: item.price,
        quantity: parseInt(resquantity) - 1,
        available_quantity: item.quantity,
        total_price: item.price,
        image: item.image,
        category: item.category,
        uniqueId: uniqueId,
        weight: item?.weight,
        addons: [],
        addonPrice: 0,
      };
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: cartDetailsData.id,
          currency: 'KWD',
          value: cartDetailsData.price,
        });
      }
      cartActions.addToCart(dispatch, cartDetailsData);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        margin: responsiveWidth(1),
        // borderWidth: 1,
        // borderColor: "#f2f2f2",
      }}
    >
      <Animatable.View
        animation="bounceIn"
        easing="ease-in"
        duration={1500}
        iterationCount={1}
        style={{
          height: "auto",
        }}
      >
        <TouchableOpacity
          style={{
            width: responsiveWidth(47.5),
            justifyContent: "center",
            backgroundColor: "white",
            zIndex: 0,
          }}
          onPress={() => onPressModal(item)}
        >
          {imageLoader && Platform.OS === "ios" ? (
            <View
              style={{
                width: responsiveWidth(47.5),
                height: responsiveWidth(10),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <ActivityIndicator size="small" color={Colors.black} /> */}
            </View>
          ) : null}
          <AutoHeightImage
            width={responsiveWidth(47.5)}
            source={{ uri: item.image }}
            ImageCacheEnum={"only-if-cached"}
            onLoadStart={() => setImageLoader(true)}
            onLoad={() => setImageLoader(false)}
            PlaceholderContent={
              imageLoader && Platform.OS === "android" ? (
                <View
                  style={{
                    width: responsiveWidth(47.5),
                    height: responsiveWidth(30),
                    backgroundColor: Colors.white,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <ActivityIndicator color="black" /> */}
                </View>
              ) : null
            }
          />
          {textdisplay && !imageLoader ? (
            <View
              style={{
                width: responsiveWidth(47.5),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: responsiveWidth(47.5),
                  height: responsiveHeight(6),
                  // paddingTop: responsiveWidth(item.title.length > 15 ? 4 : 2),
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    // fontWeight: 'bold',
                    fontFamily: Fonts.textfont,
                    color: Colors.grey,
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {I18nManager.isRTL ? item.title_ar : item.title}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                {item.discount > 0 && item.discount !== item.price ? (
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.4),
                      color: Colors.black,
                      fontFamily: Fonts.textfont,
                      textAlign: "left",
                    }}
                  >
                    {parseFloat(item.price) > 0
                      ? (I18nManager.isRTL
                        ? country.currency.currency
                        : country.currency.currency_ar) +
                      " " +
                      (
                        parseFloat(country.currency.price) * item.discount
                      ).toFixed(3)
                      : language["Price On Selection"]}{" "}
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.4),
                        color: Colors.red,
                        fontFamily: Fonts.textfont,
                        textAlign: "left",
                        textDecorationLine: "line-through",
                      }}
                    >
                      {parseFloat(item.price) > 0
                        ? (I18nManager.isRTL
                          ? country.currency.currency
                          : country.currency.currency_ar) +
                        " " +
                        (
                          parseFloat(country.currency.price) * item.price
                        ).toFixed(3)
                        : language["Price On Selection"]}
                    </Text>
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.4),
                      color: Colors.black,
                      // paddingTop: responsiveWidth(2),
                      fontFamily: Fonts.textfont,
                      textAlign: "left",
                    }}
                  >
                    {parseFloat(item.price) > 0
                      ? (I18nManager.isRTL
                        ? country.currency.currency
                        : country.currency.currency_ar) +
                      " " +
                      (
                        parseFloat(country.currency.price) * item.price
                      ).toFixed(3)
                      : language["Price On Selection"]}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
        </TouchableOpacity>

        {textdisplay &&
          !imageLoader &&
          parseInt(item.addons_count) === 0 &&
          cart &&
          cart.cartItems.length > 0
          ? cart && cart.cartItems.length > 0
            ? cart.cartItems.map((res, key) => {
              if (res.id === item.id) {
                itemFound = true;
                return (
                  <View
                    style={{
                      width: responsiveWidth(47.5),
                      height: "auto",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: responsiveWidth(1.5),
                      backgroundColor:
                        res.quantity > 0
                          ? Colors.white
                          : settings.settings.color1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        onSubQuantityItem(item, res.quantity, res.uniqueId)
                      }
                    >
                      <Image
                        style={{
                          width: responsiveWidth(6),
                          height: responsiveWidth(6),

                          tintColor:
                            res.quantity === 1
                              ? Colors.grey
                              : settings.settings.color1,
                        }}
                        source={Images.minus}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        paddingHorizontal: responsiveWidth(10),
                        fontFamily: Fonts.textbold,
                        fontSize: responsiveFontSize(2),
                        color:
                          res.quantity > 0 ? Colors.lightblack : Colors.white,
                        fontStyle: "normal",
                        textAlign: "left",
                      }}
                    >
                      {res.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        let errormessage =
                          language["Maximum quantity available is"] +
                          "  " +
                          item.quantity;
                        if (
                          parseInt(item.quantity) <
                          parseInt(res.quantity) + 1 &&
                          parseInt(item.quantity_check) === 1 &&
                          parseInt(item.quantity) != 0
                        ) {
                          alert(errormessage);
                        } else {
                          onAddQuantityItem(item, res.quantity, res.uniqueId);
                        }
                      }}
                    >
                      <Image
                        style={{
                          width: responsiveWidth(6),
                          height: responsiveWidth(6),
                          tintColor: settings.settings.color1,
                        }}
                        source={Images.plus}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            })
            : null
          : null}

        {!itemFound && textdisplay && !imageLoader ? (
          <TouchableOpacity
            style={{
              width: responsiveWidth(47.5),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: settings.settings.color1,
              height: responsiveWidth(8),
              borderWidth: 1,
              borderColor: settings.settings.color1,
            }}
            onPress={() =>
              parseInt(item.quantity) === 0 &&
                parseInt(item.quantity_check) === 1
                ? ""
                : parseInt(settings.settings.cur_status) === 1
                  ? onAddToCart(item)
                  : ""
            }
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.6),
                color: Colors.white,
                //  paddingTop: responsiveHeight(0.5),
                fontFamily: Fonts.textmedium,
                textAlign: "left",
                // marginBottom: responsiveWidth(1),
                textTransform: "capitalize",
              }}
            >
              {/* {parseInt(item.quantity_check)} */}
              {parseInt(item.quantity) === 0 &&
                parseInt(item.quantity_check) === 1
                ? language["Out of Stock"]
                : parseInt(settings.settings.cur_status) === 1
                  ? language["add to basket"]
                  : language["Shop is busy"]}
            </Text>
          </TouchableOpacity>
        ) : null}
      </Animatable.View>
    </View>
  );
};

export default ProductRow;
