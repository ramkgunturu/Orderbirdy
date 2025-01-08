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
  I18nManager,
  TouchableOpacity,
  TextInput,
  Keyboard,
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
  ProductRow,
  ProductDetailsParallex,
} from "@components";
// import { Content } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import { LanguageContext } from "@context/lang-context";
import { actions as cartActions } from "./../../redux/cart";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const { width, height } = Dimensions.get("screen");

export default function Search(props) {
  const { settings, setSettings } = useContext(SettingsContext);
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.whishlist);
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dummy, setDummy] = useState(0);
  const [textinput, setTextInput] = useState("");
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Search Screen");
    }
    setData([]);
    // setSpinner(true);
    // fetchData();
  }, []);

  const fetchData = () => {
    var count = 0;
    if (textinput.length > 0) {
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Searched, {
          search_string: textinput,
        });
      }
      var sendData = {
        search: textinput ? textinput : null,
        page: offset,
      };

      if (!loading && !isListEnd) {
        setLoading(true);
        Services(constants.API_BASE_URL + "products", sendData, "POST")
          .then((response) => {
            if (response.length > 0) {
              // After the response increasing the offset
              setWishlistStatusUpdate(response);

              setLoading(false);
              setRefreshing(false);
              setSpinner(false);
              setOffset(offset + 1);
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
        setRefreshing(false);
        setSpinner(false);
      }
    } else {
      let errormessage = language["Please enter your search text"];
      alert(errormessage);
      setSpinner(false);
      setSearchDisplay(false);
    }
  };

  const setWishlistStatusUpdate = (responses) => {
    responses.map((res, key) => {
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

  const _onRefresh = () => {
    setRefreshing(true);
    fetchData();
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
      // <ProductDisplay
      //   item={item}
      //   onPressModal={() => onPressModal(item)}
      //   index={index}
      //   onPressWishList={() => onWhishlist(item)}
      // />
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
        available_quantity: item.quantity,
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Search"} title={language["Search"]} />
      </View>

      <View
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
      >
        <View
          style={{
            flex: textinput ? 0.9 : 1,
            justifyContent: "center",
            marginHorizontal: responsiveWidth(2),
          }}
        >
          <TextInput
            placeholder={language["Search"]}
            placeholderTextColor={Colors.grey}
            keyboardType={"default"}
            secureTextEntry={false}
            onChangeText={(text) => {
              setOffset(0);
              setData([]);
              setIsListEnd(false);
              setTextInput(text);
              if (text === "") {
                setSearchDisplay(false);
              }
            }}
            blurOnSubmit={true}
            value={textinput}
            style={{
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(2),
              textTransform: "capitalize",
              textAlign: I18nManager.isRTL ? "right" : "left",
              paddingVertical: responsiveWidth(1),
            }}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              setSpinner(true);
              //   setOffset(offset - offset);

              //   setIsListEnd(false);
              setLoading(false);
              setSearchDisplay(true);
              fetchData();
            }}
          />
        </View>
        {textinput ? (
          <TouchableOpacity
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              //   let count = offset - offset;
              Keyboard.dismiss();
              setSpinner(true);
              //   setOffset(count);
              //setData([]);
              //   setIsListEnd(false);
              setLoading(false);
              setSearchDisplay(true);
              fetchData();
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
          </TouchableOpacity>
        ) : null}
      </View>
      {spinner ? (
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
      ) : (
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: Colors.white }}>
            {data && data.length > 0 ? (
              <FlatList
                data={data}
                renderItem={renderItem}
                // initialNumToRender={2}
                bounces={false}
                horizontal={false}
                keyExtractor={(item) => item.id}
                style={{ marginBottom: 10 }}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                // windowSize={2}
                ListFooterComponent={() => renderFooter()}
                onEndReached={() => fetchData()}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => _onRefresh()}
                    title="Loading"
                  />
                }
              />
            ) : searchDisplay ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    color: Colors.black,
                    paddingTop: responsiveHeight(2),

                    fontFamily: Fonts.textfont,
                  }}
                >
                  {language["No Data"]}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
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
            onClose={() => setModalVisibles(false)}
          />
        ) : (
          <ProductDetailsParallex
            details={details.id}
            onClose={() => setModalVisibles(false)}
          />
        )}
      </Modal>
    </View>
  );
}
