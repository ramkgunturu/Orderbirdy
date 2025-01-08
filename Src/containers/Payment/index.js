import React, { useState, useContext } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, StackActions } from "@react-navigation/native";
import constants from "@constants";
import { Header, OrderSuccess } from "@components";
import { SwipeablePanel } from "rn-swipeable-panel";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const url = constants.API_BASE_URL;
export default function Payment({ route }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const navigation = useNavigation();
  const [orderId, setOrderId] = useState(route.params.invoice_id);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [type, setType] = useState(route.params.type);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    // onlySmall: true,
    openLarge: true,
    onlyLarge: true,
    noBackgroundOpacity: true,
    noBar: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // closeOnTouchOutside: true,
    // ...or any prop you want
  });

  function _onLoad(state) {
    // console.log("@@@@", state.url);
    // console.log(url + "failedapp/" + orderId + "/ios", "hhhh");
    // console.log("@@@@----", url + "/success/1/ios");
    if (!value) {
      if (state.url === url + "success/" + orderId + "/ios") {
        if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
          AppEventsLogger.logEvent("Payment Success");
        }
        // console.log("sucesss----")
        setValue(1);
        cartActions.emptyCart(dispatch, null);
        setIsPanelActive(true);
      } else if (state.url === url + "failedapp/" + orderId + "/ios") {
        // console.log("failed----");
        if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
          AppEventsLogger.logEvent("Order Failed");
        }
        setValue(1);

        navigation.pop();
      } else {
        // console.log("else");
      }
    }
  }
  const closePanel = () => {
    setIsPanelActive(false);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: responsiveHeight(8) }}>
        <Header title={"Payment"} screen={"Payment"} />
      </View>
      <WebView
        source={{
          uri: url + "/payment?invoice_id=" + orderId + "&type=" + type,
        }}
        onNavigationStateChange={_onLoad}
        startInLoadingState
      />
      <SwipeablePanel
        style={{ height: "100%" }}
        {...panelProps}
        isActive={isPanelActive}
      >
        <OrderSuccess
          closePanel={closePanel}
          paymentId={orderId}
          routingFrom={"payment"}
        />
      </SwipeablePanel>
    </View>
  );
}
