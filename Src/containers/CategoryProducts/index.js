import React, { useState, useEffect, useContext, useRef } from "react";
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
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
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
  ProductRow,
  ProductDetailsParallex,
} from "@components";

import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import Skeleton from "./Skeleton";
import { actions as cartActions } from "./../../redux/cart";
import { SettingsContext } from "@context/settings-context";
const { width, height } = Dimensions.get("screen");
import { LanguageContext } from "@context/lang-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function CategoryProducts(props) {
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.whishlist);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dummy, setDummy] = useState(0);
  const { settings, setSettings } = useContext(SettingsContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [tabIndex, SetTabIndex] = useState(0);
  const trackingStatus = useContext(TrackingPermissionContext);

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Products Category");
    }
    setData([]);
    setSpinner(true);
    fetchData();
  }, []);

  const fetchData = () => {
    var count = 0;
    if (
      props &&
      props.route.params.route === "home" &&
      props.route.params.banner === "category"
    ) {
      var sendData = {
        category:
          props && props.route.params.item
            ? props.route.params.item.type_id
            : null,
        page: offset,
      };
    } else {
      var sendData = {
        category:
          props && props.route.params.item ? props.route.params.item.id : null,
        page: offset,
      };
    }
    // console.log("loading,isListEnd", loading, isListEnd);
    if (!loading && !isListEnd) {
      // console.log("---sendData-----", sendData);
      setLoading(true);
      // console.log(constants.API_BASE_URL + "products_new", sendData);
      // Services(constants.API_BASE_URL + "products", sendData, "POST");
      Services(constants.API_BASE_URL + "products_new", sendData, "POST")
        .then((response) => {
          if (response && response.categories.length > 0) {
            // console.log("---------------response---------------", response);
            // After the response increasing the offset
            productsCount = 0;
            response.categories.map((result, key) => {
              result.products.map((res, key) => {
                productsCount = +1;
              });
            });
            if (productsCount > 0) {
              setWishlistStatusUpdate(response.categories);
              setLoading(false);
              setRefreshing(false);
              setSpinner(false);
              setOffset(offset + 1);
            } else {
              setLoading(false);
              setRefreshing(false);
              setSpinner(false);
              setOffset(offset + 1);
              setIsListEnd(true);
            }
          } else {
            setIsListEnd(true);
            setLoading(false);
            setRefreshing(false);
            setSpinner(false);
          }
        })
        .catch((error) => {
          // console.error(error);
        });
    } else {
      setLoading(false);
      setRefreshing(false);
      setSpinner(false);
    }
  };

  const setWishlistStatusUpdate = (responses) => {
    responses.map((result, key) => {
      result.products.map((res, key) => {
        count = 0;
        wishlistData.whishlistItems.filter((wishlistItem) => {
          if (wishlistItem.id === res.id) {
            res.whishlist = true;
            count = 1;
          }
        });
        if (count === 0) {
          res.whishlist = false;
        }
      });
    });

    setData([...data, ...responses]);
  };
  const setUpdateWishlistStatusUpdate = (updateItem) => {
    data.map((res, key) => {
      count = 0;
      wishlistData.whishlistItems.filter((wishlistItem) => {
        if (wishlistItem.id === updateItem.id) {
          res.whishlist = true;
          count = 1;
        }
      });
      if (count === 0) {
        res.whishlist = false;
      }
    });
  };

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {loading ? (
          <View>
            <ActivityIndicator color="black" style={{ margin: 15 }} />
            <Text>Loading</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <ProductRow
        item={item}
        onPressModal={() => onPressModal(item)}
        index={index}
        onAddToCart={() => onPressAddToCart(item)}
        textdisplay={true}
      // onPressWishList={() => onWhishlist(item)}
      />
    );
  };

  const onPressAddToCart = (item) => {
    if (item.addons_count === "0") {
      var cartDetailsData = {
        id: item.id,
        item_code: item.item_code,
        title: item.title,
        title_ar: item.title_ar,
        order_quantity: item.order_quantity,
        price: item.price,
        quantity: 1,
        available_quantity:
          parseInt(item.quantity_check) === 0 ? 100 : item.quantity,
        total_price: item.price,
        image: item.image,
        category: item.category,
        uniqueId: "_" + Math.random().toString(36).substr(2, 9),
        weight: item?.weight,
        addons: [],
        addonPrice: 0,
      };
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
          contentType: 'product',
          contentId: cartDetailsData.id,
          currency: 'KWD',
          value: cartDetailsData.price,
        });
      }
      cartActions.addToCart(dispatch, cartDetailsData);
    } else {
      onPressModal(item);
    }
  };

  function onPressModal(item) {
    // console.log(item);
    setDetails(item);
    setModalVisibles(true);
  }
  function onPressTab(item, index) {
    SetTabIndex(index);
  }
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressTab(item, index)}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          backgroundColor:
            tabIndex == index ? settings.settings.color1 : "white",
          borderWidth: 1,
          borderColor: tabIndex == index ? "white" : settings.settings.color1,
          height: responsiveWidth(8),
          marginHorizontal: responsiveWidth(2),
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(1.8),
            paddingLeft: 15,
            paddingRight: 15,
            color: tabIndex == index ? "white" : settings.settings.color1,
            textAlign: "center",
          }}
        >
          {I18nManager.isRTL ? item.title_ar : item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  function onWhishlist(productDetails) {
    if (productDetails.whishlist) {
      productDetails.whishlist = false;
      whishListActions.removeFromWhishlist(dispatch, productDetails);
      setDummy(dummy + 1);
    } else {
      productDetails.whishlist = true;
      whishListActions.addToWhishlist(dispatch, productDetails);
      setDummy(dummy + 1);
    }
  }

  const onEndReached = () => {
    // fetchData();
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
        <Header screen={"Category"} title={props.route.params.title} />
      </View>
      <ScrollView>
        {spinner ? (
          <Skeleton />
        ) : (
          <View style={{ flex: 1, backgroundColor: Colors.white }}>
            {data && data.length > 0 && data[tabIndex].products ? (
              <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <View
                  style={{
                    height: "auto",
                    width: "100%",
                    backgroundColor: Colors.white,
                    alignContent: "center",
                  }}
                >
                  <FlatList
                    data={data}
                    renderItem={_renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: responsiveHeight(1) }}
                  />
                </View>
                <FlatList
                  data={data[tabIndex].products}
                  renderItem={renderItem}
                  // initialNumToRender={2}
                  bounces={false}
                  horizontal={false}
                  keyExtractor={(item) => item.id}
                  style={{ marginBottom: 10 }}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  ListFooterComponent={() => renderFooter()}
                  onEndReached={() => onEndReached()}
                  onEndReachedThreshold={0.5}
                />
              </View>
            ) : (
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
            )}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slideInUp"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="slideOutDown"
        animationOutTiming={800}
        transparent={false}
        visible={modalVisibles}
        onRequestClose={() => {
          setModalVisibles(false);
        }}
      >
        {settings.settings.product_view === "1" ? (
          <ProductDetails
            details={details.id}
            onClose={() => {
              setModalVisibles(false);
              setUpdateWishlistStatusUpdate(details);
            }}
            onCloseItem={() => {
              setModalVisibles(false);
            }}
          />
        ) : (
          <ProductDetailsParallex
            details={details.id}
            onClose={() => {
              setModalVisibles(false);
              setUpdateWishlistStatusUpdate(details);
            }}
            onCloseItem={() => {
              setModalVisibles(false);
            }}
          />
        )}
      </Modal>
    </View>
  );
}
