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
  TouchableOpacity,
  TextInput,
  I18nManager,
  ScrollView,
  platform,
} from "react-native";
import Services from "@Services";
import constants from "@constants";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Fonts, Colors } from "@Themes";
import {
  Header,
  SingUp,
  InputField,
  ProductDisplay,
  ProductDetails,
} from "@components";
// import { Content, Row, Spinner } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import moment from "moment";
import { UserContext } from "@context/user-context";
import { SwipeablePanel } from "rn-swipeable-panel";
import { LanguageContext } from "@context/lang-context";
import { CommonCheckOut, AddressList, OrderSuccess } from "@components";
import { CountryContext } from "@context/country-context";
import { SettingsContext } from "@context/settings-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function CheckOut(props) {
  const dispatch = useDispatch();
  const [payment, setPayment] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(null);
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [noOfItems, setNoOfItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [deliveryCharges, setDeliveryCharges] = useState(null);
  const [placeOrderDetails, setPlaceOrderDetails] = useState(null);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const { country, setCountry } = useContext(CountryContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [discount, setDiscount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [weightCalculate, setWeightCalculate] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState(
    settings.settings.delivery_now === "1" ? "1" : "0"
  );
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState({});
  const [selectDeliveryTime, setSelectDeliveryTime] = useState(null);
  const [tomorrowDate, setTomorrowDate] = useState(null);
  const [dummy, setDummy] = useState(0);
  const trackingStatus = useContext(TrackingPermissionContext);

  const [cod, setCod] = useState(null);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    // onlySmall: true,
    openLarge: true,
    onlyLarge: true,
    noBackgroundOpacity: true,
    showCloseButton: false,
    noBar: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // closeOnTouchOutside: true,
    // ...or any prop you want
  });
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Products Category");
    }
    // var today = moment();
    // var tomorrow = today.add("days", 0);
    // console.log(tomorrow, "tomorrow");
    // console.log(new Date());
    // console.log(moment(tomorrow).format());
    // console.log(new Date(tomorrow));
    setTomorrowDate(new Date());
    setPayment(null);
    setSpinner(true);
    calculateData();
  }, [selectAddressId]);
  function calculateData() {
    let items = 0;
    let count = 0;
    let price = 0;
    let weight = 0;
    if (cart && cart.cartItems.length > 0) {
      cart.cartItems.map((res, key) => {
        items = items + res.quantity;
        price =
          parseFloat(price) +
          parseFloat(res.quantity * res.price) +
          parseFloat(res.quantity * res.addonPrice);
        weight = weight + parseFloat(res?.weight);
        count = count + 1;
      });

      if (cart.cartItems.length === count) {
        setWeightCalculate(weight);
        setNoOfItems(items);
        // setSubTotal(price);
      }
      fetchAddresses();
    } else {
      setSpinner(false);
    }
  }

  function getDeliveryCharges(value) {
    setDeliveryCharges(value);
  }
  function getCouponAmount(coupnCode, amount) {
    setCoupon(coupnCode);
    setDiscount(amount);
  }

  function getPaymentMethod(value) {
    setPayment(value);
  }
  const closePanel = () => {
    setIsPanelActive(false);
  };

  function getSubTotal(value) {
    setSubTotal(value);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.log(selectAddressId, "------00000");
    if (selectAddressId) {
      if (
        moment(new Date()).format("DD-MM-YYYY") ===
        moment(date).format("DD-MM-YYYY")
      ) {
        var today = moment();
        var tomorrow = today.add("days", 1);
        setSelectedDate(moment(new Date(tomorrow)).format("DD-MM-YYYY"));
      } else {
        setSelectedDate(moment(date).format("DD-MM-YYYY"));
      }

      hideDatePicker();

      // getfetchDeliveryTime(
      //   moment(date).format("DD-MM-YYYY"),
      //   selectAddressId.area
      // );
    } else {
      hideDatePicker();
      let errormessage = language["Please select Delivery Address"];
      alert(errormessage);
    }
  };
  function fetchAddresses() {
    setSpinner(true);
    // console.log(constants.API_BASE_URL + "/addresses?memnber_id=" + user.id);
    Services(constants.API_BASE_URL + "/addresses?member_id=" + user.id).then(
      (response) => {
        if (response) {
          if (response.length >= 0) {
            // console.log(response, "-----");
            setAddress(response);
            setSpinner(false);
          }
        } else {
          setSpinner(false);
        }
      }
    );
  }

  const handleOnNavigateBack = (value) => {
    setSelectAddressId(value);

    if (value.country === "105") {
      setCod(1);
      getfetchDelivery(value.area, 0, 0);
    } else {
      setCod(0);
      getfetchDelivery(value.country, 1, weightCalculate);
    }
  };
  function getfetchDelivery(areaId, type, weight) {
    setSpinner(true);
    console.log(
      constants.API_BASE_URL + "delivery/" + areaId + "/" + type + "/" + weight
    );
    Services(
      constants.API_BASE_URL + "delivery/" + areaId + "/" + type + "/" + weight
    ).then((response) => {
      // console.log(response, "response");
      if (response) {
        setDeliveryInfo(response);
        if (response && response.delivery_now === "0") {
          setTomorrowDate();
          setDeliveryOption("2");
          var today = moment();
          var tomorrow = today.add("days", 1);
          setTomorrowDate(new Date(tomorrow));
        } else if (response && response.delivery_now === "1") {
          var today = moment();
          var tomorrow = today.add("days", 0);
          setTomorrowDate(new Date(tomorrow));
        }
        setDummy(dummy + 1);
        if (parseFloat(subTotal) < parseFloat(response.minimum)) {
          setSpinner(false);
          let errormessage =
            language["Please select your order amount more than"] +
            "  " +
            (I18nManager.isRTL
              ? country.currency.currency
              : country.currency.currency_ar) +
            "  " +
            response.minimum;
          alert(errormessage);
        }
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  }

  function getfetchDeliveryTime(date, areaId) {
    setSpinner(true);
    // console.log(
    //   constants.API_BASE_URL + "delivery_time/" + areaId + "/" + date
    // );
    Services(
      constants.API_BASE_URL + "delivery_time/" + areaId + "/" + date
    ).then((response) => {
      if (response) {
        if (response === "") {
          let errormessage = language["Please select a different date"];
          alert(errormessage);
        }
        // console.log(response, "---response----");
        setDeliveryTime(response);
        setSpinner(false);
      } else {
        if (response === "") {
          let errormessage = language["Please select a different date"];
          alert(errormessage);
        }
        setSpinner(false);
      }
    });
  }

  function onSubmit() {
    // console.log(parseFloat(subTotal).toFixed(3), "-----");
    if (!selectAddressId) {
      let addressmessage = language["Please select Delivery Address"];
      alert(addressmessage);
    } else if (!payment) {
      let paymessage = language["Please select a payment type"];
      alert(paymessage);
    } else if (!selectedDate && deliveryOption === "2") {
      let datemessage = language["Please select Delivery Date"];
      alert(datemessage);
    } else if (parseFloat(subTotal) < parseFloat(deliveryInfo.minimum)) {
      let errormessage =
        language["Please select your order amount more than"] +
        "  " +
        (I18nManager.isRTL
          ? country.currency.currency
          : country.currency.currency_ar) +
        "  " +
        deliveryInfo.minimum;
      alert(errormessage);
    } else {
      var products = [];
      cart.cartItems.map((product, i) => {
        // console.log(product.addonPrice);
        // console.log(
        //   parseInt(product.quantity) *
        //     (parseFloat(product.price) + parseFloat(product.addonPrice))
        // );

        products.push({
          product_id: product.id,
          product_name: product.title,
          product_name_ar: product.title_ar,
          product_price: product.price,
          // product_code: product.item_code,
          quantity: product.quantity,
          price: product.price,
          addonPrice: product.addonPrice,
          total: (
            parseInt(product.quantity) *
            (parseFloat(product.price) + parseFloat(product.addonPrice))
          ).toFixed(3),
          addons: product.addons,
          weight: product?.weight,
          extra_details: product.extradetails ? product.extradetails : "",
        });
      });
      // if (payment.id === "5") {
      //   payment.label = payment.label";
      // } else {
      //   payment.label = "KNET";
      // }

      var placeOrder = {
        address_id: selectAddressId.id,
        payment_method: payment.label,
        addr_type: "Delivery",
        price: subTotal,
        coupon: coupon ? coupon : "",
        discount: discount ? discount : "",
        delivery_charges: deliveryInfo.delivery_charges,
        total_price: (
          parseFloat(subTotal) +
          parseFloat(deliveryInfo.delivery_charges) -
          parseFloat(discount)
        ).toFixed(3),
        member_id: user.id ? user.id : "",
        products: products,
        deliver_time: deliveryInfo.delivery_time
          ? deliveryInfo.delivery_time
          : "",
        currency: country ? country.currency.id : "",
        delivery_timing: deliveryOption ? deliveryOption : "",
        delivery_date: selectedDate ? selectedDate : "",
        delivery_time: selectDeliveryTime ? selectDeliveryTime : "",
      };
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logPurchase(
          parseFloat(placeOrder.total_price),
          "KWD",
          { param: JSON.stringify(placeOrder) }
        );
      }
      // console.log(deliveryCharges);
      // console.log(placeOrder);

      // if (payment.id === "5") {
      //   setPlaceOrderDetails(placeOrder);
      //   setIsPanelActive(true);
      // } else {
      //   setPlaceOrderDetails(placeOrder);
      //   setIsPanelActive(true);
      // }
      if (deliveryInfo && parseInt(deliveryInfo.cur_status) === 1) {
        setPlaceOrderDetails(placeOrder);
        setIsPanelActive(true);
      } else {
        let errormessage = language["Shop is busy"];
        alert(errormessage);
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"CheckOut"} title={language["CheckOut"]} />
      </View>
      {spinner ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="black" />
        </View>
      ) : cart.cartItems && cart.cartItems.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: Fonts.textbold,
                  fontSize: responsiveFontSize(2),
                  fontWeight: "normal",
                  color: Colors.black,
                  textTransform: "uppercase",
                  margin: responsiveWidth(3),
                }}
              >
                {language["address"]}
              </Text>
              {address && address.length > 0 ? (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25,
                    marginHorizontal: responsiveWidth(8),
                    marginBottom: responsiveWidth(1),
                  }}
                  onPress={() =>
                    navigation.push("AddressList", {
                      onNavigateBack: handleOnNavigateBack,
                    })
                  }
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(2),
                      fontWeight: "normal",
                      color: Colors.black,
                      textTransform: "uppercase",
                      margin: responsiveWidth(2),
                    }}
                  >
                    {selectAddressId
                      ? selectAddressId.title
                      : language["Select Address"]}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25,
                    marginHorizontal: responsiveWidth(8),
                    marginBottom: responsiveWidth(1),
                  }}
                  onPress={() =>
                    navigation.push("AddressList", {
                      onNavigateBack: handleOnNavigateBack,
                    })
                  }
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(2),
                      fontWeight: "normal",
                      color: Colors.black,
                      textTransform: "uppercase",
                      margin: responsiveWidth(2),
                    }}
                  >
                    {language["add new address"]}
                  </Text>
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontFamily: Fonts.textbold,
                  fontSize: responsiveFontSize(2),
                  fontWeight: "normal",
                  color: Colors.black,
                  textTransform: "uppercase",
                  margin: responsiveWidth(3),
                }}
              >
                {language["Delivery Time"]}
              </Text>
              <View
                style={{
                  flex: 1,

                  // alignItems: "center",
                  // justifyContent: "space-between",
                  // marginHorizontal: responsiveWidth(5),

                  marginTop: responsiveWidth(1),
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(5),
                }}
              >
                {settings.settings.delivery_now === "1" ||
                  (deliveryInfo && deliveryInfo.delivery_no === "1") ? (
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flex: 1 }}
                      pointerEvents={
                        deliveryInfo && deliveryInfo.delivery_now === "0"
                          ? "none"
                          : "auto"
                      }
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          // justifyContent: "center",
                          alignItems: "center",
                          marginTop: responsiveWidth(1),
                        }}
                        onPress={() => {
                          setDeliveryOption("1");
                          setSelectedDate(null);
                          setSelectDeliveryTime(null);
                        }}
                      >
                        <Image
                          source={
                            deliveryOption === "1"
                              ? Images.paymentafter
                              : Images.paymentbefore
                          }
                          style={{
                            width: responsiveWidth(4),
                            height: responsiveWidth(4),
                            resizeMode: "contain",
                          }}
                        />

                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.8),
                            color:
                              deliveryOption === "2"
                                ? Colors.lightgrey
                                : Colors.black,
                            textTransform: "capitalize",
                            marginHorizontal: responsiveWidth(2),
                            textAlign: "left",
                          }}
                        >
                          {language["Delivered within"]}{" "}
                          {/* {deliveryInfo && deliveryInfo.delivery_now === "1" */}
                          {deliveryInfo
                            ? I18nManager.isRTL
                              ? deliveryInfo.delivery_time_ar
                              : deliveryInfo.delivery_time
                            : language["Selected  Area"]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          // justifyContent: "center",
                          alignItems: "center",
                          marginTop: responsiveWidth(2),
                        }}
                        onPress={() => setDeliveryOption("2")}
                      >
                        <Image
                          source={
                            deliveryOption === "2"
                              ? Images.paymentafter
                              : Images.paymentbefore
                          }
                          style={{
                            width: responsiveWidth(4),
                            height: responsiveWidth(4),
                            resizeMode: "contain",
                          }}
                        />

                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.8),
                            color:
                              deliveryOption === "1"
                                ? Colors.lightgrey
                                : Colors.black,
                            textTransform: "capitalize",
                            marginHorizontal: responsiveWidth(2),
                            textAlign: "left",
                          }}
                        >
                          {language["Delivery Later"]}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          paddingBottom: responsiveWidth(2),
                          marginTop: responsiveWidth(2),
                        }}
                        pointerEvents={deliveryOption === "1" ? "none" : "auto"}
                      >
                        <View style={{ flex: 0.5 }}>
                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color:
                                deliveryOption === "1"
                                  ? Colors.lightgrey
                                  : Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivery Date"] + " *"}
                          </Text>
                          <TouchableOpacity
                            style={{
                              height: 45,
                              borderWidth: 1,
                              borderColor: "black",
                              marginHorizontal: responsiveWidth(2),
                              justifyContent: "center",
                              marginTop: responsiveWidth(2),
                            }}
                            onPress={showDatePicker}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.textbold,
                                fontSize: responsiveFontSize(1.8),
                                color:
                                  deliveryOption === "1"
                                    ? Colors.lightgrey
                                    : Colors.black,
                                textTransform: "uppercase",
                                textAlign: "left",
                                marginHorizontal: responsiveWidth(2),
                              }}
                            >
                              {selectedDate
                                ? selectedDate
                                : language["Select Date"]}
                            </Text>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              // minimumDate={new Date()}
                              minimumDate={tomorrowDate}
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </TouchableOpacity>
                        </View>

                        {/* <View
                          style={{
                            flex: 0.5,
                            marginTop: I18nManager.isRTL
                              ? responsiveWidth(0)
                              : 0,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color:
                                deliveryOption === "1"
                                  ? Colors.lightgrey
                                  : Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivery Time"] + " *"}
                          </Text>
                          <View
                            style={{
                              height: 45,
                              borderWidth: 1,
                              borderColor: "black",
                              marginHorizontal: responsiveWidth(2),
                              justifyContent: "center",
                              marginTop: responsiveWidth(2),
                            }}
                          >
                            <RNPickerSelect
                              fixAndroidTouchableBug={true}
                              pickerProps={{
                                accessibilityLabel: selectDeliveryTime,
                              }}
                              placeholder={{
                                label: language["Select Time"],
                                value: "",
                              }}
                              items={deliveryTime}
                              useNativeAndroidPickerStyle={true}
                              onValueChange={(value) => {
                                setSelectDeliveryTime(value);
                              }}
                              // onDonePress={() => setSelectDeliveryTime(value)}
                              style={{
                                ...styles,
                                // iconContainer: {
                                //   top: responsiveWidth(1),
                                //   color: Colors.black,
                                //   alignItems: "center",
                                // },
                              }}
                              value={selectDeliveryTime}
                            >
                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  // justifyContent: "center",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.textbold,
                                    fontSize: responsiveFontSize(1.8),
                                    color:
                                      deliveryOption === "1"
                                        ? Colors.lightgrey
                                        : Colors.black,
                                    textTransform: "uppercase",
                                    textAlign: "left",
                                    marginHorizontal: responsiveWidth(2),
                                  }}
                                >
                                  {selectDeliveryTime
                                    ? moment(
                                        moment(
                                          selectDeliveryTime,
                                          "DD-MM-YYYY h:mm:ss a "
                                        )
                                      ).format("h:mm A")
                                    : language["Select Time"]}
                                </Text>

                                <Image
                                  source={Images.downarrow}
                                  style={{
                                    width: responsiveWidth(4),
                                    height: responsiveWidth(4),
                                    margin: responsiveWidth(2),
                                    resizeMode: "contain",
                                    tintColor:
                                      deliveryOption === "1"
                                        ? Colors.lightgrey
                                        : Colors.black,
                                  }}
                                />
                              </TouchableOpacity>
                            </RNPickerSelect>
                          </View>
                        </View> */}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        // justifyContent: "center",
                        alignItems: "center",
                        marginTop: responsiveWidth(2),
                      }}
                      onPress={() => setDeliveryOption("2")}
                    >
                      <Image
                        source={
                          deliveryOption === "2"
                            ? Images.paymentafter
                            : Images.paymentbefore
                        }
                        style={{
                          width: responsiveWidth(4),
                          height: responsiveWidth(4),
                          resizeMode: "contain",
                        }}
                      />

                      <Text
                        style={{
                          fontFamily: Fonts.textfont,
                          fontSize: responsiveFontSize(1.8),
                          color: Colors.black,
                          textTransform: "capitalize",
                          marginHorizontal: responsiveWidth(2),
                          textAlign: "left",
                        }}
                      >
                        {language["Delivery Later"]}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingBottom: responsiveWidth(2),
                        marginTop: responsiveWidth(2),
                      }}
                      pointerEvents={deliveryOption === "1" ? "none" : "auto"}
                    >
                      <View style={{ flex: 0.5 }}>
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.8),
                            color: Colors.black,
                            textTransform: "capitalize",
                            marginHorizontal: responsiveWidth(2),
                            textAlign: "left",
                          }}
                        >
                          {language["Delivery Date"] + " *"}
                        </Text>
                        <TouchableOpacity
                          style={{
                            height: 45,
                            borderWidth: 1,
                            borderColor: "black",
                            marginHorizontal: responsiveWidth(2),
                            justifyContent: "center",
                            marginTop: responsiveWidth(2),
                          }}
                          onPress={showDatePicker}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.textbold,
                              fontSize: responsiveFontSize(1.8),
                              color: Colors.black,
                              textTransform: "uppercase",
                              textAlign: "left",
                              marginHorizontal: responsiveWidth(2),
                            }}
                          >
                            {selectedDate
                              ? selectedDate
                              : language["Select Date"]}
                          </Text>
                          <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            // minimumDate={new Date()}
                            minimumDate={tomorrowDate}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* <View
                        style={{
                          flex: 0.5,
                          marginTop: I18nManager.isRTL ? responsiveWidth(0) : 0,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.8),
                            color: Colors.black,
                            textTransform: "capitalize",
                            marginHorizontal: responsiveWidth(2),
                            textAlign: "left",
                          }}
                        >
                          {language["Delivery Time"] + " *"}
                        </Text>
                        <View
                          style={{
                            height: 45,
                            borderWidth: 1,
                            borderColor: "black",
                            marginHorizontal: responsiveWidth(2),
                            justifyContent: "center",
                            marginTop: responsiveWidth(2),
                          }}
                        >
                          <RNPickerSelect
                            fixAndroidTouchableBug={true}
                            pickerProps={{
                              accessibilityLabel: selectDeliveryTime,
                            }}
                            placeholder={{
                              label: language["Select Time"],
                              value: "",
                            }}
                            items={deliveryTime}
                            useNativeAndroidPickerStyle={true}
                            onValueChange={(value) => {
                              setSelectDeliveryTime(value);
                            }}
                            // onDonePress={() => setSelectDeliveryTime(value)}
                            style={{
                              ...styles,
                              // iconContainer: {
                              //   top: responsiveWidth(1),
                              //   color: Colors.black,
                              //   alignItems: "center",
                              // },
                            }}
                            value={selectDeliveryTime}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                // justifyContent: "center",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Fonts.textbold,
                                  fontSize: responsiveFontSize(1.8),
                                  color: Colors.black,
                                  textTransform: "uppercase",
                                  textAlign: "left",
                                  marginHorizontal: responsiveWidth(2),
                                }}
                              >
                                {selectDeliveryTime
                                  ? moment(
                                      moment(
                                        selectDeliveryTime,
                                        "DD-MM-YYYY h:mm:ss a"
                                      )
                                    ).format("h:mm A")
                                  : language["Time"]}
                              </Text>

                              <Image
                                source={Images.downarrow}
                                style={{
                                  width: responsiveWidth(4),
                                  height: responsiveWidth(4),
                                  margin: responsiveWidth(2),
                                  resizeMode: "contain",
                                  tintColor: Colors.black,
                                }}
                              />
                            </TouchableOpacity>
                          </RNPickerSelect>
                        </View>
                      </View> */}
                    </View>
                  </View>
                )}
              </View>

              <CommonCheckOut
                getCouponAmount={getCouponAmount}
                getPaymentMethod={getPaymentMethod}
                selectAddressId={selectAddressId}
                getDeliveryCharges={
                  deliveryInfo && deliveryInfo.delivery_charges
                    ? deliveryInfo.delivery_charges
                    : 0
                }
                getSubTotal={getSubTotal}
                cod={cod}
              />
            </View>
          </ScrollView>
          <TouchableOpacity
            style={{
              // flex: 0.05,
              // backgroundColor: Colors.checkout,
              // justifyContent: "center",
              // alignItems: "center",
              // borderRadius: 25,
              // marginHorizontal: responsiveWidth(1),
              // marginBottom: responsiveWidth(1),
              height: 50,
              borderWidth: 1,
              borderColor: settings.settings.color1,
              backgroundColor: settings.settings.color1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: responsiveWidth(2),
              flexDirection: "row",
              marginHorizontal: responsiveWidth(1),
              paddingHorizontal: responsiveWidth(2),
              borderRadius: 5,
              marginBottom: responsiveWidth(2),
            }}
            // onPress={() => onSubmit()}
            onPress={() => {
              if (
                deliveryInfo &&
                deliveryInfo.minimum &&
                parseFloat(subTotal) < parseFloat(deliveryInfo.minimum)
              ) {
                let erromessge =
                  language["Please select your order amount more than"] +
                  "  " +
                  (I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar) +
                  "  " +
                  deliveryInfo.minimum;
                alert(erromessge);
              } else {
                onSubmit();
              }
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
                textTransform: "uppercase",
              }}
            >
              {language["Place Order"]}
            </Text>
            {/* <Text
              style={{
                color: settings.settings.color1,
                fontFamily: Fonts.textfont,

                fontSize: responsiveFontSize(2),
                textTransform: "uppercase",
              }}
            >
              {deliveryInfo && deliveryInfo.minimum
                ? parseFloat(subTotal) >= parseFloat(deliveryInfo.minimum)
                  ? language["Place Order"]
                  : language[
                      "Please select your order amount  more then or equal to"
                    ] +
                    "  " +
                    deliveryInfo.minimum
                : language["Place Order"]}
            </Text> */}
          </TouchableOpacity>
        </View>
      ) : null}
      <SwipeablePanel
        style={{ height: "100%" }}
        {...panelProps}
        isActive={isPanelActive}
      >
        <OrderSuccess
          closePanel={closePanel}
          placeOrder={placeOrderDetails}
          type={"checkout"}
        />
      </SwipeablePanel>
    </View>
  );
}
