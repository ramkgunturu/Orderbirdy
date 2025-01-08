import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  ActivityIndicator,
  I18nManager,
  Alert,
} from "react-native";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import { useNavigation } from "@react-navigation/native";
import { Colors, Fonts } from "@Themes";
import { Header } from "@components";
import constants from "@constants";
import Services from "@Services";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const url = constants.AAPI_BASE_URL;

export default function ForgetPassword(props) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [email, setEmail] = useState(null);
  const trackingStatus = useContext(TrackingPermissionContext);
  loadingButton = React.createRef();

  const onSubmit = (eid) => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Forget Password");
    }
    if (!eid) {
      let mesg = language["Please enter email"];
      alert(mesg);
    } else {
      loadingButton.setLoading(true);
      setIsLoading(true);

      Services(constants.API_BASE_URL + "recovery?email=" + eid, "POST").then(
        (response) => {
          // console.log("recovery", response);

          if (response.status === "Success") {
            setEmail(null);
            Alert.alert("Forget Password", response.message, [
              {
                text: language["OK"],
                onPress: () => {
                  navigation.push("SignIn", { routeFrom: "SignInList" });
                },
              },
            ]);
            loadingButton.setLoading(false);
            setIsLoading(false);
          } else {
            alert(response.message);
            loadingButton.setLoading(false);
            setIsLoading(false);
          }
        }
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <View
          style={{
            height: responsiveHeight(8),
            backgroundColor: Colors.white,
            borderBottomWidth: 1,
            borderBottomColor: Colors.lightgrey,
          }}
        >
          <Header screen={"ForgetPassword"} title={"Forget Password"} />
        </View>
        <View style={{ marginHorizontal: responsiveWidth(8) }}>
          <TextInput
            placeholder={"Please enter your email"}
            keyboardType="default"
            autoCapitalize="none"
            placeholderTextColor="grey"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={{
              paddingLeft: responsiveWidth(4),
              width: "100%",
              fontFamily: Fonts.textfont,
              textAlign: I18nManager.isRTL ? "right" : "left",
              height: 45,
              borderWidth: 1,
              marginTop: responsiveWidth(30),
            }}
            returnKeyType="next"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            blurOnSubmit={false}
          />
        </View>

        <AnimatedLoadingButton
          ref={(c) => (loadingButton = c)}
          containerStyle={{
            width: "100%",
            height: 50,
            marginTop: responsiveWidth(10),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            paddingHorizontal: responsiveWidth(8),
          }}
          buttonStyle={{
            backgroundColor: settings.settings.color1,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          title={language["Submit"]}
          titleStyle={{
            fontFamily: Fonts.textfont,
            fontSize: responsiveFontSize(2),
            color: Colors.white,
          }}
          onPress={() => onSubmit(email)}
        />
      </View>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "transparent",
          }}
        />
      )}
    </View>
  );
}
