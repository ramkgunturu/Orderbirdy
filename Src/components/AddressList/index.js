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
import { actions as whishListActions } from "../../redux/whishlist";
import { ScrollView } from "react-native";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { CommonCheckOut } from "@components";
import { SafeAreaView } from "react-native";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function AddressList(props) {
  const dispatch = useDispatch();
  const [colorPayment, setColorPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [address, setAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(null);
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [noOfItems, setNoOfItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Address Screen");
    }

    fetchAddresses();
  }, []);

  function fetchAddresses() {
    setSpinner(true);
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

  const _renderItemAddress = ({ item }) => {
    // console.log(item, "datadata");
    const regex = /(<([^>]+)>)/gi;
    const address = item.address_str.replace(regex, "");
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: responsiveWidth(6),
          // paddingTop: responsiveWidth(2),
          paddingVertical: responsiveWidth(2),
          borderWidth: 0.5,
          margin: responsiveWidth(1),
          borderColor: Colors.lightgrey,
        }}
        onPress={() => {
          props.route.params.onNavigateBack(item);
          navigation.pop();
        }}
      >
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontFamily: Fonts.textfont,

                textAlign: "left",
              }}
            >
              {item.title}
            </Text>
            <Image
              source={Images.more}
              style={{
                width: responsiveWidth(3),
                height: responsiveWidth(3),
                paddingRight: 20,
                tintColor: Colors.e4e4e4,
              }}
            />
          </View>
          <Text
            style={{
              marginTop: 10,
              fontSize: responsiveFontSize(1.6),
              fontFamily: Fonts.textfont,
              fontWeight: "normal",
              textAlign: "left",
            }}
          >
            {address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  function handleBack() {
    // console.log("opppppppppp")
    fetchAddresses();
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
        <Header
          screen={"AddAddress"}
          title={language["Select Address"]}
          onAddAddress={() => {
            navigation.push("AddAddress", { onNavigationBack: handleBack });
          }}
        />
      </View>
      {spinner ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="black" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {address && address.length > 0 ? (
            <FlatList
              data={address}
              renderItem={_renderItemAddress}
              keyExtractor={(item) => item.id}
              horizontal={false}
              style={{ marginBottom: 10 }}
              showsHorizontalScrollIndicator={false}
              indicatorStyle="white"
            />
          ) : (
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontFamily: Fonts.textfont,

                textAlign: "center",
                marginVertical: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(4),
              }}
            >
              {language["No Data"]}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
