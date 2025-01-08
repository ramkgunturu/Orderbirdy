import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";

import LottieView from "lottie-react-native";
import {
  useNavigation,
  StackActions,
  CommonActions,
} from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Colors, Fonts } from "@Themes";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import Services from "@Services";
import constants from "@constants";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";
const url = constants.API_BASE_URL;

// let orderStatus = false;
export default function OrderSuccess({
  closePanel,
  placeOrder,
  type,
  routingFrom,
  paymentId,
  orderStatus,
}) {
  const navigation = useNavigation();
  const trackingStatus = useContext(TrackingPermissionContext);
  const dispatch = useDispatch();
  const { language, setLanguage } = useContext(LanguageContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(paymentId ? paymentId : null);
  const [spinner, setSpinner] = useState(true);
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const fadeOut = React.useRef(new Animated.Value(1)).current;
  const { settings, setSettings } = useContext(SettingsContext);
  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);

  React.useEffect(() => {
    // console.log("HIIi1");
    if (routingFrom) {
      setSpinner(false);
    } else {
      // console.log("HIIi2");
      // console.log(orderStatus);
      if (!orderStatus) {
        // console.log("HIIi3");
        onPlacingOrder();
      }
    }
    Animated.timing(fadeIn, {
      toValue: isAnimationFinished ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeOut, {
      toValue: isAnimationFinished ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isAnimationFinished, fadeIn, fadeOut]);
  // const { clearCart } = React.useContext(CartContext);

  // console.log(placeOrder, "final Print");
  function onPlacingOrder() {
    Services(url + type, placeOrder, "POST").then((response) => {
      // console.log(response, "---count");
      if (response.status === "Success") {
        if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
          AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Purchased, {
            currency: 'KWD',
            value: placeOrder.total_price,
          });

          AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedPaymentInfo, {
            currency: 'KWD',
            value: placeOrder.total_price,
            payment_type: placeOrder.payment_method,
            content_type: 'product',
            content_ids: placeOrder.products.map(product => product.product_id).join(','),
          });
        }
        // console.log(response, "---count");
        orderStatus = true;
        setOrderId(response.invoice_id);
        if (placeOrder.payment_method === "COD") {
          cartActions.emptyCart(dispatch, null);
          setSpinner(false);
          // setTimeout(() => {
          //   setSpinner(false);
          // }, 10000);
        } else {

          setTimeout(() => {
            closePanel();
            orderStatus = false;
            navigation.push("Payment", {
              invoice_id: response.invoice_id,
              type: placeOrder.payment_method,
            });
          }, 10000);
        }
      } else {
        setSpinner(false);
        alert(response.message);
        closePanel();
      }
    });
  }

  const _onAnimationFinish = () => {
    setIsAnimationFinished(true);
  };

  const _onBackdropPress = () => {
    setIsAnimationFinished(false);
  };

  const _onOrderSomethingElseButtonPressed = () => {
    // clearCart();
    // actions.emptyCart(dispatch, []);
    // navigation.navigate('HomeScreen');
  };

  const _onTrackOrderButtonPressed = () => {
    closePanel();
    orderStatus = false;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "BottomTabNavigation" }],
      })
    );
    // actions.emptyCart(dispatch, []);
    // navigation.dispatch(StackActions.replace('TrackOrder', { orderId: route.params.orderId }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {spinner ? (
          <Image
            source={Images.shipping}
            resizeMode="contain"
            style={{ width: "100%", height: responsiveWidth(50) }}
          />
        ) : (
          <LottieView
            source={require("@Images/animations/order-success.json")}
            autoPlay
            loop={false}
            onAnimationFinish={_onAnimationFinish}
            style={styles.lottieView}
          />
        )}

        {!isAnimationFinished && (
          <Animated.View
            style={[styles.processingOrderContainer, { opacity: fadeOut }]}
          >
            <Text>{language["Processing Your Order"]}...</Text>
          </Animated.View>
        )}
        <Animated.View
          style={[styles.successMessageContainer, { opacity: fadeIn }]}
        >
          <Text>{language["Thank you for your order"]}.</Text>

          <Text style={styles.successMessage}>
            {language["Your order Number is"]}{" "}
            <Text style={{ fontSize: 15, fontWeight: "normal" }}>
              # {orderId}
            </Text>
          </Text>

          {/* <Animated.View
            style={[styles.footerButtonContainer, { opacity: fadeIn }]}
          > */}
          <TouchableOpacity
            style={{
              // height: 50,
              borderWidth: 1,
              borderColor: settings.settings.color1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: responsiveWidth(2),
              flexDirection: "row",
              marginHorizontal: responsiveWidth(1),
              paddingHorizontal: responsiveWidth(2),
              borderRadius: 5,
              marginBottom: responsiveWidth(9),
              backgroundColor: settings.settings.color1,
            }}
            onPress={_onTrackOrderButtonPressed}
          >
            <Text style={styles.trackText}>{language["GO TO HOME"]}</Text>
          </TouchableOpacity>
          {/* </Animated.View> */}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    justifyContent: "center",
  },
  processingOrderContainer: {
    marginTop: 10,
  },
  content: {
    marginTop: responsiveWidth(40),
    width: "100%",
    padding: 30,
    alignItems: "center",
  },
  lottieView: {
    width: "45%",
  },
  successMessageContainer: {
    alignItems: "center",
  },
  successMessage: {
    marginTop: 5,
  },
  footerButtonContainer: {
    width: "100%",
    marginTop: 5,
    paddingBottom: 25,
    // padding: 15,
  },
  orderSomethingButton: {
    marginTop: 10,
  },
  trackText: {
    fontFamily: Fonts.textfont,
    fontSize: responsiveFontSize(2),
    color: Colors.white,
    textTransform: "capitalize",
    // textDecorationStyle: "solid",
    // textDecorationLine: "underline",
  },
});
