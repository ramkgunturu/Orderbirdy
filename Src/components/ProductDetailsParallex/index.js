import React, { useEffect, useState, useRef, useContext } from "react";
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
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  I18nManager,
  Share,
  Platform,
  Animated,
  TextInput,
  SectionList,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Images, Fonts, Colors } from "../../Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import { Header, ModalAlert } from "@components";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AutoHeightImage from "react-native-auto-height-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "@context/lang-context";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import Services from "@Services";
import constants from "@constants";
import Skeleton from "./Skeleton";
import styles from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import { actions as whishListActions } from "./../../redux/whishlist";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SwipeablePanel } from "rn-swipeable-panel";
import RNPickerSelect from "react-native-picker-select";
import { Badge } from "react-native-elements";
import { SettingsContext } from "@context/settings-context";
import { TouchableHighlight } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { CountryContext } from "@context/country-context";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import ImageViewer from "react-native-image-zoom-viewer";
import { Keyboard } from "react-native";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const { height, width } = Dimensions.get("screen");
const window = Dimensions.get("window");
const regex = /(<([^>]+)>)/gi;

var selectedArray = [];
var pickerSelectedArray = [];
var title = "";
var tempCount = "";

export default function ProductDetails(props) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigation = useNavigation();
  const wishlistData = useSelector((state) => state.whishlist);
  const [wishlist, setWishlist] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [productDetails, setProductDetails] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [colors, setColors] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [images, setImages] = useState(null);
  const [quantitys, setQunatitys] = useState(1);
  const carouselRef = useRef(null);
  const [colorSelect, setColorSelect] = useState(null);
  const [sizeSelect, setSizeSelect] = useState(0);
  const [productIds, setProductIds] = useState(null);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [selectData, setSelectData] = useState([]);
  const [pickerSelectData, setPickerSelectData] = useState([]);
  const [selectItemId, setSelectItemId] = useState(null);
  const [selectItemTitle, setSelectItemTitle] = useState(null);
  const { country, setCountry } = useContext(CountryContext);
  const [selectAddonsPrice, setSelectAddonsPrice] = useState(0);
  const [selectAddonsPricePicker, setSelectAddonsPricePicker] = useState(0);
  const [textheight, setTextHeight] = useState(45);
  const [extraDetails, setExtraDetails] = useState(null);
  const [heights, setHeights] = useState(window.width / 6.857142857);
  const [alertMessage, setAlertMessage] = useState(false);
  const [dummy, setDummy] = useState(0);
  const [headerParallex, setHeaderParallex] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagesUrls, setImagesUrls] = useState(null);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [detailsAddonsArray, setDetailsAddonsArray] = useState([]);
  const [itemIndex, setItemIndex] = useState("");
  const trackingStatus = useContext(TrackingPermissionContext);
  const AVATAR_SIZE = 120;
  const ROW_HEIGHT = 60;
  const PARALLAX_HEADER_HEIGHT = 400;
  const STICKY_HEADER_HEIGHT = 70;

  useEffect(() => {
    // console.log("-------------hiiiiii--------------")
    let productId = "";
    pickerSelectedArray = [];
    selectedArray = [];

    productId = props.details;
    setProductIds(productId);
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Product Details Screen");
      AppEventsLogger.logEvent(AppEventsLogger.AppEvents.ViewedContent, {
        content_type: 'product',
        content_ids: productId,
      });
    }
    fetchData(productId);
  }, []);

  function fetchData(productId) {
    // console.log(constants.API_BASE_URL + "product/" + productId);
    Services(constants.API_BASE_URL + "product/" + productId).then(
      (response) => {
        if (response) {
          if (response && response.addons) {
            response.addons.map((res, key) => {
              res.data = res.items;
              delete res.items;
            });
          }
          setProductDetails(response);

          setImages(response.images);
          // onWishlistStatus(productId);
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      }
    );
  }
  function onWishlistStatus(productId) {
    if (wishlistData.whishlistItems && wishlistData.whishlistItems.length > 0) {
      wishlistData.whishlistItems.filter((item) => {
        if (item.id === productId) {
          setWishlist(true);
        }
      });
    } else {
      setWishlist(false);
    }
  }
  function onWhishlist() {
    // console.log(productDetails, "productDetails");
    if (wishlist) {
      setWishlist(false);
      productDetails.product.wishlist = false;
      whishListActions.removeFromWhishlist(dispatch, productDetails.product);
    } else {
      setWishlist(true);
      productDetails.product.wishlist = true;
      whishListActions.addToWhishlist(dispatch, productDetails.product);
    }
  }
  function onSetUrls() {
    setImagesUrls(productDetails.zoom_images);
    setModalVisible(true);
  }

  const onAddToCart = () => {
    let addonsarray = [];
    let minimumAlert = false;
    let alreadyExist = false;
    let mainAddonCount = 0;
    let selectedAddonCount = 0;
    let index = "";
    addonsarray = pickerSelectData.concat(selectData);
    setDummy(dummy + 1);
    if (productDetails && productDetails.addons.length > 0) {
      if (addonsarray.length === 0) {
        minimumAlert = true;
        let alertmessage = language["Please select all minimum addons"];
        alert(alertmessage);
      } else {
        productDetails.addons.map((res, i) => {
          if (parseInt(res.minimum) != 0) {
            mainAddonCount = mainAddonCount + 1;
          }
        });
        addonsarray.map((checkSelected, i) => {
          if (parseInt(checkSelected.minimum) != 0) {
            selectedAddonCount = selectedAddonCount + 1;
          }
        });
        if (mainAddonCount === selectedAddonCount) {
          productDetails.addons.map((res, i) => {
            if (parseInt(res.minimum) != 0) {
              addonsarray.map((checkSelected, i) => {
                if (parseInt(checkSelected.minimum) != 0) {
                  if (
                    parseInt(res.id) === parseInt(checkSelected.titileId) &&
                    parseInt(res.minimum) > checkSelected.data.length &&
                    title === ""
                  ) {
                    title = I18nManager.isRTL ? res.title_ar : res.title;
                  } else if (
                    title === checkSelected.title &&
                    parseInt(res.id) === parseInt(checkSelected.titileId) &&
                    parseInt(res.minimum) <= checkSelected.data.length
                  ) {
                    title = "";
                  }
                }
              });
            }
          });
        }
      }
      if (mainAddonCount != selectedAddonCount || alertMessage) {
        let alertmessage = language["Please select all minimum addons"];
        alert(alertmessage);
        minimumAlert = true;
      } else if (title != "") {
        let alertmessage = language["Please select minimum add-ons of"] + title;
        alert(alertmessage);
        minimumAlert = true;
      }
    }

    cart.cartItems.map((res, key) => {
      if (parseInt(res.id) === parseInt(productDetails.product.id)) {
        alreadyExist = true;
        index = cart.cartItems.indexOf(res);
      }
    });
    if (alreadyExist && minimumAlert === false) {
      setDetailsAddonsArray(addonsarray);
      setItemIndex(index);
      setModalVisibles(true);
    } else if (minimumAlert === false && alreadyExist === false) {
      onAddToCartItem(addonsarray, index);
    }
    // if (minimumAlert === false && alreadyExist === false) {
    //   var addonTotal = 0;
    //   addonsarray.map((result, key) => {
    //     result.data.map((addOn, i) => {
    //       addonTotal += parseFloat(addOn.price);
    //     });
    //   });

    //   if (addonsarray) {
    //     var cartDetailsData = {
    //       id: productDetails.product.id,
    //       // item_code: productDetails.product.item_code,
    //       title: productDetails.product.title,
    //       title_ar: productDetails.product.title_ar,
    //       order_quantity: productDetails.product.order_quantity,
    //       price: productDetails.product.price,
    //       quantity: quantitys,
    //       available_quantity:
    //         productDetails.product.quantity_check === "0"
    //           ? 100
    //           : productDetails.product.quantity,
    //       total_price:
    //         parseInt(quantitys) *
    //         (parseFloat(productDetails.product.price) + parseFloat(addonTotal)),
    //       image: productDetails.product.image,
    //       category: productDetails.product.category,
    //       uniqueId: "_" + Math.random().toString(36).substr(2, 9),
    //       weight: productDetails.product.weight,
    //       addons: addonsarray,
    //       addonPrice: addonTotal ? addonTotal : "0",
    //       extradetails: extraDetails ? extraDetails : "",
    //     };
    //     // console.log(cartDetailsData);
    //     cartActions.addToCart(dispatch, cartDetailsData);
    //     // cartActions.emptyCart(dispatch, null);
    //     props.onClose();
    //   }
    // }
  };
  function onItemReplace(arrayaddons, index) {
    setModalVisibles(false);
    onAddToCartItem(arrayaddons, index);
  }

  function onAddToCartItem(addonsarray, index) {
    var addonTotal = 0;
    addonsarray.map((result, key) => {
      result.data.map((addOn, i) => {
        addonTotal += parseFloat(addOn.price);
      });
    });

    if (addonsarray) {
      var cartDetailsData = {
        id: productDetails.product.id,
        // item_code: productDetails.product.item_code,
        title: productDetails.product.title,
        title_ar: productDetails.product.title_ar,
        order_quantity: productDetails.product.order_quantity
          ? productDetails.product.order_quantity
          : "0",
        price: productDetails.product.price,
        quantity: quantitys,
        available_quantity:
          parseInt(productDetails.product.quantity_check) === 0
            ? 100
            : productDetails.product.quantity,
        total_price:
          parseInt(quantitys) *
          (parseFloat(productDetails.product.price) + parseFloat(addonTotal)),
        image: productDetails.product.image,
        category: productDetails.product.category,
        uniqueId: "_" + Math.random().toString(36).substr(2, 9),
        weight: productDetails.product?.weight,
        addons: addonsarray,
        addonPrice: addonTotal ? addonTotal : "0",
        extradetails: extraDetails ? extraDetails : "",
      };
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: cartDetailsData.id,
          currency: 'KWD',
          value: cartDetailsData.price,
        });
      }
      if (index === "") {
        cartActions.addToCart(dispatch, cartDetailsData);
      } else {
        if (index !== "" && parseInt(productDetails.addons.length) > 0) {
          cartActions.alreadyExistCartItem(dispatch, cartDetailsData);
        } else if (
          index !== "" &&
          parseInt(productDetails.addons.length) === 0
        ) {
          // cart.cartItems.push(cartDetailsData);
          cart.cartItems.splice(index, 1, cartDetailsData);

          cartActions.replaceCartItem(dispatch, cart.cartItems);
        }
      }

      // cartActions.emptyCart(dispatch, null);

      props.onClose();
    }
  }

  function onItemSelected(item, section) {
    let count = 0;
    let errormessage = language["you can select"];
    let errormessage1 = language["items only"];
    if (selectedArray.length === 0) {
      selectedArray.push({
        title: section.title,
        title_ar: section.title_ar,
        titileId: section.id,
        product: section.product,
        minimum: section.minimum,
        maximum: section.maximum,
        data: [
          {
            productId: item.id,
            title: item.title,
            product: item.product,
            addon: item.addon,
            item: item.item,
            price: item.price,
            now: item.now,
            title_ar: item.title_ar,
          },
        ],
      });
    } else {
      let subDataCount = 0;
      selectedArray.map((res, i) => {
        if (res.titileId === section.id) {
          res.data.map((subData, k) => {
            if (subData.productId === item.id) {
              res.data.splice(k, 1);
              //console.log('dhpoerioroiro', res.data);
              subDataCount++;
              count++;
            }
          });
          if (res.data.length <= 0) {
            selectedArray.splice(i, 1);
            // alert(selectedArray.length);
          }
          if (subDataCount === 0) {
            // console.log("OKOK");
            let displayTitle = I18nManager.isRTL
              ? section.title_ar
              : section.title;
            if (res.data.length === parseInt(section.maximum)) {
              Alert.alert(
                errormessage +
                " " +
                section.maximum +
                " " +
                errormessage1 +
                " " +
                displayTitle,
                "",
                [
                  {
                    text: language["OK"],
                    onPress: () => {
                      // console.log("OK Pressed"),
                    },
                  },
                ]
              );
              count++;
            } else {
              res.data.push({
                productId: item.id,
                title: item.title,
                product: item.product,
                addon: item.addon,
                item: item.item,
                price: item.price,
                now: item.now,
                title_ar: item.title_ar,
              });
              count++;
            }
          }
        }
      });
      if (count === 0) {
        selectedArray.push({
          title: section.title,
          title_ar: section.title_ar,
          titileId: section.id,
          product: section.product,
          minimum: section.minimum,
          maximum: section.maximum,
          data: [
            {
              productId: item.id,
              title: item.title,
              product: item.product,
              addon: item.addon,
              item: item.item,
              price: item.price,
              now: item.now,
              title_ar: item.title_ar,
            },
          ],
        });
      }
    }
    setSelectData(selectedArray);

    var tempTotalPrice = 0;
    selectedArray.map((res, key) => {
      var tempAddonsPrice = 0;

      res.data.map((subRes, i) => {
        tempAddonsPrice += parseFloat(subRes.price);
        // console.log(tempAddonsPrice, "------");
      });
      tempTotalPrice += parseFloat(tempAddonsPrice);
    });
    // console.log(tempTotalPrice, "tempTotalPrice");
    setSelectAddonsPrice(tempTotalPrice);
    setDummy(dummy + 1);
  }

  const onPressCart = () => {
    props.onClose();
    navigation.push("Cart", { routeFrom: "ProductDetails" });
  };
  const updateSize = (height) => {
    setTextHeight(height);
  };

  const ShareProductDetails = async (uri) => {
    // console.log(uri);
    try {
      const result = await Share.share({
        title: I18nManager.isRTL
          ? productDetails.product.title_ar
          : productDetails.product.title,
        // message: Platform.OS === "android" ? uri : I18nManager.isRTL
        //     ? productDetails.product.title_ar
        //     : productDetails.product.title,
        message: I18nManager.isRTL
          ? productDetails.product.title_ar
          : productDetails.product.title,
        url: uri,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: Colors.white,
      }}
    >
      <StatusBar barStyle="default" />

      {spinner ? (
        <View style={{ flex: 1 }}>
          <Skeleton />
        </View>
      ) : productDetails ? (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ParallaxScrollView
              stickyHeaderHeight={70}
              backgroundColor="white"
              contentBackgroundColor="white"
              onScrollBeginDrag={() => {
                Keyboard.dismiss();
              }}
              parallaxHeaderHeight={400}
              onChangeHeaderVisibility={(value) => setHeaderParallex(value)}
              renderBackground={() => (
                <View key="background">
                  <Image
                    source={{
                      uri: productDetails.product.image,
                      width: window.width,
                      height: PARALLAX_HEADER_HEIGHT,
                    }}
                  />

                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      width: window.width,
                      // backgroundColor: "rgba(0,0,0,.4)",
                      height: PARALLAX_HEADER_HEIGHT,
                      backgroundColor: !headerParallex
                        ? "white"
                        : "transparent",
                    }}
                  />

                  <View></View>
                </View>
              )}
              renderForeground={() => (
                <TouchableOpacity
                  key="parallax-header"
                  style={styles.parallaxHeader}
                  onPress={() =>
                    productDetails.zoom_images.length >= 1 ? onSetUrls() : null
                  }
                ></TouchableOpacity>
              )}
              renderStickyHeader={() => (
                <View
                  key="sticky-header"
                  style={{
                    height: 70,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: responsiveWidth(2),
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(2),
                      color: Colors.black,
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    {I18nManager.isRTL
                      ? productDetails.product.title_ar
                      : productDetails.product.title}
                  </Text>
                </View>
              )}
              renderFixedHeader={() => (
                <View key="fixed-header" style={{ bottom: 45, left: 10 }}>
                  {!headerParallex ? (
                    <TouchableOpacity onPress={() => props.onClose()}>
                      {I18nManager.isRTL ? (
                        <Image
                          style={{
                            width: 30,
                            height: 20,
                            tintColor: "black",
                          }}
                          source={Images.backarrow}
                        />
                      ) : (
                        <Image
                          style={{
                            width: 30,
                            height: 20,
                            tintColor: "black",
                          }}
                          source={Images.frontarrow}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        top: responsiveWidth(0),
                        left: responsiveWidth(5),
                        right: responsiveWidth(5),
                        bottom: 0,
                        height: responsiveWidth(15),
                        // backgroundColor: "#0e0e0e4f",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: responsiveWidth(10),
                          height: responsiveWidth(10),
                          borderRadius: responsiveWidth(10) / 2,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: responsiveWidth(2),
                        }}
                        onPress={() => props.onClose()}
                      >
                        <Image
                          style={{
                            width: responsiveWidth(6),
                            height: responsiveWidth(6),
                            tintColor: "black",
                          }}
                          source={Images.downarrow}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={{
                          width: responsiveWidth(10),
                          height: responsiveWidth(10),
                          borderRadius: responsiveWidth(10) / 2,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: responsiveWidth(2),
                        }}
                        onPress={() => onPressCart()}
                      >
                        <Image
                          style={{
                            width: responsiveWidth(5),
                            height: responsiveWidth(5),
                            tintColor: "black",
                          }}
                          source={Images.bag}
                          resizeMode="contain"
                        />
                        {cart && cart.cartItems.length > 0 ? (
                          <Badge
                            value={cart.cartItems.length}
                            status="error"
                            containerStyle={{
                              position: "absolute",
                              top: -responsiveWidth(
                                cart.cartItems.length >= 20 ? 2 : 1
                              ),
                              right: -responsiveWidth(
                                cart.cartItems.length >= 20 ? 7 : 5
                              ),
                              left: responsiveWidth(0),
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            badgeStyle={{
                              width: responsiveWidth(
                                cart.cartItems.length >= 20 ? 7 : 5
                              ),
                              height: responsiveWidth(
                                cart.cartItems.length >= 20 ? 7 : 5
                              ),
                              borderRadius:
                                responsiveWidth(
                                  cart.cartItems.length >= 20 ? 7 : 5
                                ) / 2,
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: responsiveWidth(10),
                          height: responsiveWidth(10),
                          borderRadius: responsiveWidth(10) / 2,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          ShareProductDetails(
                            productDetails.product.share_link
                          );
                        }}
                      >
                        <Image
                          style={{
                            width: responsiveWidth(5),
                            height: responsiveWidth(5),
                            tintColor: "black",
                          }}
                          source={Images.share}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  marginBottom: responsiveHeight(35),
                }}
              >
                {/* <TouchableOpacity
                  style={{ margin: responsiveWidth(2) }}
                  onPress={() => onSetUrls()}
                >
                  <Image
                    source={{ uri: productDetails.product.image }}
                    style={{
                      width: responsiveWidth(22),
                      height: responsiveWidth(22),
                      borderRadius: responsiveWidth(22) / 2,
                      // resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity> */}
                <View
                  style={{
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(3.5),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // borderBottomWidth: 1,
                    // borderBottomColor: Colors.lightgrey,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: responsiveWidth(2),
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(2),

                      color: Colors.black,
                      textTransform: "uppercase",
                    }}
                  >
                    {I18nManager.isRTL
                      ? productDetails.product.title_ar
                      : productDetails.product.title}
                  </Text>

                  {/* <Text
                  style={{
                    marginRight: responsiveWidth(2),
                    fontFamily: Fonts.textmedium,
                    fontSize: responsiveFontSize(1.8),
                    color: settings.settings.color1,
                    marginBottom: responsiveWidth(0.25),
                    fontStyle: "normal",
                    paddingTop: 2,
                    fontWeight: "normal",
               
                  }}
                >
                  {I18nManager.isRTL
                    ? country.currency.currency
                    : country.currency.currency_ar}{" "}
                  {(
                    parseFloat(
                      country.currency.price * productDetails.product.price
                    ) * parseInt(quantitys)
                  ).toFixed(3)}
                </Text> */}
                </View>

                {productDetails &&
                  (productDetails.product.description_ar ||
                    productDetails.product.description) ? (
                  <View
                    style={{
                      flex: 1,
                      marginTop: responsiveWidth(2),
                      backgroundColor: "white",
                    }}
                  >
                    <Text
                      style={{
                        marginHorizontal: responsiveWidth(3),
                        marginBottom: responsiveWidth(2),
                        fontFamily: Fonts.textfont,
                        fontSize: responsiveFontSize(2),
                        color: Colors.grey,
                        fontStyle: "normal",
                        textAlign: "left",
                        lineHeight: 25,
                      }}
                    >
                      {I18nManager.isRTL
                        ? productDetails.product.description_ar.replace(
                          regex,
                          ""
                        )
                        : productDetails.product.description.replace(regex, "")}
                    </Text>
                  </View>
                ) : null}

                <View
                  style={{
                    marginTop: responsiveWidth(2),
                    marginBottom: responsiveWidth(3.5),
                    flexDirection: "row",
                    marginHorizontal: responsiveWidth(3),
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        quantitys === 1
                          ? setQunatitys(1)
                          : setQunatitys(quantitys - 1);
                      }}
                    >
                      <Image
                        style={{
                          width: responsiveWidth(6),
                          height: responsiveWidth(6),

                          tintColor:
                            quantitys === 1
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
                        color: Colors.lightblack,
                        fontStyle: "normal",
                        textAlign: "left",
                        lineHeight: 25,
                      }}
                    >
                      {quantitys}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          parseInt(productDetails.product.quantity) <
                          parseInt(quantitys) + 1 &&
                          parseInt(productDetails.product.quantity_check) ===
                          1 &&
                          parseInt(productDetails.product.quantity) != 0
                        ) {
                          let errormessage =
                            language["Maximum quantity available is"] +
                            " " +
                            productDetails.product.quantity;
                          alert(errormessage);
                        } else {
                          setQunatitys(quantitys + 1);
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

                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.textfont,
                        fontSize: responsiveFontSize(2),
                        color: Colors.lightblack,
                        textTransform: "uppercase",
                        textAlign: "left",
                        marginHorizontal: responsiveWidth(1),
                      }}
                    >
                      {I18nManager.isRTL
                        ? country.currency.currency
                        : country.currency.currency_ar}
                    </Text>

                    <Text
                      style={{
                        fontFamily: Fonts.textfont,
                        fontSize: responsiveFontSize(2),
                        color: Colors.lightblack,
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                    >
                      {(
                        parseFloat(
                          country.currency.price *
                          (parseFloat(productDetails.product.price) +
                            parseFloat(selectAddonsPrice) +
                            parseFloat(selectAddonsPricePicker))
                        ) * parseInt(quantitys)
                      ).toFixed(3)}
                    </Text>
                  </View>
                </View>
                {/* <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    fontStyle: "normal",
                    textAlign: "left",

                    marginLeft: responsiveWidth(2),
                    paddingVertical: responsiveWidth(3),
                  }}
                >
                  {language["Extra Details"]}
                </Text>

                <TextInput
                  placeholder={language["Extra Details"]}
                  placeholderTextColor={"#a9a9a9"}
                  multiline={true}
                  value={extraDetails}
                  onChangeText={(text) => {
                    setExtraDetails(text);
                  }}
                  style={{
                    // fontSize: responsiveFontSize(1.8),
                    color: "#000",
                    // fontFamily: Fonts.textfont,
                    // height: textheight,
                    fontFamily: Fonts.textfont,
                    paddingHorizontal: 10,
                    backgroundColor: "#FFF",
                    height:
                      textheight > Math.max(35, heights)
                        ? textheight
                        : Math.max(35, heights),
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    margin: responsiveWidth(3),
                    borderRadius: 10,
                  }}
                  onContentSizeChange={(e) =>
                    updateSize(e.nativeEvent.contentSize.height)
                  }
                /> */}
                {dummy >= 0 ? (
                  productDetails && productDetails.addons.length > 0 ? (
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={productDetails.addons}
                        renderItem={({ item }) => {
                          let section = item;
                          return (
                            <View
                              style={{
                                flex: 1,
                                marginHorizontal: responsiveWidth(1),
                              }}
                            >
                              <View style={{ flex: 1 }}>
                                <View
                                  style={{
                                    height: 60,
                                    backgroundColor: "white",
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    borderWidth: 1,
                                    borderColor: "lightgrey",
                                    marginVertical: responsiveWidth(4),
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.textmedium,
                                      fontSize: responsiveFontSize(1.8),
                                      color: Colors.lightblack,
                                      margin: responsiveWidth(0.25),
                                      fontStyle: "normal",
                                      paddingTop: 2,
                                      fontWeight: "normal",
                                    }}
                                  >
                                    {I18nManager.isRTL
                                      ? item.title_ar
                                      : item.title}
                                    ({language["Min"]}:{item.minimum}-
                                    {language["Max"]}:{item.maximum})
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.textmedium,
                                      fontSize: responsiveFontSize(1.8),
                                      color: Colors.lightblack,
                                      margin: responsiveWidth(0.25),
                                      fontStyle: "normal",
                                      paddingTop: 2,
                                      fontWeight: "normal",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {language["REQUIRED"]}
                                  </Text>
                                </View>

                                <FlatList
                                  data={item.data}
                                  horizontal={false}
                                  numColumns={2}
                                  contentContainerStyle={{ flex: 1 }}
                                  style={{ marginTop: 10 }}
                                  renderItem={({ item: innerData, index }) => {
                                    // console.log(selectData, "selectData");
                                    let selected;
                                    const images = [];
                                    let count = 0;
                                    if (selectData.length > 0) {
                                      selectData.map((res, j) => {
                                        if (res.titileId === section.id) {
                                          res.data.map((subData, i) => {
                                            if (
                                              subData.productId === innerData.id
                                            ) {
                                              selected = "true";
                                              count += 1;
                                            }
                                            if (count === 0) {
                                              selected = "";
                                            }
                                          });
                                        }
                                      });
                                      if (selected === "true") {
                                        images.push(
                                          <Image
                                            source={Images.checkbox}
                                            style={[
                                              styles.checkBoxImage,
                                              {
                                                tintColor:
                                                  settings.settings.color1,
                                              },
                                            ]}
                                          />
                                        );
                                      } else {
                                        images.push(
                                          <Image
                                            source={Images.blankcheckbox}
                                            style={[
                                              styles.checkBoxImage,
                                              {
                                                tintColor: Colors.lightgrey,
                                              },
                                            ]}
                                          />
                                        );
                                      }
                                    } else {
                                      images.push(
                                        <Image
                                          source={Images.blankcheckbox}
                                          style={[
                                            styles.checkBoxImage,
                                            { tintColor: Colors.lightgrey },
                                          ]}
                                        />
                                      );
                                    }

                                    return (
                                      <TouchableOpacity
                                        style={{
                                          flex: 0.5,
                                          backgroundColor: "#FFFFFF",
                                          paddingLeft: 5,
                                          paddingRight: 5,
                                        }}
                                        onPress={() => {
                                          onItemSelected(innerData, section);
                                          setDummy(dummy + 1);
                                        }}
                                      >
                                        {/* <TouchableOpacity
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          alignItems: "center",
                                        }}
                                      > */}
                                        <View
                                          style={{
                                            marginTop: responsiveWidth(3),
                                            flex: 1,
                                            width: "100%",
                                            borderRadius: 10,
                                            elevation: 1,
                                            shadowColor: "#0000002B",
                                            shadowRadius: 2,
                                            shadowOffset: {
                                              width: 0,
                                              height: 2,
                                            },
                                            shadowOpacity: 1.0,
                                            backgroundColor: "#FFFFFF",
                                          }}
                                        >
                                          <Image
                                            style={{
                                              // width: "100%",
                                              // height: "100%",
                                              width: responsiveWidth(47.8),
                                              height: responsiveWidth(49),
                                              borderRadius: 10,
                                              // resizeMode: "contain",
                                            }}
                                            source={{
                                              uri: innerData.image,
                                            }}
                                          />
                                        </View>
                                        {/* </TouchableOpacity> */}
                                        <TouchableOpacity
                                          onPress={() => {
                                            onItemSelected(innerData, section);
                                            setDummy(dummy + 1);
                                          }}
                                        >
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              justifyContent: "center",
                                              // backgroundColor: "yellow",
                                            }}
                                          >
                                            <View
                                              style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingTop: 10,
                                              }}
                                            >
                                              {images}
                                              <Text
                                                style={{
                                                  fontSize: 15,
                                                  fontFamily: Fonts.textfont,
                                                  color: "black",
                                                  textAlign: "left",
                                                  paddingTop: 10,
                                                }}
                                                numberOfLines={1}
                                              >
                                                {I18nManager.isRTL
                                                  ? innerData.title_ar
                                                  : innerData.title}
                                              </Text>
                                              <Text
                                                style={{
                                                  fontSize: 15,
                                                  fontFamily: Fonts.textbold,
                                                  color: Colors.lightblack,
                                                  textAlign: "left",
                                                  paddingTop: 5,
                                                }}
                                                numberOfLines={1}
                                              >
                                                {I18nManager.isRTL
                                                  ? country.currency.currency
                                                  : country.currency
                                                    .currency_ar}{" "}
                                                {parseFloat(
                                                  innerData.price
                                                ).toFixed(3)}
                                              </Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </TouchableOpacity>
                                    );
                                  }}
                                />
                              </View>
                            </View>
                          );
                        }}
                      />
                    </View>
                  ) : null
                ) : null}

                <Text
                  style={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    fontStyle: "normal",
                    textAlign: "left",

                    marginLeft: responsiveWidth(2),
                    paddingVertical: responsiveWidth(3),
                  }}
                >
                  {language["Extra Details"]}
                </Text>

                <TextInput
                  placeholder={language["Extra Details"]}
                  placeholderTextColor={"#a9a9a9"}
                  multiline={true}
                  value={extraDetails}
                  returnKeyType="default"
                  onChangeText={(text) => {
                    setExtraDetails(text);
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  style={{
                    // fontSize: responsiveFontSize(1.8),
                    color: "#000",
                    // fontFamily: Fonts.textfont,
                    // height: textheight,
                    fontFamily: Fonts.textfont,
                    paddingHorizontal: 10,
                    backgroundColor: "#FFF",
                    height:
                      textheight > Math.max(35, heights)
                        ? textheight
                        : Math.max(35, heights),
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    margin: responsiveWidth(3),
                    borderRadius: 10,
                    textAlign: I18nManager.isRTL ? "right" : "left",
                  }}
                  onContentSizeChange={(e) =>
                    updateSize(e.nativeEvent.contentSize.height)
                  }
                />
              </View>
            </ParallaxScrollView>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={{ flex: 1, backgroundColor: "black" }}>
              <ImageViewer
                loadingRender={() => <ActivityIndicator color="white" />}
                imageUrls={imagesUrls}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: responsiveWidth(20),
                  left: responsiveWidth(80),
                }}
                onPress={() => {
                  setModalVisible(false);
                  setImagesUrls(null);
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "left",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  {language["Done"]}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity
            style={{
              height: 50,
              // backgroundColor: settings.settings.color1,
              borderWidth: 1,
              borderColor: settings.settings.color1,
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: responsiveWidth(2),
              flexDirection: "row",
              marginHorizontal: responsiveWidth(1),
              paddingHorizontal: responsiveWidth(2),
              borderRadius: 5,
              marginBottom: responsiveWidth(2),
            }}
            onPress={() => {
              parseInt(productDetails.product.quantity) === 0 &&
                parseInt(productDetails.product.quantity_check) === 1
                ? ""
                : parseInt(settings.settings.cur_status) === 1
                  ? onAddToCart()
                  : "";
            }}
          >
            {/* <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
          
                color: Colors.white,
                textTransform: "uppercase",
              }}
            >
              {I18nManager.isRTL
                ? country.currency.currency
                : country.currency.currency_ar}{" "}
              {(
                parseFloat(
                  country.currency.price *
                    (parseFloat(productDetails.product.price) +
                      parseFloat(selectAddonsPrice) +
                      parseFloat(selectAddonsPricePicker))
                ) * parseInt(quantitys)
              ).toFixed(3)}
            </Text> */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(2),

                  color: settings.settings.color1,
                  textTransform: "uppercase",
                  textAlign: "left",
                  marginHorizontal: responsiveWidth(1),
                }}
              >
                {I18nManager.isRTL
                  ? country.currency.currency
                  : country.currency.currency_ar}
              </Text>

              <Text
                style={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(2),

                  color: settings.settings.color1,
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                {(
                  parseFloat(
                    country.currency.price *
                    (parseFloat(productDetails.product.price) +
                      parseFloat(selectAddonsPrice) +
                      parseFloat(selectAddonsPricePicker))
                  ) * parseInt(quantitys)
                ).toFixed(3)}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),

                color: settings.settings.color1,
                textTransform: "capitalize",
                textAlign: "left",
              }}
            >
              {parseInt(productDetails.product.quantity) === 0 &&
                parseInt(productDetails.product.quantity_check) === 1
                ? language["Out of Stock"]
                : parseInt(settings.settings.cur_status) === 1
                  ? language["add to basket"]
                  : language["Shop is busy"]}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.black,
            textTransform: "capitalize",
            textAlign: "center",
          }}
        >
          {language["No Data"]}
        </Text>
      )}
      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={modalVisibles}
        onRequestClose={() => {
          setModalVisibles(false);
        }}
      >
        <ModalAlert
          title={
            language[
            "Are you sure you want to add the same product name which is in the cart?"
            ]
          }
          header={language["Product"]}
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setModalVisibles(false)}
          onPressLeft={() => {
            onItemReplace(detailsAddonsArray, itemIndex);
          }}
          onPressRight={() => setModalVisibles(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
