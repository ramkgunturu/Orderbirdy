import React, {
  useContext,
  useState,
  createRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  I18nManager,
} from "react-native";
import { Images, Fonts, Colors } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Header, OrderDetails } from "@components";
// import { Content } from "native-base";
import Skeleton from "./Skeleton";
import Services from "@Services";
import constants from "@constants";
import { UserContext } from "@context/user-context";

import { SwipeablePanel } from "rn-swipeable-panel";
import moment from "moment";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function MyOrders(props) {
  const [spinner, setSpinner] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState(null);
  const { country, setCountry } = useContext(CountryContext);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    // onlySmall: true,
    onlyLarge: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    showCloseButton: false,

    // ...or any prop you want
  });
  const openPanel = (item) => {
    setOrderDetails(item);
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("My Orders");
    }
    fetchOrders();
  }, []);
  function fetchOrders() {
    // console.log(constants.API_BASE_URL + "/my_orders?member_id=" + user.id);
    Services(constants.API_BASE_URL + "/my_orders?member_id=" + user.id).then(
      (response) => {
        if (response) {
          setOrders(response);
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      }
    );
  }
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          // alignItems: "center",
          backgroundColor: Colors.white,
          borderColor: Colors.e4e4e4,
          borderWidth: 1,
          // justifyContent: "center",
          paddingVertical: 10,
          paddingHorizontal: 2,
          borderRadius: 15,
          margin: 10,

          shadowOpacity: 2,
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowColor: "grey",
          elevation: 5,
        }}
        onPress={() => openPanel(item)}
      >
        <View style={{ padding: responsiveWidth(4) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),

                fontFamily: Fonts.textfont,
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {language["Order ID"]} :
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),

                  fontFamily: Fonts.textfont,
                  fontWeight: "normal",
                  textAlign: "left",
                }}
              >
                {"  "}
                {item.id}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),

                fontFamily: Fonts.textfont,
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {language["No of Items"]} :
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),

                  fontFamily: Fonts.textfont,
                  fontWeight: "normal",
                  textAlign: "left",
                }}
              >
                {"  "}
                {item.cnt}
                {/* {item.products && item.products.length > 0
                  ? item.products.length
                  : 0} */}
              </Text>
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                marginTop: responsiveWidth(2),
                fontFamily: Fonts.textfont,
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {language["Order Date"]} :
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),
                  marginTop: responsiveWidth(2),
                  fontFamily: Fonts.textfont,
                  fontWeight: "normal",
                  textAlign: "left",
                }}
              >
                {"  "}{" "}
                {moment(moment(item.now, "DD-MM-YYYY")).format("DD-MM-YYYY")}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                marginTop: responsiveWidth(2),
                fontFamily: Fonts.textfont,
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {language["Price"]} :
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),
                  marginTop: responsiveWidth(2),
                  fontFamily: Fonts.textfont,
                  fontWeight: "normal",
                  textAlign: "left",
                }}
              >
                {"  "}
                {item.currency}{" "}
                {(
                  parseFloat(item.currency_price) * parseFloat(item.total_price)
                ).toFixed(3)}
              </Text>
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                marginTop: responsiveWidth(2),
                fontFamily: Fonts.textfont,
                fontWeight: "normal",
                textAlign: "left",
              }}
            >
              {language["Order Status"]} :{" "}
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),
                  marginTop: responsiveWidth(2),
                  fontFamily: Fonts.textfont,
                  fontWeight: "normal",
                  textAlign: "left",
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
          height: responsiveHeight(8),
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header
          title={language["My Orders"]}
          screen={"MyOrders"}
          navigation={props.navigation}
        />
      </View>
      {spinner ? (
        <View style={{ flex: 1 }}>
          <Skeleton />
        </View>
      ) : orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          // horizontal={false}
          // style={{ marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text
          style={{
            fontFamily: Fonts.textfont,
            marginTop: responsiveHeight(25),
            fontSize: responsiveFontSize(1.8),
            paddingLeft: responsiveWidth(2),
            color: Colors.black,
            textAlign: "center",
          }}
        >
          {language["No Data"]}
        </Text>
      )}
      <SwipeablePanel
        style={{ height: "auto" }}
        {...panelProps}
        isActive={isPanelActive}
      >
        <OrderDetails closePanel={closePanel} details={orderDetails} />
      </SwipeablePanel>
    </View>
  );
}
