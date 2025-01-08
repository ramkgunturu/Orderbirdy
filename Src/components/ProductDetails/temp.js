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
} from "react-native";
import { Images, Fonts, Colors } from "../../Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import { Header } from "@components";
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
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

// const { height, width } = Dimensions.get("screen");
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
  const [height, setHeight] = useState(window.width / 6.857142857);
  const [alertMessage, setAlertMessage] = useState(false);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    // console.log(cart.cartItems);
    let productId = "";
    pickerSelectedArray = [];
    selectedArray = [];
    if (props.details && props.details.banner === "product") {
      productId = props.details.link_type_id;
    } else {
      productId = props.details.id;
      setProductIds(productId);
    }
    fetchData(productId);
  }, []);

  function fetchData(productId) {
    console.log(constants.API_BASE_URL + "product/" + productId);
    Services(constants.API_BASE_URL + "product/" + productId).then(
      (response) => {
        if (response) {
          if (response && response.addons) {
            response.addons.map((res, key) => {
              res.items.map((ress, keys) => {
                ress.label = I18nManager.isRTL ? ress.title_ar : ress.title;
                ress.value = ress.id;
              });
            });
            setProductDetails(response);
          }
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
  const onAddToCart = () => {
    let addonsarray = [];
    let minimumAlert = false;
    let mainAddonCount = 0;
    let selectedAddonCount = 0;
    addonsarray = pickerSelectData.concat(selectData);
    setDummy(dummy + 1);
    if (productDetails && productDetails.addons.length > 0) {
      if (addonsarray.length === 0) {
        minimumAlert = true;
        alert("Please select all minimum addons");
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
                    title = res.title;
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
        alert("Please select all minimum addons");
        minimumAlert = true;
      } else if (title != "") {
        alert("Please select minimum addons of " + title);
        minimumAlert = true;
      }
    }

    if (minimumAlert === false) {
      var addonTotal = 0;
      addonsarray.map((result, key) => {
        result.data.map((addOn, i) => {
          addonTotal += parseFloat(addOn.price);
        });
      });

      if (addonsarray) {
        var cartDetailsData = {
          id: productDetails.product.id,
          item_code: productDetails.product.item_code,
          title: productDetails.product.title,
          title_ar: productDetails.product.title_ar,
          order_quantity: productDetails.product.order_quantity,
          price: productDetails.product.price,
          quantity: quantitys,
          available_quantity: productDetails.product.quantity,
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
        // console.log(cartDetailsData);
        cartActions.addToCart(dispatch, cartDetailsData);
        // cartActions.emptyCart(dispatch, null);
        props.onClose();
      }
    }
  };

  function pagination() {
    return (
      <Pagination
        dotsLength={productDetails.images.length}
        activeDotIndex={activeSlide}
        carouselRef={carouselRef}
        // containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          // marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          justifyContent: "center",
          alignItems: "center",
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
          backgroundColor: "black",
        }}
        inactiveDotOpacity={0.8}
        inactiveDotScale={0.6}
      />
    );
  }
  const _carouselCardItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.container} key={index}>
        <ImageBackground
          source={{ uri: item }}
          style={styles.image}
          resizeMode="contain"
        ></ImageBackground>
      </View>
    );
  };

  const renderCheckBox = (item, section, index) => {
    let selected;
    const images = [];
    let count = 0;

    if (selectData.length > 0) {
      selectData.map((res, j) => {
        res.data.map((subData, i) => {
          if (subData.productId === item.id) {
            selected = "true";
            count += 1;
          }
          if (count === 0) {
            selected = "";
          }
        });
      });
      if (selected === "true") {
        images.push(
          <Image
            source={Images.checkbox}
            style={[
              styles.checkBoxImage,
              { tintColor: settings.settings.color1 },
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
          style={[styles.checkBoxImage, { tintColor: Colors.lightgrey }]}
        />
      );
    }
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          paddingTop: 5,
          borderTopWidth: index === 0 ? 0 : 1,
          borderTopColor: Colors.lightgrey,
        }}
        onPress={() => {
          onItemSelected(item, section);
          setDummy(dummy + 1);
        }}
      >
        <View
          style={{
            flex: 0.1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images}
        </View>
        <View
          style={{
            flex: 0.65,
            // alignItems: 'center',
            // justifyContent: 'center',
            margin: 10,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.title}</Text>
        </View>
        <View
          style={{
            flex: 0.25,
            marginTop: 10,
            // borderWidth: 1,
            // borderColor: "lightgrey",
            justifyContent: "center",
            alignItems: "center",
            height: 20,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            {/* {item.price} KD */}
            {(parseFloat(country.currency.price) * item.price).toFixed(3)}{" "}
            {I18nManager.isRTL
              ? country.currency.currency
              : country.currency.currency_ar}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  function onItemSingleSelected(selectitem, section) {
    let counter = 0;

    if (Array.isArray(pickerSelectedArray) && pickerSelectedArray.length) {
      pickerSelectData.map((item, key) => {
        var subData = [];
        subData.push(selectitem);

        if (
          section.id === item.titileId &&
          section.minimum === item.minimum &&
          (section.minimum === "1" || section.minimum === "0")
        ) {
          var DeletedResult = {
            titileId: item.id,
            product: item.product,
            addon: item.addon,
            minimum: item.minimum,
            maximum: item.maximum,
            title: item.title,
            title_ar: item.title_ar,
            data: item.data,
          };
          pickerSelectedArray.splice(
            pickerSelectedArray.indexOf(DeletedResult),
            1
          );
        }
      });

      if (counter === 0) {
        var subData = [];
        subData.push(selectitem);
        pickerSelectedArray.push({
          titileId: section.id,
          product: section.product,
          addon: section.addon,
          minimum: section.minimum,
          maximum: section.maximum,
          title: section.title,
          title_ar: section.title_ar,
          data: [
            {
              id: selectitem.id,
              productId: selectitem.product,
              title: selectitem.title,
              product: selectitem.product,
              addon: selectitem.addon,
              item: selectitem.item,
              price: selectitem.price,
              now: selectitem.now,
              title_ar: selectitem.title_ar,
            },
          ],
        });
      }
    } else {
      var subData = [];
      subData.push(selectitem);
      pickerSelectedArray.push({
        titileId: section.id,
        product: section.product,
        addon: section.addon,
        minimum: section.minimum,
        maximum: section.maximum,
        title: section.title,
        title_ar: section.title_ar,
        data: [
          {
            id: selectitem.id,
            productId: selectitem.product,
            title: selectitem.title,
            product: selectitem.product,
            addon: selectitem.addon,
            item: selectitem.item,
            price: selectitem.price,
            now: selectitem.now,
            title_ar: selectitem.title_ar,
          },
        ],
      });
    }

    setPickerSelectData(pickerSelectedArray);

    var tempTotalPricePicker = 0;
    pickerSelectedArray.map((res, key) => {
      var tempAddonsPrice = 0;

      res.data.map((subRes, i) => {
        tempAddonsPrice += parseFloat(subRes.price);
      });
      tempTotalPricePicker += parseFloat(tempAddonsPrice);
    });

    setSelectAddonsPricePicker(tempTotalPricePicker);

    setDummy(dummy + 1);
  }

  function onItemSelected(item, section) {
    let count = 0;
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
            if (res.data.length === parseInt(section.maximum)) {
              Alert.alert(
                "you can select " +
                maximum +
                " " +
                "items only " +
                section.title,
                "",
                [
                  {
                    text: "OK",
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

  function renderPicker(pickerData, section) {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          margin: responsiveWidth(1),
          // borderWidth: 1,
          // borderColor: "lightgrey",
          // padding: responsiveWidth(3),
        }}
      >
        <View
          style={{
            height: 45,
            backgroundColor: Colors.lightgrey,
            justifyContent: "center",
            // paddingHorizontal: responsiveWidth(5),
            borderRadius: 5,
            marginBottom: responsiveWidth(1),
          }}
        >
          <RNPickerSelect
            placeholder={{
              label: "Select",
              value: null,
              color: Colors.grey,
            }}
            // placeholder={{}}
            useNativeAndroidPickerStyle={false}
            // value={}
            onValueChange={(value) => {
              if (value != null) {
                section.items.filter((itemSelected) => {
                  if (itemSelected.value === value) {
                    onItemSingleSelected(itemSelected, section);
                    setAlertMessage(false);
                  }
                });
              } else {
                if (section.minimum != "0") {
                  setAlertMessage(true);
                }
              }
            }}
            items={pickerData}
            style={{
              ...styles,
              iconContainer: {
                justifyContent: "center",
                alignItems: "center",
                // top: 20,
                // right: 25,
                top: responsiveWidth(3),
                right: responsiveWidth(6),
              },

              placeholder: {
                textAlign: "left",
                color: Colors.black,
                fontSize: responsiveFontSize(1.8),
                justifyContent: "center",
                alignItems: "center",
                // fontWeight: 'bold',
                backgroundColor: "#ffffff",
              },
            }}
            Icon={() => {
              return (
                <Image
                  source={Images.downarrow}
                  style={{
                    height: 15,
                    width: 15,
                    tintColor: "lightgrey",
                    resizeMode: "contain",
                    tintColor: Colors.grey,
                  }}
                />
              );
            }}
          />
        </View>
      </View>
    );
  }
  const onPressCart = () => {
    props.onClose();
    navigation.push("Cart", { routeFrom: "ProductDetails" });
  };
  const updateSize = (height) => {
    setTextHeight(height);
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
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View
              // style={{ backgroundColor: "yellow" }}
              >
                <Carousel
                  ref={carouselRef}
                  sliderWidth={responsiveWidth(100)}
                  sliderHeight={responsiveWidth(60)}
                  itemWidth={responsiveWidth(100)}
                  itemHeight={responsiveWidth(60)}
                  data={productDetails.images}
                  renderItem={_carouselCardItem}
                  // loopClonesPerSide={2}
                  // inactiveSlideScale={1}
                  layoutCardOffset="14"
                  activeSlideOffset={30}
                  inactiveSlideOpacity={1}
                  loop={true}
                  enableMomentum={true}
                  activeSlideAlignment={"start"}
                  activeAnimationType="timing"
                  activeAnimationOptions={{
                    friction: 4,
                    tension: 1,
                  }}
                  hasParallaxImages={true}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={5000}
                  onSnapToItem={(index) => setActiveSlide(index)}
                />

                <View
                  style={{
                    position: "absolute",
                    top: responsiveHeight(50),
                    bottom: responsiveHeight(0),
                    left: responsiveWidth(10),
                    right: responsiveWidth(10),

                    // backgroundColor: "#0e0e0e4f",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {pagination()}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  top: responsiveWidth(5),
                  left: responsiveWidth(5),
                  right: responsiveWidth(5),
                  bottom: 0,
                  height: responsiveWidth(15),
                  // backgroundColor: "#0e0e0e4f",
                }}
              >
                <TouchableOpacity onPress={() => props.onClose()}>
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
                    // borderRadius: responsiveWidth(10) / 2,
                    // backgroundColor: "white",
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
                          responsiveWidth(cart.cartItems.length >= 20 ? 7 : 5) /
                          2,
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
                // onPress={() => {
                //   ShareProductDetails(item.image);
                // }}
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

              <View
                style={{
                  position: "absolute",
                  top: responsiveHeight(51),
                  bottom: responsiveHeight(0),
                  left: responsiveWidth(0),
                  right: responsiveWidth(5),
                  flexDirection: "row",
                  // // backgroundColor: '#0e0e0e4f',
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }} />

                {/* <TouchableOpacity
                  style={{
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    // borderRadius: responsiveWidth(10) / 2,
                    // backgroundColor: Colors.white,
                    justifyContent: "center",
                    alignItems: "center",
                    // borderWidth: 1,
                    // borderColor: "lightgrey",
                  }}
                  onPress={() => onWhishlist()}
                >
                  <Image
                    style={{
                      width: responsiveWidth(5),
                      height: responsiveWidth(5),
                      tintColor: wishlist ? "red" : "black",
                    }}
                    source={wishlist ? Images.heart : Images.emptyheart}
                    resizeMode="contain"
                  />
                </TouchableOpacity> */}
              </View>
              <View
                style={{
                  marginTop: responsiveWidth(2),
                  marginBottom: responsiveWidth(2),
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
                      ? productDetails.product.description_ar.replace(regex, "")
                      : productDetails.product.description.replace(regex, "")}
                  </Text>
                </View>
              ) : null}

              <View
                style={{
                  marginTop: responsiveWidth(2),
                  marginBottom: responsiveWidth(2),
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
                      setQunatitys(quantitys + 1);
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

                <Text
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
                      country.currency.price *
                      (parseFloat(productDetails.product.price) +
                        parseFloat(selectAddonsPrice) +
                        parseFloat(selectAddonsPricePicker))
                    ) * parseInt(quantitys)
                  ).toFixed(3)}
                </Text>
              </View>

              {productDetails && productDetails.addons.length > 0
                ? productDetails.addons.map((res, key) => {
                  return (
                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          height: 40,
                          // backgroundColor: settings.settings.color1,
                          paddingHorizontal: responsiveWidth(1),
                          paddingLeft: 5,
                          // borderWidth: 1,
                          // borderColor: "lightgrey",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(2),
                            color: Colors.black,
                            fontStyle: "normal",
                            textAlign: "left",

                            marginLeft: responsiveWidth(2),
                          }}
                        >
                          {I18nManager.isRTL ? res.title_ar : res.title}
                          {/* (Min:
                            {res.minimum}-Max:{res.maximum}) */}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.6),
                            color: Colors.white,
                            fontStyle: "normal",
                            textAlign: "left",
                            lineHeight: 25,
                          }}
                        >
                          REQUIRED
                        </Text>
                      </View>
                      <View
                        style={{
                          borderRadius: 5,
                          margin: 10,
                          padding: 5,
                          borderWidth:
                            res.minimum === "1" || res.minimum === "0"
                              ? 0
                              : 1,
                          borderColor: "lightgrey",
                        }}
                      >
                        {res.minimum === "1" || res.minimum === "0"
                          ? renderPicker(res.items, res)
                          : res.items
                            ? res.items.map((checkbox, key) => {
                              return renderCheckBox(checkbox, res, key);
                            })
                            : null}
                      </View>
                    </View>
                  );
                })
                : null}

              <Text
                style={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(2),
                  color: Colors.black,
                  fontStyle: "normal",
                  textAlign: "left",

                  marginLeft: responsiveWidth(2),
                }}
              >
                Extra Details
              </Text>
              {/* <View
                style={{
                  backgroundColor: "#FFF",
                  height:
                    textheight > Math.max(35, height)
                      ? textheight
                      : Math.max(35, height),
                  borderWidth: 1,
                  borderColor: "lightgrey",
                  margin: responsiveWidth(1),
                  borderRadius: 10,
                }}
              > */}
              <TextInput
                placeholder={"Extra Details"}
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
                    textheight > Math.max(35, height)
                      ? textheight
                      : Math.max(35, height),
                  borderWidth: 1,
                  borderColor: "lightgrey",
                  margin: responsiveWidth(3),
                  borderRadius: 10,
                }}
                onContentSizeChange={(e) =>
                  updateSize(e.nativeEvent.contentSize.height)
                }
              />
              {/* </View> */}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: settings.settings.color1,
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: responsiveWidth(2),
              flexDirection: "row",
              marginHorizontal: responsiveWidth(1),
              paddingHorizontal: responsiveWidth(2),
              borderRadius: 5,
              marginBottom: responsiveWidth(2),
            }}
            onPress={() => onAddToCart()}
          >
            <Text
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
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
                color: Colors.white,
                textTransform: "capitalize",
              }}
            >
              {language["add to basket"]}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No Details Found</Text>
      )}
    </SafeAreaView>
  );
}
