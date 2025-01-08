import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  ImageBackground,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  I18nManager,
  TouchableOpacity,
} from "react-native";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Colors, Images, Fonts } from "@Themes";
import {
  Header,
  ProductRow,
  ProductDetails,
  ProductDetailsParallex,
} from "@components";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Services from "@Services";
import constants from "@constants";
import Skeleton from "./Skeleton";
import ImageSkeleton from "./ImageSkeleton";
import AutoHeightImage from "react-native-auto-height-image";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { SettingsContext } from "@context/settings-context";
import FastImage from "react-native-fast-image";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;
const deviceHeight = dimensions.height;

export default function Home() {
  const { settings, setSettings } = useContext(SettingsContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [details, setDetails] = useState([]);
  const carouselRef = useRef(null);
  const [imageLoader, setImageLoader] = useState(false);
  const [imageMLoader, setImageMLoader] = useState(false);
  const [imageTLoader, setImageTLoader] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [calcImgHeight, setCalcImgHeight] = useState(0);

  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Home Screen");
    }
    setSpinner(true);
    fetchData();

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        console.log(
          "Message handled in the getInitialNotification!",
          remoteMessage
        );
        if (remoteMessage) fetchNotifications(remoteMessage);
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log("Message handled in the quit state!", remoteMessage);
      fetchNotifications(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // When app in foreground
      console.log("Message handled in the foregroud!", remoteMessage);
      fetchNotifications(remoteMessage);
    });

    return () => {
      return unsubscribe;
    };
  }, []);

  const fetchData = () => {
    Services(constants.API_BASE_URL + "home").then((response) => {
      // console.log(response, "responseresponseresponse");
      if (response) {
        setData(response);
        setImageLoader(false);
        setImageMLoader(false);
        setImageTLoader(false);
        setSpinner(false);

        if (
          (response && response.banners.length > 0) ||
          (response && response.categories.length === 1)
        ) {
          setImageLoader(true);
        }
      } else {
        setSpinner(false);
      }
    });
  };

  const fetchNotifications = (remoteMessage) => {
    var notificationData = null;
    if (Platform.OS === "ios") {
      // console.log("Message remoteMessage!", remoteMessage.data.moredata);
      notificationData = JSON.parse(remoteMessage.data.moredata);
      callNotificationRoute(notificationData);
      // notificationIos(message, res);
    } else {
      notificationData = JSON.parse(remoteMessage.data.content);
      // console.log(notificationData., "--------type1------------");
      // notificationAndroid(notificationData);
      callNotificationRoute(notificationData);
    }
  };

  const callNotificationRoute = (notificationData) => {
    console.log(notificationData.type);
    if (notificationData.type.toLowerCase() === "offer") {
      Alert.alert(
        "Notification",
        I18nManager.isRTL ? notificationData.title_ar : notificationData.title,
        [
          {
            text: language["OK"],
            onPress: () => {
              navigation.push("Offers");
            },
          },
          {
            text: language["Cancel"],
            style: "cancel",
          },
        ]
      );
    } else if (NotificationData.type.toLowerCase() === "product") {
      Alert.alert(
        "Notification",
        I18nManager.isRTL ? notificationData.title_ar : notificationData.title,
        [
          {
            text: language["OK"],
            onPress: () => {
              setDetails(item.type_id);
              setModalVisibles(true);
            },
          },
          {
            text: language["Cancel"],
            style: "cancel",
          },
        ]
      );
    } else if (NotificationData.type.toLowerCase() === "category") {
      Alert.alert(
        "Notification",
        I18nManager.isRTL ? notificationData.title_ar : notificationData.title,
        [
          {
            text: language["OK"],
            onPress: () => {
              navigation.push("CategoryProducts", {
                item: notificationData,
                title: I18nManager.isRTL
                  ? notificationData.title_ar
                  : notificationData.title,
                route: "home",
                banner: "category",
              });
            },
          },
          {
            text: language["Cancel"],
            style: "cancel",
          },
        ]
      );
    }
  };
  function onPressModal(item) {
    // console.log(item);
    // setDetails(item);
    // setModalVisibles(true);
    // console.log(item);
    if (item && item.type === "product") {
      setDetails(item.type_id);
      setModalVisibles(true);
    } else {
      setDetails(item.id);
      setModalVisibles(true);
    }
  }
  const renderItem = ({ item, index }) => {
    // console.log(item, "-----------item------------------");
    return (
      <ProductRow
        item={item}
        onPressModal={() => onPressModal(item)}
        index={index}
        textdisplay={true}
        onAddToCart={() => onPressAddToCart(item)}
      />
    );
  };

  const onPressAddToCart = (item) => {
    if (item.addons_count === "0") {
      var cartDetailsData = {
        id: item.id,
        item_code: item.item_code,
        addons_count: item.addons_count,
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
          contentId: item.id,
          currency: 'KWD',
          value: item.price,
        });
      }
      cartActions.addToCart(dispatch, cartDetailsData);
    } else {
      onPressModal(item);
    }
  };

  const _renderItemTwoImage = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() =>
          item.type === ""
            ? null
            : navigation.push("CategoryProducts", {
              item: item,
              title: I18nManager.isRTL ? item.title_ar : item.title,
              route: "home",
            })
        }
      >
        <AutoHeightImage
          width={responsiveWidth(49.8)}
          margin={responsiveWidth(1)}
          source={{ uri: item.image }}
          // onLoadStart={() => setImageTLoader(true)}
          // onLoad={() => setImageTLoader(false)}
          ImageCacheEnum={"only-if-cached"}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveWidth(45),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          }
        ></AutoHeightImage>
        <View
          style={{ width: responsiveWidth(49.8), margin: responsiveWidth(1) }}
        >
          <Text
            style={{
              color: "black",
              fontSize: responsiveFontSize(1.6),
              textAlign: "center",
              fontFamily: Fonts.textmedium,
              paddingVertical: responsiveWidth(4),
            }}
          >
            {I18nManager.isRTL ? item.title_ar : item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderItemSingle = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() =>
          item.type === ""
            ? null
            : navigation.push("CategoryProducts", {
              item: item,
              title: I18nManager.isRTL ? item.title_ar : item.title,
              route: "home",
            })
        }
      >
        <AutoHeightImage
          width={responsiveWidth(100)}
          source={{ uri: item.image }}
          // onLoadStart={() => setImageLoader(true)}
          onLoad={() => setImageLoader(false)}
          ImageCacheEnum={"only-if-cached"}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveWidth(45),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <ActivityIndicator color="black" /> */}
            </View>
          }
        ></AutoHeightImage>
        <Text
          style={{
            color: "black",
            fontSize: responsiveFontSize(1.6),
            textAlign: "center",
            fontFamily: Fonts.textmedium,
            paddingVertical: responsiveWidth(4),
          }}
        >
          {I18nManager.isRTL ? item.title_ar : item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        style={{
          flex: 1,
          marginLeft: responsiveWidth(1),
        }}
        onPress={() =>
          navigation.push("CategoryProducts", {
            item: item,
            title: I18nManager.isRTL ? item.title_ar : item.title,
            route: "home",
          })
        }
      >
        {/* {imageMLoader ? <ImageSkeleton /> : null} */}
        <AutoHeightImage
          width={responsiveWidth(75)}
          marginLeft={responsiveWidth(1.5)}
          source={{ uri: item.image }}
          ImageCacheEnum={"only-if-cached"}
          // defaultSource={Images.loadergif}
          onLoadStart={() => setImageMLoader(true)}
          onLoad={() => setImageMLoader(false)}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveWidth(45),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          }
        />
      </TouchableWithoutFeedback>
    );
  };

  const caroselRenderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: responsiveWidth(0.5),
      }}
      onPress={() =>
        item.type === "product"
          ? onPressModal(item)
          : item.type === "category"
            ? navigation.push("CategoryProducts", {
              item: item,
              title: item.title,
              route: "home",
              banner: "category",
            })
            : ""
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AutoHeightImage
          width={responsiveWidth(100)}
          source={{ uri: item.image }}
          ImageCacheEnum={"only-if-cached"}
          // onLoadStart={() => setImageLoader(true)}
          onLoadEnd={() => setImageLoader(false)}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveWidth(50),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <ActivityIndicator color="black" /> */}
            </View>
          }
        />
        {/* <FastImage
          style={{ width: responsiveWidth(100), height: calcImgHeight }}
          source={{
            uri: item.image,
          }}
          onLoad={(evt) =>
            setCalcImgHeight(
              (evt.nativeEvent.height / evt.nativeEvent.width) * imageWidth // By this, you keep the image ratio
            )
          }
          onLoadStart={() => setImageLoader(true)}
          onLoadEnd={() => setImageLoader(false)}
        /> */}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.3,
        borderBottomColor: Colors.lightgrey,
      }}
    >
      <View
        style={{
          width: "100%",
          height: responsiveHeight(8),
          backgroundColor: Colors.white,
          paddingHorizontal: responsiveWidth(1),
          // borderBottomWidth: 0.5,
          // borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen="Home" title="Youe" />
      </View>
      {spinner ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, backgroundColor: Colors.white }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {data && data.banners.length > 0 ? (
              <Carousel
                ref={carouselRef}
                sliderWidth={responsiveWidth(100)}
                sliderHeight={responsiveWidth(100)}
                itemWidth={responsiveWidth(100)}
                data={data.banners}
                renderItem={caroselRenderItem}
                loopClonesPerSide={2}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                loop={true}
                enableMomentum={true}
                activeSlideAlignment={"center"}
                activeAnimationType="timing"
                activeAnimationOptions={{
                  friction: 4,
                  tension: 1,
                }}
                hasParallaxImages={true}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={5000}
              />
            ) : null}
            {!imageLoader && !spinner ? (
              <TouchableOpacity
                style={{
                  height: responsiveWidth(10),
                  marginHorizontal: responsiveWidth(2),
                  backgroundColor: "#EBEEEE",
                  borderRadius: 10,
                  flexDirection: "row",
                  marginTop: responsiveHeight(1),
                  marginBottom: responsiveHeight(1),
                  justifyContent: "center",
                }}
                onPress={() => navigation.push("Search")}
              >
                <View
                  style={{
                    flex: 0.15,
                    justifyContent: "center",
                    alignItems: "center",
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
                </View>
                <View style={{ flex: 0.85, justifyContent: "center" }}>
                  {/* <TextInput
                    placeholder={language["Search"]}
                    placeholderTextColor={Colors.grey}
                    keyboardType={"default"}
                    secureTextEntry={false}
                    onChangeText={(text) => setTextInput(text)}
                    blurOnSubmit={true}
                    editable={false}
                    // value={}
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(2),
                      textTransform: "capitalize",
                      textAlign: I18nManager.isRTL ? "right" : "left",
                    }}
                    returnKeyType="done"
                    // onSubmitEditing={() => onsubmit()}
                  /> */}
                  <Text
                    style={{
                      fontFamily: Fonts.textmedium,
                      fontSize: responsiveFontSize(1.6),
                      textTransform: "capitalize",
                      textAlign: "left",
                      color: Colors.grey,
                      // padding: 10,
                      // textDecorationLine: "underline",
                    }}
                  >
                    {language["Search"]}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {data && data.categories.length > 0 ? (
              !imageLoader && !spinner ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center", // marginBottom: 10,
                    marginTop: responsiveWidth(3),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textfont,
                      fontSize: responsiveFontSize(2.3),
                      textTransform: "capitalize",
                      textAlign: "center",
                      fontStyle: "normal",
                    }}
                  >
                    {language["Categories"]}
                  </Text>
                </View>
              ) : null
            ) : null}

            {data && data.categories.length === 1 ? (
              <View style={{ flex: 1 }}>
                {!imageLoader && !spinner ? (
                  <Animated.FlatList
                    data={data.categories}
                    initialNumToRender={1}
                    renderItem={_renderItemSingle}
                    keyExtractor={(item) => item.id}
                    style={{
                      // marginBottom: 10,
                      marginTop: responsiveWidth(2),
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  />
                ) : null}
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {!imageLoader && !spinner ? (
                  <Animated.FlatList
                    data={data.categories}
                    renderItem={_renderItemTwoImage}
                    initialNumToRender={2}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    style={{
                      // marginBottom: 10,
                      marginTop: responsiveWidth(2),
                      marginBottom: responsiveWidth(2),
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  />
                ) : null}
              </View>
            )}
            {data && data.products.length > 0
              ? data.products.map((res, key) => {
                return !imageLoader &&
                  !imageMLoader &&
                  !imageTLoader &&
                  !spinner ? (
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignContent: "center",
                        flexDirection: "row",
                        // borderBottomWidth: 1,
                        // borderBottomColor: Colors.lightgrey,
                        marginTop: responsiveHeight(2),
                        marginBottom: responsiveWidth(3),
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(2.3),
                            textTransform: "capitalize",
                            textAlign: "left",
                            fontStyle: "normal",
                            marginTop: responsiveWidth(2),
                            marginHorizontal: responsiveWidth(2),
                          }}
                        >
                          {I18nManager.isRTL ? res.title_ar : res.title}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: settings.settings.color1,
                          marginHorizontal: responsiveWidth(2),
                          borderWidth: 1,
                          borderColor: settings.settings.color1,
                        }}
                        onPress={() =>
                          navigation.push("CategoryProducts", {
                            item: res,
                            title: I18nManager.isRTL
                              ? res.title_ar
                              : res.title,
                            route: "home",
                          })
                        }
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.textmedium,
                            fontSize: responsiveFontSize(1.6),
                            textTransform: "capitalize",
                            textAlign: "right",
                            color: Colors.white,
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingHorizontal: responsiveWidth(5),
                            // textDecorationLine: "underline",
                          }}
                        >
                          {language["see more"]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Animated.FlatList
                      data={res.data}
                      renderItem={renderItem}
                      initialNumToRender={2}
                      keyExtractor={(item) => item.id}
                      horizontal={true}
                      style={
                        {
                          // marginBottom: 10,
                          // marginTop: responsiveWidth(2),
                        }
                      }
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                ) : null;
              })
              : null}
          </ScrollView>
        </View>
      )}
      <Modal
        animationType="fadeIn"
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
            details={details}
            onClose={() => setModalVisibles(false)}
          />
        ) : (
          <ProductDetailsParallex
            details={details}
            onClose={() => setModalVisibles(false)}
          />
        )}
      </Modal>
      {(imageLoader || imageTLoader || imageMLoader) && !spinner ? (
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
          {imageLoader ? (
            <ActivityIndicator size="small" color={Colors.black} />
          ) : (
            <ActivityIndicator size="small" color="red" />
          )}
        </View>
      ) : null}
    </View>
  );
}
