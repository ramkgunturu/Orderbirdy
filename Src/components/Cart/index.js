import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  I18nManager,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Colors, Images, Fonts } from "@Themes";
import { Header, ProductRow, ModalAlert } from "@components";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import RNPickerSelect from "react-native-picker-select";
import Skeleton from "./Skeleton";
import Services from "@Services";
import constants from "@constants";
import styles from "./styles";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import { Platform } from "react-native";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import FastImage from "react-native-fast-image";
import { CountryContext } from "@context/country-context";
import { boolean } from "yup";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

let count = 0;
let items = 0;
let price = 0;

let sUpated = 0;

export default function Cart(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [noOfItems, setNoOfItems] = useState(0);
  const [sizeSelect, setSizeSelect] = useState(0);
  const [size, setSize] = useState(0);
  const [quantity, setQunatity] = useState(0);
  const [selectId, setSelectId] = useState(null);
  const [selectQunatityId, setSelectQunatityId] = useState(null);
  const [selectUniqueId, setSelectUniqueId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [qUpdated, setQUpdated] = useState(0);
  const [details, setDetails] = useState(null);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { country, setCountry } = useContext(CountryContext);
  const [isFocused, setIsFocused] = useState(useIsFocused());
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusQuantity, setStatusQuantity] = useState(null);
  const [statusResponse, setStatusResponse] = useState(null);
  const [dummy, setDummy] = useState(0);
  const trackingStatus = useContext(TrackingPermissionContext);
  // console.log(cart && cart.cartItems, "cart && cart.cartItems");
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Cart Screen");
    }
    // setSpinner(true);
    setSizeSelect(0);
    setQunatity(0);
    setSelectId(null);
    setQUpdated(0);
    setSelectQunatityId(null);
    setSelectUniqueId(null);
    calculateData();
  }, [cart, cart.cartItems, isFocused, dummy]);
  function calculateData() {
    count = 0;
    items = 0;
    price = 0;
    sUpated = 0;

    if (cart && cart.cartItems.length > 0) {
      cart.cartItems.map((res, key) => {
        var quantityArray = [];

        items = parseInt(items) + parseInt(res.quantity);

        price =
          parseFloat(price) +
          parseFloat(res.quantity * res.price) +
          parseFloat(res.quantity * res.addonPrice);
        count = count + 1;
        // console.log(res.available_quantity, "res.available_quantity");
        for (i = 1; i <= parseInt(res.available_quantity); i++) {
          quantityArray.push({ label: i.toString(), value: i.toString() });
        }

        res.quantity_array = quantityArray;
      });

      if (cart.cartItems.length === count) {
        setNoOfItems(items);
        setSubTotal(price);
        setTimeout(() => {
          setSpinner(false);
          setIsUpdating(false);
        }, 1000);
      }
    } else {
      setSpinner(false);
      setIsUpdating(false);
    }
  }

  const onDelete = (item) => {
    setModalVisible(false);
    cartActions.removeFromCart(dispatch, item);
    calculateData();
    setSpinner(true);
  };

  function onUpdateItem(item) {
    setDummy(dummy + 1);
    // item.quantity_array = [];
    // console.log(quantity, "quantity");

    if (quantity != 0) {
      item.quantity = quantity;
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: item.id,
          currency: 'KWD',
          value: item.price,
        });
      }
      cartActions.addToCart(dispatch, item);
      // calculateData();
      setIsUpdating(true);
    } else {
      setQunatity(item.quantity);
    }
  }
  function onUpdateAndroidItem(item, quantity) {
    setDummy(dummy + 1);
    // item.quantity_array = [];
    // console.log(quantity, "quantity");

    if (quantity != 0) {
      item.quantity = quantity;
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: item.id,
          currency: 'KWD',
          value: item.price,
        });
      }
      cartActions.addToCart(dispatch, item);
      // calculateData();
      setIsUpdating(true);
    } else {
      setQunatity(item.quantity);
    }
  }

  const updateQuantity = (item, value) => {
    if (value === 0) {
      onPressDeleteModal(item);
    } else {
      setQunatity(value);
      setSelectQunatityId(item.id);
      setSelectUniqueId(item.uniqueId);
      onUpdateAndroidItem(item, value);
    }
  };
  const renderItem = ({ item }) => {
    let titles = "";
    let qtitles = "";
    let count = 0;
    {
      item.addons.map((res, key) => {
        count = 0;
        res.data.map((ress, keys) => {
          // console.log(statusResponse.data.length, "statusQuantity.length");
          // // console.log(ress.product, "ress");
          // if (ress.product === statusResponse.data[i].product) {
          //       console.log(statusResponse.data[i].addon[0], "datas");
          //       console.log(ress.item);
          //     }
          if (statusResponse && statusResponse.data.length > 0) {
            for (i = 0; i < parseInt(statusResponse.data.length); i++) {
              for (
                j = 0;
                j < parseInt(statusResponse.data[i].addon.length);
                j++
              ) {
                if (
                  ress.product === statusResponse.data[i].product &&
                  ress.item === statusResponse.data[i].addon[j].item
                ) {
                  qtitles = I18nManager.isRTL
                    ? ress.title_ar
                    : ress.title + (qtitles ? "\n" : "") + qtitles;
                  count = 1;
                }
              }
            }

            if (count === 0) {
              titles = I18nManager.isRTL
                ? ress.title_ar
                : ress.title + (titles ? "\n" : "") + titles;
            }
          } else {
            titles = I18nManager.isRTL
              ? ress.title_ar
              : ress.title + (titles ? "\n" : "") + titles;
          }
        });
      });
    }

    // console.log(item, "item");
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "lightgrey",
          marginTop: responsiveWidth(2),
          // marginLeft: responsiveWidth(3),
          // marginRight: responsiveWidth(3),

          borderRadius: 10,
          flex: 1,
          flexDirection: "row",
          backgroundColor: "white",
          paddingTop: responsiveWidth(2),
          paddingBottom: responsiveWidth(1),
          marginHorizontal: responsiveWidth(2),
        }}
      >
        <View style={{ padding: 5 }}>
          <FastImage
            style={{
              width: responsiveWidth(25),
              height: responsiveWidth(25),
            }}
            source={{
              uri: item.image,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 0.9, backgroundColor: Colors.white }}>
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    textAlign: "left",
                    textTransform: "capitalize",
                    paddingBottom: 5,
                  }}
                >
                  {I18nManager.isRTL ? item.title_ar : item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    textAlign: "left",
                    textTransform: "capitalize",
                  }}
                >
                  {titles}
                </Text>
                {qtitles ? (
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(1.8),
                      color: Colors.red,
                      textAlign: "left",
                      textTransform: "capitalize",
                    }}
                  >
                    {qtitles}
                  </Text>
                ) : null}
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    textAlign: "left",
                    textTransform: "capitalize",
                  }}
                >
                  {item.extradetails}
                </Text>
              </View>
              {/* <TouchableOpacity
                style={{ flex: 0.1 }}
                onPress={() => onPressDeleteModal(item)}
              >
                <Image
                  style={{
                    width: responsiveWidth(4),
                    height: responsiveWidth(4),
                    tintColor: Colors.grey,
                  }}
                  source={Images.trash}
                />
              </TouchableOpacity> */}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.6),
                    color: Colors.black,
                    textTransform: "uppercase",
                  }}
                >
                  {language["Qty"]} :{" "}
                </Text>
                {item.quantity_array &&
                  (parseInt(item.quantity_array.length) === 0 ||
                    parseInt(item.quantity_array.length) === 1) ? (
                  <Text
                    style={{
                      paddingLeft: responsiveWidth(2),
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.6),
                      color: Colors.black,
                      fontStyle: "normal",
                    }}
                  >
                    {item.id === selectQunatityId &&
                      item.uniqueId === selectUniqueId
                      ? quantity
                      : item.quantity}
                  </Text>
                ) : (
                  <View />
                )}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cart && cart.cartItems.length > 0
                  ? cart && cart.cartItems.length > 0
                    ? cart.cartItems.map((res, key) => {
                      if (res.id === item.id) {
                        return (
                          <View
                            style={{
                              // borderWidth: 1,
                              // borderColor: settings.settings.color1,
                              width: responsiveWidth(30),
                              height: "auto",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              alignItems: "center",
                              paddingHorizontal: responsiveWidth(1.5),
                              marginHorizontal: responsiveWidth(1.5),
                              backgroundColor:
                                res.quantity > 0
                                  ? Colors.white
                                  : settings.settings.color1,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                updateQuantity(item, res.quantity - 1)
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
                                fontFamily: Fonts.textbold,
                                fontSize: responsiveFontSize(2),
                                color:
                                  res.quantity > 0
                                    ? Colors.lightblack
                                    : Colors.white,
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
                                  updateQuantity(item, res.quantity + 1);
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
                {/* {item.quantity_array &&
                parseInt(item.quantity_array.length) > 1 ? (
                  <RNPickerSelect
                    fixAndroidTouchableBug={true}
                    pickerProps={{
                      accessibilityLabel:
                        item.id === selectQunatityId &&
                        item.uniqueId === selectUniqueId
                          ? quantity.toString()
                          : item.quantity.toString(),
                    }}
                    placeholder={{}}
                    placeholder={
                      Platform.OS === "android"
                        ? { label: "Select Quantity", value: "" }
                        : { label: "Select Quantity", value: "" }
                    }
                    items={item.quantity_array}
                    useNativeAndroidPickerStyle={true}
                    onValueChange={(value) => {
                      if (Platform.OS === "android") {
                        setQunatity(value);
                        setSelectQunatityId(item.id);
                        setSelectUniqueId(item.uniqueId);
                        onUpdateAndroidItem(item, value);
                      } else if (Platform.OS === "ios") {
                        setQunatity(value);
                        setSelectQunatityId(item.id);
                      }
                    }}
                    onDonePress={() => onUpdateItem(item)}
                    style={{
                      ...styles,
                      // iconContainer: {
                      //   top: responsiveWidth(1),
                      //   color: Colors.black,
                      //   alignItems: "center",
                      // },
                    }}
                    // value={
                    //   item.id === selectQunatityId ? quantity : item.quantity
                    // }
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.textbold,
                          fontSize: responsiveFontSize(2),
                          color: Colors.black,
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {item.id === selectQunatityId &&
                        item.uniqueId === selectUniqueId
                          ? quantity
                          : item.quantity}
                      </Text>

                      <Image
                        source={Images.downarrow}
                        style={{
                          width: responsiveWidth(4),
                          height: responsiveWidth(4),
                          marginHorizontal: responsiveWidth(2),
                          resizeMode: "contain",
                          tintColor: Colors.black,
                        }}
                      />
                    </TouchableOpacity>
                  </RNPickerSelect>
                ) : null} */}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: responsiveWidth(2),
              }}
            >
              <View style={{ flex: 0.5, flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.6),
                    color: Colors.black,
                    textAlign: "left",
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.6),
                    color: Colors.black,
                    textAlign: "left",
                  }}
                >
                  {(
                    parseInt(item.quantity) *
                    parseFloat(
                      country.currency.price *
                      (parseFloat(item.price) + parseFloat(item.addonPrice))
                    )
                  ).toFixed(3)}
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                {statusQuantity && statusQuantity.length >= 1
                  ? statusQuantity.map((res, key) => {
                    // console.log(res.product, "------999-----", item.id);
                    // console.log(res.product === item.id);
                    return res.product === item.id ? (
                      <View style={{ flex: 0.5 }}>
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.6),
                            color: Colors.red,
                            textTransform: "capitalize",
                            textAlign: "left",
                          }}
                        >
                          {language["Out of Stock"]}
                        </Text>
                      </View>
                    ) : null;
                  })
                  : null}
              </View>
            </View>
          </View>

          {/* <View
            style={{
              // flex: 0.5,
              backgroundColor: "yellow",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                // flex: 0.3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(1.8),
                  color: Colors.black,
              
                  textTransform: "uppercase",
                }}
              >
                {language["Qty"]} :{"  "}
              </Text>
              {item.quantity_array &&
              parseInt(item.quantity_array.length) === 0 ? (
                <Text
                  style={{
                    paddingLeft: responsiveWidth(2),
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    fontStyle: "normal",
                    fontWeight: "normal",
                  }}
                >
                  {item.id === selectQunatityId ? quantity : item.quantity}
                </Text>
              ) : (
                <View />
              )}
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 0.1,
              }}
            >
              {item.quantity_array &&
              parseInt(item.quantity_array.length) > 1 ? (
                <RNPickerSelect
                  pickerProps={{
                    accessibilityLabel:
                      item.id === selectQunatityId
                        ? quantity.toString()
                        : item.quantity.toString(),
                  }}
                  placeholder={
                    Platform.OS === "android"
                      ? { label: "SelectQuantity", value: "" }
                      : {}
                  }
                  items={item.quantity_array}
                  fixAndroidTouchableBug={true}
                  onValueChange={(value) => {
                    if (Platform.OS === "android") {
                      setQunatity(value);
                      setSelectQunatityId(item.id);
                      onUpdateItem(item);
                    } else {
                    }
                    setQunatity(value);
                    setSelectQunatityId(item.id);
                  }}
                  onDonePress={() => onUpdateItem(item)}
                  style={{
                    ...styles,
                    iconContainer: {
                      top: responsiveWidth(1),
                      color: Colors.black,
                      alignItems: "center",
                    },
                  }}
                  value={
                    item.id === selectQunatityId ? quantity : item.quantity
                  }
                  useNativeAndroidPickerStyle={false}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.textbold,
                        fontSize: responsiveFontSize(2),
                        color: Colors.black,
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {item.id === selectQunatityId ? quantity : item.quantity}
                    </Text>
                    <Image
                      source={Images.downarrow}
                      style={{
                        width: responsiveWidth(3.5),
                        height: responsiveWidth(3),
                        marginHorizontal: responsiveWidth(2),
                        resizeMode: "contain",
                        tintColor: Colors.black,
                      }}
                    />
                  </View>
                </RNPickerSelect>
              ) : null}
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: "center",
                marginHorizontal: responsiveWidth(4),
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(1.8),
                  color: Colors.black,
             
                  textAlign: "right",
                }}
              >
                {I18nManager.isRTL
                  ? country.currency.currency
                  : country.currency.currency_ar}{" "}
                {(
                  parseInt(item.quantity) *
                  parseFloat(
                    country.currency.price *
                      (parseFloat(item.price) + parseFloat(item.addonPrice))
                  )
                ).toFixed(3)}
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    );
  };

  const onPressDeleteModal = (item) => {
    setDetails(item);
    setModalVisible(true);
  };
  const onPressModal = () => {
    // console.log(user);
    var products = [];
    var checkAvailability = false;
    if (cart.cartItems) {
      setIsUpdating(true);
      cart.cartItems.map((product, i) => {
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
      // Calculate total price for all products
      const productTotalPrice = products.reduce((sum, product) => sum + parseFloat(product.total), 0).toFixed(3);

      // Extracting content_ids from the products array
      // const contentIds = products.map(product => product.product_id);
      const contentIds = products.map(product => product.product_id).join(',');

      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.InitiatedCheckout, {
          currency: 'KWD',
          value: productTotalPrice,
          content_type: 'product',
          content_ids: contentIds,
        });
      }
      // console.log(products, "products");

      Services(constants.API_BASE_URL + "checkavail", products, "POST").then(
        (response) => {
          // console.log(response);
          if (response.status === "Success") {
            // checkAvailability = true;
            setDummy(dummy + 1);
            setIsUpdating(false);

            if (user) {
              navigation.push("CheckOut");
            } else {
              navigation.push("SignInList");
            }
          } else {
            setIsUpdating(false);
            // console.log(response.data.length, "length");
            // console.log(response.data[1], "data");
            setStatusQuantity(response.data);
            setStatusResponse(response);
            setDummy(dummy + 1);
            alert("The Quantity you are selected for items is Not available");
          }
        }
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#faf7f7",
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.lightgrey,
      }}
    >
      <View
        style={{
          width: "100%",
          height: responsiveHeight(8),
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
          backgroundColor: Colors.white,
        }}
      >
        <Header
          screen="Cart"
          title={language["BAG"]}
          route={
            props.route && props.route.params
              ? props.route.params.routeFrom
              : null
          }
        />
      </View>
      {spinner ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          {cart && cart.cartItems.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1, backgroundColor: "#faf7f7" }}>
                {/* <View
                  style={{
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(1),
                    paddingHorizontal: responsiveWidth(2),
                  }}
                >
                  <Image
                    style={{
                      width: "auto",
                      height: responsiveHeight(8),
                      paddingHorizontal: responsiveWidth(2),
                    }}
                    source={Images.banner1}
                  />
                </View> */}

                <View
                  style={{
                    height: responsiveHeight(3),
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(1),
                    backgroundColor: "#faf7f7",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: responsiveWidth(5),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(1.8),
                      textTransform: "capitalize",
                      textAlign: "left",
                    }}
                  >
                    {language["items"]} ({noOfItems})
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(1.8),
                      color: Colors.grey,
                      textTransform: "capitalize",
                      textAlign: "left",
                    }}
                  >
                    {language["subtotal"]}:{"  "}
                    <Text
                      style={{
                        fontFamily: Fonts.textbold,
                        fontSize: responsiveFontSize(1.8),
                        color: Colors.black,
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                    >
                      {I18nManager.isRTL
                        ? country.currency.currency
                        : country.currency.currency_ar}{" "}
                      {parseFloat(country.currency.price * subTotal).toFixed(3)}
                    </Text>
                  </Text>
                </View>

                <FlatList
                  data={cart.cartItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  extraData={cart.cartItems.length}
                />
              </ScrollView>
              {/* <View
                style={{
                  height: "auto",
                  marginBottom: responsiveHeight(1),
                  backgroundColor: Colors.white,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: responsiveWidth(5),
                  paddingTop: responsiveWidth(1),
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                >
                  {language["subtotal"]}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {parseFloat(country.currency.price * subTotal).toFixed(3)}
                </Text>
              </View>*/}
              <TouchableOpacity
                style={{
                  // flex: 0.07,
                  // backgroundColor: settings.settings.color1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // borderRadius: 25,
                  // marginHorizontal: responsiveWidth(1),
                  // marginBottom: responsiveWidth(1),
                  height: 50,
                  backgroundColor: settings.settings.color1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveWidth(2),
                  flexDirection: "row",
                  marginHorizontal: responsiveWidth(1),
                  paddingHorizontal: responsiveWidth(2),
                  borderRadius: 5,
                  marginBottom: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: settings.settings.color1,
                }}
                onPress={() => {
                  // setModalVisible(true);
                  onPressModal();
                  // navigation.push('GuestCheckOut');
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.textfont,

                    fontSize: responsiveFontSize(2),
                  }}
                >
                  {language["Go to checkout"]}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: Colors.white,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  marginTop: responsiveWidth(10),
                  fontSize: responsiveFontSize(1.8),
                  fontFamily: Fonts.textbold,
                }}
              >
                {language["Your Cart is Empty."]}
              </Text>
            </View>
          )}
        </View>
      )}
      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ModalAlert
          title={
            language[
            "Are you sure you want to remove this product from the cart?"
            ]
          }
          header={language["BAG"]}
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setModalVisible(false)}
          onPressLeft={() => onDelete(details)}
          onPressRight={() => setModalVisible(false)}
        />
      </Modal>
      {isUpdating ? (
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
      ) : null}
    </View>
  );
}
