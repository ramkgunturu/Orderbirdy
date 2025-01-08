import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  I18nManager,
  SafeAreaView,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableHighlight,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images, Fonts, Colors } from "@Themes";
import { Header, InputField } from "@components";

import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-simple-toast";
import constants from "@constants";
import Services from "@Services";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import DeviceInfo from "react-native-device-info";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const url = constants.AAPI_BASE_URL;

const Error = ({ display = false }) => {
  const viewElement = useRef(null);

  useEffect(() => {
    if (display) {
      viewElement.current.animate("shake", 500);
    } else {
      viewElement.current.animate("bounceOut", 500);
    }
  }, [display]);

  const viewStyles = [styles.error, { opacity: 0 }];

  if (display) {
    viewStyles.push({ opacity: 1 });
  }

  return (
    <Animatable.View style={viewStyles} ref={viewElement}>
      <Text style={styles.errorText}>X</Text>
    </Animatable.View>
  );
};

export default function SignIn(props) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  loadingButton = React.createRef();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(language["Invalid email"])
      .required(language["Email Id is required"]),
    password: Yup.string().required(language["Password is required"]),
  });
  // console.log(props.route.params.routeFrom);
  const onSubmit = (values, { resetForm }) => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("SignIn Screen");
    }
    loadingButton.setLoading(true);
    Keyboard.dismiss();
    setIsLoading(true);
    var data = {
      email: values.email,
      password: values.password,
    };
    Services(constants.API_BASE_URL + "/login", data, "POST").then(
      (response) => {
        // console.log("logginnn", response);
        if (response.status === "1") {
          setUser(response);
          getFcmToken(response.id);
          AsyncStorage.setItem("userDetails", response.id);
          loadingButton.setLoading(false);
          setIsLoading(false);
          resetForm({});
          if (props.route && props.route.params.routeFrom === "SignInList") {
            navigation.pop(2);
          } else {
            props.onCloseSignIn();
          }
        } else {
          alert(response.message);
          loadingButton.setLoading(false);
          setIsLoading(false);
        }
      }
    );
  };

  const getFcmToken = async (userId) => {
    let update = "false";
    const fcmToken = await messaging().getToken();
    const deviceId = DeviceInfo.getUniqueId();
    // console.log(fcmToken, "token");
    if (fcmToken) {
      var deviceToken = {
        member_id: userId.toString(),
        device_id: deviceId,
        device_token: fcmToken,
        type: Platform.OS === "android" ? "android" : "ios",
      };

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
            update = true;
          }
        }
      } catch (error) {
        alert(error);
      }

      if (update) {
        console.log(deviceToken);
        Services(
          constants.API_BASE_URL + "member_device_token",
          deviceToken,
          "POST"
        ).then((deviceResponse) => {
          // console.log(deviceResponse, "deviceResponse");
          if (deviceResponse.status === "Success") {
            // console.log("OKOK");
            update = false;
          } else {
            update = false;
          }
        });
      }
    } else {
      // console.log("Failed", "No token received");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <View
          style={{
            height: responsiveHeight(8),
            backgroundColor: Colors.white,
            borderBottomWidth: 1,
            borderBottomColor: Colors.lightgrey,
          }}
        >
          <Header
            screen={"SignIn"}
            title={language["LOGIN"]}
            // route={
            //   props && props.route ? props.route.params.routeFrom : "SignIn"
            // }
            // onClose={props && props.route ? null : props.onCloseSignIn}

            route={props && props.route ? props.route.params.routeFrom : null}
            onClose={props && props.route ? null : props.onCloseSignIn}
          />
        </View>
        <ScrollView>
          {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="position"
            keyboardVerticalOffset="25"
          > */}
          <Text style={styles.headerText}>
            {
              language[
              "If you already have an account with us, please login here."
              ]
            }
          </Text>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              values,
            }) => {
              return (
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 0.6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 1,
                        marginHorizontal: responsiveWidth(10),
                        borderWidth: 0.5,
                        borderColor: "lightgrey",
                        borderRadius: 25,
                        marginTop: responsiveWidth(15),
                        paddingLeft: responsiveWidth(4),
                        backgroundColor: "white",
                        shadowOpacity: 0.5,
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: "grey",
                        elevation: 5,
                      }}
                    >
                      <View style={{ flex: 0.9, justifyContent: "center" }}>
                        <TextInput
                          placeholder={language["Email Id"]}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            passwordInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.email,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.email && touched.email ? (
                          <Error display={errors.email && touched.email} />
                        ) : null}
                      </TouchableOpacity>
                    </View>

                    {/* {errors.email && touched.email ? (
                        <Text
                          style={{
                            color: "red",
                            fontSize: responsiveFontSize(1.5),
                            marginTop: responsiveHeight(1),
                            marginHorizontal: responsiveWidth(14),
                            textAlign: "left",
                          }}
                        >
                          {errors.email}
                        </Text>
                      ) : null} */}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 1,
                        marginHorizontal: responsiveWidth(10),
                        borderWidth: 0.5,
                        borderColor: "lightgrey",
                        borderRadius: 25,
                        marginTop: responsiveWidth(6),
                        paddingLeft: responsiveWidth(4),
                        backgroundColor: "white",
                        shadowOpacity: 0.5,
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: "grey",
                        elevation: 5,
                      }}
                    >
                      <View style={{ flex: 0.9, justifyContent: "center" }}>
                        <TextInput
                          placeholder={language["Password"]}
                          ref={(input) => {
                            passwordInput = input;
                          }}
                          secureTextEntry
                          returnKeyType="done"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          onSubmitEditing={() => Keyboard.dismiss()}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.password,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.password && touched.password ? (
                          <Error
                            display={errors.password && touched.password}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>

                    {/* {errors.password && touched.password ? (
                        <Text
                          style={{
                            color: "red",
                            fontSize: responsiveFontSize(1.5),
                            marginTop: responsiveHeight(1),
                            marginHorizontal: responsiveWidth(14),
                            textAlign: "left",
                          }}
                        >
                          {errors.password}
                        </Text>
                      ) : null} */}

                    <AnimatedLoadingButton
                      ref={(c) => (loadingButton = c)}
                      containerStyle={{
                        width: "100%",
                        height: 50,
                        marginTop: responsiveWidth(6),
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: responsiveWidth(8),
                        color: settings.settings.color1,
                      }}
                      buttonStyle={{
                        backgroundColor: settings.settings.color1,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: settings.settings.color1,
                      }}
                      loadingStyle={{
                        color: Colors.white,
                      }}
                      title={language["LOGIN"]}
                      titleStyle={{
                        fontFamily: Fonts.textfont,
                        fontSize: responsiveFontSize(2),
                        color: Colors.white,
                      }}
                      onPress={handleSubmit}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      flex: 0.2,
                      paddingTop: responsiveWidth(5),
                      paddingBottom: responsiveWidth(3),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (
                        props.route &&
                        props.route.params.routeFrom === "SignInList"
                      ) {
                        navigation.push("SignUp", { routeFrom: "SignInList" });
                      } else {
                        props && props.route ? null : props.onCloseSignIn();
                        navigation.push("SignUp", { routeFrom: "signin" });
                      }
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: responsiveFontSize(2),
                        fontFamily: Fonts.textfont,
                        color: Colors.grey,
                        textTransform: "capitalize",
                      }}
                    >
                      {language["create a new account"] + "?"}
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: responsiveFontSize(2),
                          fontFamily: Fonts.textfont,

                          color: Colors.lightblack,
                        }}
                      >
                        {" "}
                        {language["Sign Up"]}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 0.2,
                      paddingTop: responsiveWidth(0),
                      paddingBottom: responsiveWidth(3),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (
                        props.route &&
                        props.route.params.routeFrom === "SignInList"
                      ) {
                        navigation.push("ForgetPassword", {
                          routeFrom: "SignInList",
                        });
                      } else {
                        props && props.route ? null : props.onCloseSignIn();
                        navigation.push("ForgetPassword", {
                          routeFrom: "signin",
                        });
                      }
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: responsiveFontSize(2),
                        fontFamily: Fonts.textfont,
                        color: Colors.grey,
                        textTransform: "capitalize",
                      }}
                    >
                      Forget password ?
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
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
    </SafeAreaView>
  );
}
