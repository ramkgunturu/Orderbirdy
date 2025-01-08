import React, {
  useContext,
  useState,
  createRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  I18nManager,
} from "react-native";
import { Images, Fonts, Colors } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Header, OrderDetails, OfferDetails } from "@components";
import Skeleton from "./Skeleton";
import Services from "@Services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";
import moment from "moment";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function Offers(props) {
  const [spinner, setSpinner] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const [offers, setOffers] = useState(null);
  const { country, setCountry } = useContext(CountryContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const regex = /(<([^>]+)>)/gi;
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Offers Screen");
    }
    fetchoffers();
  }, []);
  function fetchoffers() {
    Services(constants.API_BASE_URL + "/offers").then((response) => {
      if (response) {
        // console.log(response);
        setOffers(response);
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.white,
          borderBottomColor: Colors.lightgrey,
          borderBottomWidth: 0.2,
          paddingVertical: 10,
          paddingHorizontal: 2,
        }}
        onPress={() =>
          props.navigation.navigate("OfferDetails", { offerData: { item } })
        }
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 0.2,
              alignItems: "center",
              marginTop: responsiveWidth(4),
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.lightgrey,
              }}
            >
              <Image
                style={{
                  height: responsiveWidth(12),
                  width: responsiveWidth(12),
                  margin: responsiveWidth(1),
                }}
                source={{ uri: item.image }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              paddingTop: responsiveWidth(1),
              paddingLeft: responsiveWidth(2),
              paddingRight: responsiveWidth(2),
              paddingBottom: responsiveWidth(1),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.8),
                paddingTop: responsiveWidth(2),
                color: Colors.black,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {I18nManager.isRTL ? item.title_ar : item.title}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textbold,
                fontSize: responsiveFontSize(1.8),
                paddingTop: responsiveWidth(2),
                color: Colors.black,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {language["validuntil"]}{" "}
              {moment(moment(item.end_date, "DD-MM-YYYY")).format("DD-MM-YYYY")}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.8),
                paddingTop: responsiveWidth(2),
                color: Colors.black,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {I18nManager.isRTL
                ? item.description_ar.replace(regex, "")
                : item.description.replace(regex, "")}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(1.8),
                paddingTop: responsiveWidth(2),
                color: Colors.black,
                textAlign: "left",
              }}
            >
              {I18nManager.isRTL ? item.sub_title_ar : item.sub_title}
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {I18nManager.isRTL ? (
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(4),
                  tintColor: "black",
                  resizeMode: "contain",
                }}
                source={Images.smallfrontarrow}
              />
            ) : (
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(4),
                  tintColor: "black",
                  resizeMode: "contain",
                }}
                source={Images.back}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: responsiveHeight(8),
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header
          title={language["offers"]}
          screen={"MyOrders"}
          navigation={props.navigation}
        />
      </View>
      {spinner ? (
        <View style={{ flex: 1 }}>
          <Skeleton />
        </View>
      ) : offers && offers.length > 0 ? (
        <FlatList
          data={offers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text
          style={{
            fontFamily: Fonts.textfont,
            marginTop: responsiveHeight(25),
            fontSize: responsiveFontSize(1.8),
            paddingLeft: responsiveWidth(2),
            color: Colors.black,
            textAlign: "center",
          }}
        >
          {language["No Data"]}
        </Text>
      )}
    </View>
  );
}
