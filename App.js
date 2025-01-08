/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * var BOTTOM_PADDING_IPHONE_X = 30 value set to 15 in react-native-animated-nav-tab-bar(index.js)
 * React native picker select index file is commented from line 290 to 330 because RTL is not supported
 * React native picker select styles modalViewBottom  background color is changed to white
 * and also in static defaultProps placholder is commented
 *  doneText: I18nManager.isRTL?"تم":'Done' in default props,
 */

import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  I18nManager,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import Navigation from "@Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "@context/user-context";
import configureStore from "./Src/redux/configureStore"; // store
import { Provider } from "react-redux"; //redux
import { PersistGate } from "redux-persist/es/integration/react"; //redux
import Services from "@Services";
import constants from "@constants";
import * as Animatable from "react-native-animatable";
import { Fonts, Images } from "@Themes";
import { SettingsContext } from "@context/settings-context";
import { CountryContext } from "@context/country-context";

import { LanguageContext } from "@context/lang-context";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import DeviceInfo from "react-native-device-info";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { Settings } from 'react-native-fbsdk-next';
import { getTrackingStatus, requestTrackingPermission } from "react-native-tracking-transparency";
import { TrackingPermissionContext } from "@context/tracking-permission";

const { persistor, store } = configureStore(); // store
const url = constants.API_BASE_URL;

