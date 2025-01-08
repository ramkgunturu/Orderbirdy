import React, { useState, useEffect, useContext } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Modal,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  I18nManager,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TextInputComponent,
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
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function OrderTracking() {
  const { settings, setSettings } = useContext(SettingsContext);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderDisplay, setOrderDisplay] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dummy, setDummy] = useState(0);
  const [textinput, setTextInput] = useState("");
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);

  const fetchData = () => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Order Tracking");
    }
    setSpinner(true);
    if (textinput.length > 0) {
      Services(constants.API_BASE_URL + "track/" + textinput, "POST")
        .then((response) => {
          if (response) {
            setData(response);
            setSpinner(false);
          } else {
            setSpinner(false);
          }
        })
        .catch((error) => {
          // console.error(error);
        });
    } else {
      alert("Please enter your order id or phone number");
      setSpinner(false);
      setOrderDisplay(false);
    }
  };

  const renderItem = ({ item, index }) => {
    let titles = "";

    {
      item.name.map((res, key) => {
        titles =
          titles +
          "\n" +
          (I18nManager.isRTL ? res.product_name_ar : res.product_name);
      });
    }

    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#f2f2f2",
          marginTop: responsiveHeight(1.5),
          marginHorizontal: responsiveWidth(2),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textmedium,
                padding: 5,
              }}
            >
              Order Id
            </Text>
          </View>
          <View
            style={{
              flex: 0.4,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textmedium,
                padding: 5,
              }}
            >
              Items
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textmedium,
                padding: 5,
              }}
            >
              Price
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textmedium,
                padding: 5,
              }}
            >
              Status
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.6),
                color: Colors.lightblack,
                fontFamily: Fonts.textlight,
                padding: 5,
              }}
            >
              {item.id}
            </Text>
          </View>
          <View
            style={{
              flex: 0.4,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.6),
                color: Colors.lightblack,
                fontFamily: Fonts.textlight,
                padding: 5,
              }}
            >
              {titles}
            </Text>
          </View>

          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textlight,
              }}
            >
              {item.total_price}
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              borderWidth: 1,
              borderColor: "#f2f2f2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: responsiveFontSize(1.8),
                color: Colors.lightblack,
                fontFamily: Fonts.textlight,
              }}
            >
              {item.delivery === "0"
                ? language["Pending"]
                : item.delivery === "1"
                  ? language["In Progress"]
                  : item.delivery === "2"
                    ? language["Order Accepted"]
                    : item.delivery === "3"
                      ? language["Delivered"]
                      : language["Cancelled"]}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fcfafb" }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Search"} title={language["Track Order"]} />
      </View>

      <View
        style={{
          height: responsiveWidth(10),
          marginHorizontal: responsiveWidth(2),
          backgroundColor: "#EBEEEE",
          borderRadius: 10,
          flexDirection: "row",
          marginTop: responsiveHeight(2),
          marginBottom: responsiveHeight(1),
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: textinput ? 0.9 : 1,
            justifyContent: "center",
            marginHorizontal: responsiveWidth(2),
          }}
        >
          <TextInput
            placeholder={language["Enter order id or phone number"]}
            placeholderTextColor={Colors.grey}
            keyboardType={"default"}
            secureTextEntry={false}
            onChangeText={(text) => {
              setData([]);

              setTextInput(text);
              if (text === "") {
                setOrderDisplay(false);
              }
            }}
            blurOnSubmit={true}
            value={textinput}
            style={{
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(1.8),
              textTransform: "capitalize",
              textAlign: I18nManager.isRTL ? "right" : "left",
              paddingVertical: responsiveWidth(1),
            }}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              setSpinner(true);
              setOrderDisplay(false);
              fetchData();
            }}
          />
        </View>
        {textinput ? (
          <TouchableOpacity
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Keyboard.dismiss();
              setSpinner(true);
              setOrderDisplay(true);
              fetchData();
            }}
          >
            <Image
              style={{
                width: responsiveWidth(4),
                height: responsiveHeight(3),
                tintColor: Colors.black,
                resizeMode: "contain",
              }}
              source={Images.search}
            />
          </TouchableOpacity>
        ) : null}
      </View>
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
      ) : (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          {data && data.length > 0 ? (
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ marginBottom: 10 }}
              showsVerticalScrollIndicator={false}
            />
          ) : orderDisplay ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  color: Colors.black,
                  paddingTop: responsiveHeight(2),

                  fontFamily: Fonts.textbold,
                }}
              >
                {language["No Data"]}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
