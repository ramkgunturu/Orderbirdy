import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import { Images, Fonts, Colors } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Services from "@Services";
import constants from "@constants";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function OrderDetails(props) {
  const [spinner, setSpinner] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [subTotal, setSubTotal] = useState(0);
  const { language, setLanguage } = useContext(LanguageContext);
  const { country, setCountry } = useContext(CountryContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("OrderDetails Screen");
    }
    setSpinner(true);
    fetchData();
  }, []);
  const fetchData = () => {
    // console.log(orderDetails);
    // console.log(constants.API_BASE_URL + "order?id=" + props.details.id);
    Services(constants.API_BASE_URL + "order?id=" + props.details.id).then(
      (response) => {
        if (response) {
          // // console.log(response.products, "---orderDetails");
          // response.products.map((res, key) => {
          //   setSubTotal(subTotal + res.product_price);
          // });
          setOrderDetails(response);
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      }
    );
  };
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(3),
          marginTop: responsiveWidth(2),
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),
              fontFamily: Fonts.textbold,
              textTransform: "uppercase",
            }}
          >
            ({item.quantity}) X{" "}
            {I18nManager.isRTL ? item.product_name_ar : item.product_name}
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),
              fontFamily: Fonts.textbold,
            }}
          >
            {/* {orderDetails.invoice.currency} {parseFloat(item.total).toFixed(3)} */}
            {orderDetails.invoice.currency}{" "}
            {(
              parseFloat(orderDetails.invoice.currency_price) *
              parseFloat(item.total)
            ).toFixed(3)}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {spinner ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "transparent",
          }}
        >
          <ActivityIndicator />
        </View>
      ) : orderDetails && orderDetails.products.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: Colors.greyalter,
              height: responsiveHeight(6),
              paddingHorizontal: responsiveWidth(3),
              justifyContent: "space-between",
              flexDirection: "row",
              paddingTop: responsiveHeight(2),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(2),
                // paddingLeft: responsiveWidth(2),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {language["Order Summary"]}
            </Text>

            <TouchableOpacity onPress={() => props.closePanel()}>
              <Image
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: Colors.black,
                }}
                source={Images.downarrow}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.lightgrey,
            }}
          >
            <FlatList
              data={orderDetails.products}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ paddingBottom: responsiveWidth(3) }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: responsiveHeight(1),
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
                color: Colors.black,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {language["subtotal"]} :{" "}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.6),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {orderDetails.invoice.currency}{" "}
              {(
                parseFloat(orderDetails.invoice.currency_price) *
                parseFloat(orderDetails.invoice.price)
              ).toFixed(3)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: responsiveHeight(1),
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
                color: Colors.black,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {language["delivery charges"]} :{" "}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.6),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {orderDetails.invoice.currency}{" "}
              {(
                parseFloat(orderDetails.invoice.currency_price) *
                parseFloat(orderDetails.invoice.delivery_charges)
              ).toFixed(3)}
              {/* {(
                parseFloat(country.currency.price) *
                parseFloat(orderDetails.invoice.delivery_charges)
              ).toFixed(3)} */}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: responsiveHeight(1),
              paddingBottom: responsiveHeight(1),
              borderBottomWidth: 2,
              borderBottomColor: Colors.lightgrey,
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {language["Discounts"]} :{" "}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.6),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {/* {I18nManager.isRTL
                ? country.currency.currency
                : country.currency.currency_ar}{" "}
              {(
                parseFloat(country.currency.price) *
                parseFloat(orderDetails.invoice.discount)
              ).toFixed(3)} */}
              {orderDetails.invoice.currency}{" "}
              {(
                parseFloat(orderDetails.invoice.currency_price) *
                parseFloat(orderDetails.invoice.discount)
              ).toFixed(3)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: responsiveHeight(1),
              paddingBottom: responsiveHeight(1),
              borderBottomWidth: 2,
              borderBottomColor: Colors.lightgrey,
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(2),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {language["Order Total"]} :{" "}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(1.6),
                color: Colors.black,
                textAlign: "center",
              }}
            >
              {/* {I18nManager.isRTL
                ? country.currency.currency
                : country.currency.currency_ar}{" "}
              {(
                parseFloat(country.currency.price) *
                parseFloat(orderDetails.invoice.total_price)
              ).toFixed(3)} */}
              {orderDetails.invoice.currency}{" "}
              {(
                parseFloat(orderDetails.invoice.currency_price) *
                parseFloat(orderDetails.invoice.total_price)
              ).toFixed(3)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