const App: () => React$Node = () => {
  const [language, setLanguage] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [trackingPermission, setTrackingPermission] = useState(null);
  const [country, setCountry] = useState(null);
  const valueCountry = useMemo(() => ({ country, setCountry }), [
    country,
    setCountry,
  ]);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const valueSettings = useMemo(() => ({ settings, setSettings }), [
    settings,
    setSettings,
  ]);
  const valueLang = useMemo(() => ({ language, setLanguage }), [
    language,
    setLanguage,
  ]);

  const valueTrackingPermission = useMemo(() => ({ trackingPermission, setTrackingPermission }), [
    trackingPermission,
    setTrackingPermission,
  ]);

  useEffect(() => {
    checkTrackingTransparency()
    // AsyncStorage.removeItem("CountryDetails");
    // AsyncStorage.removeItem("language");
    // setLanguage(null);
    // setCountry(null);
    Settings.initializeSDK();
    setSpinner(true);
    getCountry();
    requestUserPermission();
    // fetchNotifications();
    fetchAppData();
  }, []);

  // const fetchNotifications = () => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert(
  //       "Notitication",
  //       JSON.stringify(remoteMessage.notification.body)
  //     );
  //   });
  //   return unsubscribe;
  // };

  const checkTrackingTransparency = async () => {

    let trackingStatus = await getTrackingStatus();

    if (trackingStatus === 'not-determined') {
      trackingStatus = await requestTrackingPermission();
    }
    // console.log(trackingStatus, "trackingStatus")
    setTrackingPermission(trackingStatus);
  }

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      // ... other permission settings
    });

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      getFcmToken(0);
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      // console.log("User has provisional notification permissions.");
    } else {
      // console.log("User has notification permissions disabled");
    }
  };

  const getFcmToken = async (userId) => {
    let update = false;
    const fcmToken = await messaging().getToken();
    const deviceId = DeviceInfo.getUniqueId();
    console.log(fcmToken, "fcmtoken");
    // // console.log(fcmToken, "token");
    // alert("OKOK1");
    // alert(fcmToken, "fcmToken");
    // alert(deviceId, "deviceId");
    if (fcmToken) {
      // alert("OKOK2");
      var deviceToken = {
        member_id: userId.toString(),
        device_id: deviceId,
        device_token: fcmToken,
        type: Platform.OS === "android" ? "android" : "ios",
      };
      // alert(deviceToken);
      try {
        const deviceInformation = await AsyncStorage.getItem("deviceInfo");
        if (deviceInformation === null) {
          AsyncStorage.setItem("deviceInfo", JSON.stringify(deviceToken));
          update = true;
        } else {
          if (
            deviceInformation.device_token === fcmToken &&
            deviceInformation.device_id === deviceId
          ) {
            update = false;
          } else {
            // alert("updating");
            update = true;
          }
        }
      } catch (error) {
        alert(error);
      }
      // alert("OKOK4");
      if (update) {
        // console.log(deviceToken);
        // alert(deviceToken);
        Services(
          constants.API_BASE_URL + "member_device_token",
          deviceToken,
          "POST"
        ).then((deviceResponse) => {
          // console.log(deviceResponse, "deviceResponse");
          if (deviceResponse.status === "Success") {
            // alert(deviceResponse);
            update = false;
          } else {
            update = false;
          }
        });
      }
    } else {
      // alert("OKOKcancel");
      // console.log("Failed", "No token received");
    }
  };

  const fetchAppData = () => {
    Services(constants.API_BASE_URL).then((responses) => {
      if (responses) {
        responses.countries.map((res, key) => {
          res.label = I18nManager.isRTL ? res.title_ar : res.title;
          res.value = res.id;
        });
        setSettings(responses);
        getLanguage(responses);
        getCountry();
      }
    });
  };

  const getCountry = async () => {
    // console.log(responses);
    try {
      const countrylang = await AsyncStorage.getItem("CountryDetails");
      setCountry(JSON.parse(countrylang));
    } catch (error) {
      alert(error);
    }
  };

  const getLanguage = async (responses) => {
    // console.log(responses);
    try {
      const lang = await AsyncStorage.getItem("language");
      // console.log(lang, "---lang");
      if (lang) {
        if (lang === "arabic") {
          // console.log(lang, "---language");
          I18nManager.forceRTL(true);
          setLanguage(responses.words.ar);

          setSpinner(false);
        } else if (lang === "english") {
          I18nManager.forceRTL(false);
          setLanguage(responses.words.en);
          setSpinner(false);
        }
      } else {
        // AsyncStorage.setItem("language", "english");
        // I18nManager.forceRTL(false);
        // setLanguage(responses.words.en);
        setSpinner(false);
      }
      fetchUserData();
      // fetchUserData();
    } catch (error) {
      setSpinner(false);
      // Error retrieving data
      alert(error);
    }
  };

  const fetchUserData = async () => {
    // AsyncStorage.removeItem("userDetails");
    try {
      const value = await AsyncStorage.getItem("userDetails");

      // console.log(value, "value");
      if (value) {
        const userData = JSON.parse(value);
        // console.log(userData, "--userdata");
        Services(constants.API_BASE_URL + "/members/" + value).then(
          (response) => {
            if (response.status !== "Failed") {
              getFcmToken(value);
              setUser(response[0]);
              setSpinner(false);
            } else {
              setSpinner(false);
            }
          }
        );
      } else {
        // console.log("trigger");
        getFcmToken(0);
        setSpinner(false);
      }
    } catch (error) {
      setSpinner(false);
      // Error retrieving data
      alert(error);
    }
  };

  const zoomOut = {
    0: {
      opacity: 1,
      scale: 0.3,
    },
    0.1: {
      opacity: 1,
      scale: 0.5,
    },
    0.4: {
      opacity: 1,
      scale: 0.6,
    },
    0.5: {
      opacity: 1,
      scale: 1,
    },
    0.7: {
      opacity: 1,
      scale: 1.5,
    },
    1: {
      opacity: 1,
      scale: 2,
    },
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar barStyle="dark-content" />
        {spinner ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageBackground
              source={Images.splash}
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(100),
              }}
            />
          </View>
        ) : (
          <LanguageContext.Provider value={valueLang}>
            <CountryContext.Provider value={valueCountry}>
              <SettingsContext.Provider value={valueSettings}>
                <UserContext.Provider value={value}>
                  <TrackingPermissionContext.Provider value={valueTrackingPermission}>
                    <Provider store={store}>
                      <PersistGate persistor={persistor}>
                        <Navigation />
                        {/* <RootContainer /> */}
                      </PersistGate>
                    </Provider>
                  </TrackingPermissionContext.Provider>
                </UserContext.Provider>
              </SettingsContext.Provider>
            </CountryContext.Provider>
          </LanguageContext.Provider>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

export default App;
