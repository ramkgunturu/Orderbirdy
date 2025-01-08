import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Keyboard,
  Modal,
  I18nManager,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Colors } from "@Themes";
import { useNavigation } from "@react-navigation/native";
import { Header, ContentDisplay, ContactUs } from "@components";
import Skeleton from "./Skeleton";
import Services from "@Services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

export default function AboutUs(props) {
  const [spinner, setSpinner] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [data, setData] = useState([]);
  const regex = /(<([^>]+)>)/gi;
  // useEffect(() => {
  //   fetchData();
  // }, []);
  // function fetchData() {
  //   Services(constants.API_BASE_URL + "pages").then((response) => {
  //     if (response) {
  //       setData(response);
  //       setSpinner(false);
  //     } else {
  //       setSpinner(false);
  //     }
  //   });
  // }
  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("About Us");
    }
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: responsiveHeight(8),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"ForgetPassword"} title={props.route.params.title} />
      </View>

      {/* {spinner ? (
        <View style={{ flex: 1 }}>
          <Skeleton />
        </View>
      ) : props.route.params.route === "AboutUs" ? (
        <ContentDisplay data={data[0]} />
      ) : props.route.params.route === "PrivacyPolicy" ? (
        <ContentDisplay data={data[2]} />
      ) : props.route.params.route === "Terms&Conditions" ? (
        <ContentDisplay data={data[1]} />
      ) : props.route.params.route === "ContactUs" ? (
        <ContactUs />
      ) : null} */}
      <ContactUs />
    </View>
  );
}
