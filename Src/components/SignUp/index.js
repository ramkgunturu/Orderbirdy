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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import { Images, Fonts, Colors } from "@Themes";
import { Header, SingUp, InputField } from "@components";
// import { Content } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-simple-toast";
import constants from "@constants";
import Services from "@Services";
import { LanguageContext } from "@context/lang-context";
import DeviceInfo from "react-native-device-info";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailidRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

const { height, width } = Dimensions.get("screen");

export default function SignUp(props) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { user, setUser } = useContext(UserContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  loadingButton = React.createRef();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(language["Invalid email"])
      .required(language["Email Id is required"])
      .matches(emailidRegExp, language["Email is not valid"]),
    password: Yup.string().required(language["Password is required"]),
    fname: Yup.string().required(language["First Name is required"]),
    // lname: Yup.string().required(language["Last Name is required"]),
    // cpassword: Yup.string()
    //   .required(language["Confirm Password is required"])
    //   .oneOf([Yup.ref("password"), null], language["Passwords must match"]),

    phonenumber: Yup.string()
      .matches(phoneRegExp, language["Phone Number is not valid"])
      .min(8, language["Must contain 8 digits"])
      .max(8, language["Must contain 8 digits"]),
  });

  function onSubmit(values, { resetForm }) {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("SignUp Screen");
      AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
        [AppEventsLogger.AppEventParams.RegistrationMethod]: "email",
      });
    }
    loadingButton.setLoading(true);
    Keyboard.dismiss();
    setIsLoading(true);

    var data = {
      fname: values.fname,
      lname: values.lname ? values.lname : "",
      email: values.email,
      phone: values.phonenumber,
      password: values.password,
    };
    console.log(constants.API_BASE_URL + "register", data);
    Services(constants.API_BASE_URL + "register", data, "POST").then(
      (response) => {
        if (response.status === "Success") {
          getFcmToken(response.member_id);
          AsyncStorage.setItem("userDetails", response.member_id);
          fetchData(response.member_id, { resetForm });
        } else {
          loadingButton.setLoading(false);
          alert(response.message);
          loadingButton.setLoading(false);
          setIsLoading(false);
        }
      }
    );
  }
  function fetchData(id, { resetForm }) {
    loadingButton.setLoading(true);

    Services(constants.API_BASE_URL + "members/" + id).then((responses) => {
      // console.log(responses);
      if (responses) {
        setUser(responses[0]);
        loadingButton.setLoading(false);
        setIsLoading(false);
        resetForm({});
        if (props && props.route) {
          navigation.pop(2);
        } else {
          navigation.pop(2);
        }
      } else {
        loadingButton.setLoading(false);
        setIsLoading(false);
      }
    });

    setIsLoading(false);
    if (props && props.route) {
      navigation.pop(2);
    } else {
      props.onCloseSignUp();
    }
  }
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
        // console.log(deviceToken);
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
            screen={"SignUp"}
            title={language["create an account"]}
            route={
              props && props.route ? props.route.params.routeFrom : "SignUp"
            }
            onClose={props && props.route ? null : props.onCloseSignUp}
          />
        </View>
        <ScrollView>
          {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="position"
            keyboardVerticalOffset="25"
          > */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              fname: "",
              lname: "",
              phonenumber: "",
              cpassword: "",
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
                      // backgroundColor: 'yellow',
                      // justifyContent: "center",
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
                        marginTop: responsiveWidth(10),
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
                          placeholder={language["Full Name"]}
                          keyboardType="default"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("fname")}
                          onBlur={handleBlur("fname")}
                          value={values.fname}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            emailInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.fname,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.fname && touched.fname ? (
                          <Error display={errors.fname && touched.fname} />
                        ) : null}
                      </TouchableOpacity>
                    </View>

                    {/* <View
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
                          ref={(input) => {
                            lname = input;
                          }}
                          placeholder={language["Last Name"]}
                          keyboardType="default"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("lname")}
                          onBlur={handleBlur("lname")}
                          value={values.lname}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            emailInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.lname,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.lname && touched.lname ? (
                          <Error display={errors.lname && touched.lname} />
                        ) : null}
                      </TouchableOpacity>
                    </View> */}

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
                          placeholder={language["Email Address"]}
                          ref={(input) => {
                            emailInput = input;
                          }}
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
                            phonenumber.focus();
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
                          placeholder={language["Phone Number"]}
                          ref={(input) => {
                            phonenumber = input;
                          }}
                          keyboardType="decimal-pad"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("phonenumber")}
                          onBlur={handleBlur("phonenumber")}
                          value={values.phonenumber}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          maxLength={8}
                          onSubmitEditing={() => {
                            passwordInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      {/* <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.email,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.phonenumber && touched.phonenumber ? (
                          <Error
                            display={errors.phonenumber && touched.phonenumber}
                          />
                        ) : null}
                      </TouchableOpacity> */}
                    </View>

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
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          blurOnSubmit={false}
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
                    {/* <View
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
                          placeholder={language["Confirm Password"]}
                          ref={(input) => {
                            cpasswordInput = input;
                          }}
                          secureTextEntry
                          returnKeyType="done"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("cpassword")}
                          onBlur={handleBlur("cpassword")}
                          value={values.cpassword}
                          style={{
                            paddingLeft: responsiveWidth(4),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            Keyboard.dismiss();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.cpassword,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.cpassword && touched.cpassword ? (
                          <Error
                            display={errors.cpassword && touched.cpassword}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View> */}

                    <AnimatedLoadingButton
                      ref={(c) => (loadingButton = c)}
                      containerStyle={{
                        width: "100%",
                        height: 50,
                        marginTop: responsiveWidth(6),
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: responsiveWidth(8),
                      }}
                      buttonStyle={{
                        backgroundColor: settings.settings.color1,
                        borderWidth: 1,
                        borderColor: settings.settings.color1,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      loadingStyle={{
                        color: Colors.white,
                      }}
                      title={language["REGISTER"]}
                      titleStyle={{
                        fontFamily: Fonts.textfont,
                        fontSize: responsiveFontSize(2),
                        color: Colors.white,
                      }}
                      onPress={handleSubmit}
                    />
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      flex: 0.2,
                      paddingTop: responsiveWidth(5),
                      paddingBottom: responsiveWidth(3),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      props && props.route ? null : props.onCloseSignUp();
                      navigation.push("SignIn", { routeFrom: "signup" });
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: responsiveFontSize(2),
                        fontFamily: Fonts.textfont,
                        color: Colors.grey,
                      }}
                    >
                      {"Already have an account ?"}
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: responsiveFontSize(2),
                          fontFamily: Fonts.textfont,
                       
                          color: Colors.lightblack,
                        }}
                      >
                        {" "}
                        {"Sign In"}
                      </Text>
                    </Text>
                  </TouchableOpacity>*/}
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
