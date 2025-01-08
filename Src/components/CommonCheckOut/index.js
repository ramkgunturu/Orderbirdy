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

import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import { SettingsContext } from "@context/settings-context";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";

export default function CommonCheckOut(props) {
  const dispatch = useDispatch();
  const [colorPayment, setColorPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [noOfItems, setNoOfItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [selectPayment, setSelectPayment] = useState(null);
  const [coupounAmount, setCoupounAmount] = useState(0);
  const [cartArray, setCartArray] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(props.getDeliveryCharges);
  const [dummy, setDummy] = useState(0);
  const { language, setLanguage } = useContext(LanguageContext);
  const { country, setCountry } = useContext(CountryContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [discount, setDiscount] = useState(0);

  // console.log(deliveryPrice, "DeliveryPrice");

  const paymentData1 = [
    {
      id: "1",
      title: language["Visa or Master"],
      image: Images.visa,
      label: "credit",
    },
    {
      id: "2",
      title: language["K-Net"],
      image: Images.knet,
      label: "KNET",
    },

    {
      id: "3",
      title: language["Cash on Delivery"],
      image: Images.cod,
      label: "COD",
    },
  ];

  const paymentData2 = [
    {
      id: "1",
      title: language["Visa or Master"],
      image: Images.visa,
      label: "credit",
    },
    {
      id: "2",
      title: language["K-Net"],
      image: Images.knet,
      label: "KNET",
    },
  ];

  const paymentData3 = [
    {
      id: "1",
      title: language["Cash on Delivery"],
      image: Images.cod,
      label: "COD",
    },
  ];

  useEffect(() => {
    setSpinner(true);
    calculateData();
  }, [props]);
  function calculateData() {
    items = 0;
    count = 0;
    price = 0;
    var deliveryChargesArray = [];
    if (cart && cart.cartItems.length > 0) {
      cart.cartItems.map((res, key) => {
        items = items + res.quantity;
        price =
          parseFloat(price) +
          parseFloat(res.quantity * res.price) +
          parseFloat(res.quantity * res.addonPrice);
        count = count + 1;
        deliveryChargesArray.push({
          id: res.id,
          quantity: res.quantity,
          weight: res?.weight,
        });
      });

      // if (props && props.selectAddressId) {
      //   deliveryChargesArray.country = props.selectAddressId.country;
      //   // console.log(props.selectAddressId, props.selectedValue);
      //   if (
      //     props.selectAddressId.country === "105" ||
      //     (props.selectAddressId.country === "105" && props.selectedValue)
      //   ) {
      //     Services(
      //       constants.API_BASE_URL +
      //         "delivery_charges/" +
      //         props.selectAddressId.area
      //     ).then((response) => {
      //       if (response.status === "Success") {
      //         props.getDeliveryCharges(response);
      //         setDeliveryPrice(response);
      //       } else {
      //         alert(response.message);
      //       }
      //     });
      //   } else {
      //     var dataArray = {
      //       country: props.selectAddressId.country,
      //       totalprice: price.toFixed(3),
      //       products: deliveryChargesArray,
      //     };
      //     Services(
      //       constants.API_BASE_URL + "shipping_charges",
      //       dataArray,
      //       "POST"
      //     ).then((response) => {
      //       if (response.status === "Success") {
      //         props.getDeliveryCharges(response);
      //         setDeliveryPrice(response.price);
      //       } else {
      //         alert(response.message);
      //       }
      //     });

      //     // setCartArray(dataArray);
      //   }
      // }
      if (cart.cartItems.length === count) {
        // setCartArray(deliveryChargesArray);
        // console.log(price.toFixed(3));
        setNoOfItems(items);
        setSubTotal(price.toFixed(3));
        props.getSubTotal(price.toFixed(3));
        setSpinner(false);
      }
    } else {
      setSpinner(false);
    }
  }

  const OnCouponApply = (coupon, amount) => {
    setIsLoading(true);
    var coupounData = {
      coupon: coupon,
      amount: amount,
    };
    Services(constants.API_BASE_URL + "coupon", coupounData, "POST").then(
      (response) => {
        if (response) {
          if (response.status === "Success") {
            setIsLoading(false);
            props.getCouponAmount(coupon, response.coupon_value);
            setDiscount(response.coupon_value);
            // console.log(response.coupon_value, "response.coupon_value");
          } else {
            setIsLoading(false);
            alert(response.message);
          }
        } else {
          setIsLoading(false);
          alert(response.message);
        }
      }
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderBottomWidth: index === cart.cartItems.length - 1 ? 0 : 0.5,
          borderBottomColor: "lightgrey",
          marginRight: responsiveWidth(2),
          borderRadius: 10,
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 0.3, padding: 5 }}>
          <Image
            style={{
              width: responsiveWidth(25),
              height: responsiveWidth(25),
              resizeMode: "contain",
              // padding: 5,
              // borderRadius: 10,
            }}
            source={{ uri: item.image }}
          />
        </View>
        <View style={{ flex: 0.7 }}>
          <View
            style={{
              flex: 1,
              padding: responsiveWidth(2),
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),

                    color: Colors.grey,
                    textTransform: "capitalize",
                    textAlign: "left",
                  }}
                >
                  {I18nManager.isRTL ? item.title_ar : item.title}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: responsiveWidth(2),
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.8),

                      color: Colors.grey,
                      textTransform: "uppercase",
                      marginTop: responsiveWidth(1.8),
                      //   marginHorizontal: responsiveWidth(1),
                    }}
                  >
                    {I18nManager.isRTL
                      ? country.currency.currency
                      : country.currency.currency_ar}{" "}
                    {(
                      parseInt(item.quantity) *
                      parseFloat(country.currency.price) *
                      (parseFloat(item.price) + parseFloat(item.addonPrice))
                    ).toFixed(3)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.8),

                      color: Colors.grey,
                      textTransform: "uppercase",
                      marginTop: responsiveWidth(1.8),
                    }}
                  >
                    x {parseInt(item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const paymentRenderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: responsiveWidth(5),
          borderWidth: 1,
          borderColor: Colors.lightgrey,
          marginTop: responsiveWidth(1),
          borderRadius: 10,
          paddingHorizontal: responsiveWidth(5),
          height: 50,
        }}
      >
        {item.id === selectPayment ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={Images.paymentafter}
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
              {item.title}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setSelectPayment(item.id);
              props.getPaymentMethod(item);
            }}
          >
            <Image
              source={Images.paymentbefore}
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
              {item.title}
            </Text>
          </TouchableOpacity>
        )}

        <Image
          source={item.image}
          style={{
            width: responsiveWidth(5),
            height: responsiveWidth(5),
            resizeMode: "contain",
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {spinner ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="black" />
        </View>
      ) : cart.cartItems && cart.cartItems.length > 0 ? (
        <View
          style={{
            flex: 1,
            marginTop: responsiveWidth(3),
            borderTopWidth: 0.5,
            borderTopColor: Colors.lightgrey,
          }}
        >
          <View style={{ flex: 1 }}>
            {/* <ScrollView style={{ flex: 1 }}> */}
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(2),

                color: Colors.black,
                textTransform: "uppercase",
                margin: responsiveWidth(3),
                textAlign: "left",
              }}
            >
              {language["Discount codes"]}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: responsiveWidth(3),
                marginTop: responsiveWidth(1.5),
                marginBottom: responsiveWidth(1.5),
              }}
            >
              <View
                style={{
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.black,
                  justifyContent: "center",
                  flex: 0.8,
                }}
              >
                <TextInput
                  placeholder={language["Coupon Code (optional)"]}
                  keyboardType={"default"}
                  placeholderTextColor={Colors.grey}
                  secureTextEntry={false}
                  onChangeText={(text) => setCouponCode(text)}
                  blurOnSubmit={true}
                  value={couponCode}
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    paddingHorizontal: responsiveWidth(2),
                    paddingVertical: responsiveWidth(1),
                    textAlign: I18nManager.isRTL ? "right" : "left",
                  }}
                  returnKeyType="done"
                // onSubmitEditing={() => onsubmit()}
                />
              </View>

              <TouchableOpacity
                style={{
                  height: 40,
                  borderWidth: 1,
                  borderColor: Colors.black,
                  marginHorizontal: responsiveWidth(1),
                  justifyContent: "center",
                  alignContent: "center",
                  flex: 0.2,
                  backgroundColor: Colors.black,
                }}
                onPress={() => OnCouponApply(couponCode, subTotal)}
              >
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(1.8),

                    color: Colors.white,
                    textTransform: "uppercase",
                    margin: responsiveWidth(2),
                    textAlign: "center",
                  }}
                >
                  {language["APPLY"]}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(2),

                color: Colors.black,
                textTransform: "uppercase",
                margin: responsiveWidth(3),
                textAlign: "left",
              }}
            >
              {language["payment method"]}
            </Text>
            <FlatList
              data={
                parseInt(settings.settings.cod) === 1 &&
                  parseInt(settings.settings.payment_method) === 1
                  ? props.cod === 1
                    ? paymentData1
                    : paymentData2
                  : parseInt(settings.settings.cod) === 0 &&
                    parseInt(settings.settings.payment_method) === 1
                    ? paymentData2
                    : parseInt(settings.settings.cod) === 1 &&
                      parseInt(settings.settings.payment_method) === 0
                      ? paymentData3
                      : paymentData1
              }
              renderItem={paymentRenderItem}
              keyExtractor={(item) => item.id}
              style={{ marginVertical: responsiveWidth(2) }}
              showsVerticalScrollIndicator={false}
            />

            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(2),

                color: Colors.black,
                textTransform: "uppercase",
                marginTop: responsiveWidth(8),
                marginHorizontal: responsiveWidth(3),
                textAlign: "left",
              }}
            >
              {language["order review"]}
            </Text>
            {/* <FlatList
              data={cart.cartItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ marginVertical: responsiveWidth(4) }}
            /> */}

            <View
              style={{
                marginHorizontal: responsiveWidth(3),
                borderBottomColor: Colors.lightgrey,
                borderBottomWidth: 0.5,
                borderTopColor: Colors.lightgrey,
                borderTopWidth: 0.5,
                marginTop: responsiveWidth(25),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: responsiveWidth(2),
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.grey,
                    textTransform: "capitalize",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                  }}
                >
                  {language["Order Value"]}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.grey,
                    textTransform: "uppercase",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {(country.currency.price * subTotal).toFixed(3)}
                </Text>
              </View>
              {parseInt(discount) > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: responsiveWidth(2),
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.8),
                      color: Colors.grey,
                      textTransform: "capitalize",
                      marginTop: responsiveWidth(2),
                      marginBottom: responsiveWidth(2),
                    }}
                  >
                    {language["Discount price"]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.8),
                      color: Colors.grey,
                      textTransform: "uppercase",
                      marginTop: responsiveWidth(2),
                      marginBottom: responsiveWidth(2),
                    }}
                  >
                    {I18nManager.isRTL
                      ? country.currency.currency
                      : country.currency.currency_ar}{" "}
                    {discount}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: responsiveWidth(2),
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.grey,
                    textTransform: "capitalize",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                  }}
                >
                  {language["delivery charges"]}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.grey,
                    textTransform: "uppercase",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {parseInt(deliveryPrice) === 0
                    ? "0.000"
                    : (country.currency.price * deliveryPrice).toFixed(3)}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginHorizontal: responsiveWidth(3),
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.textbold,
                  fontSize: responsiveFontSize(2),
                  color: Colors.Black,
                  textTransform: "uppercase",
                  marginTop: responsiveWidth(2),
                  marginBottom: responsiveWidth(2),
                }}
              >
                {language["Grand Total"]}
              </Text>
              {parseFloat(deliveryPrice) > 0 || discount != 0 ? (
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    textTransform: "uppercase",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                    marginHorizontal: responsiveWidth(5),
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {(
                    parseFloat(country.currency.price * subTotal) +
                    parseFloat(country.currency.price * deliveryPrice) -
                    parseFloat(discount)
                  ).toFixed(3)}
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    textTransform: "uppercase",
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(2),
                    marginHorizontal: responsiveWidth(5),
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {(
                    parseFloat(country.currency.price) * parseFloat(subTotal)
                  ).toFixed(3)}
                </Text>
              )}
            </View>
          </View>
          {/* </ScrollView> */}
        </View>
      ) : null}

      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <ActivityIndicator size="small" color="black" />
        </View>
      ) : null}
    </View>
  );
}
