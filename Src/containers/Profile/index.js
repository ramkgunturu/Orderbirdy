import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  I18nManager,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Header } from "@components";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Images, Fonts, Colors } from "@Themes";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-simple-toast";
import styles from "./styles";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import constants from "@constants";
import Services from "@Services";
import { useNavigation } from "@react-navigation/native";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const Error = ({ display = false }) => {
  // console.log("Toast", display);
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
export default function Profile() {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailidRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [isLoading, setIsLoading] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const navigation = useNavigation();
  loadingButton = React.createRef();
  //   console.log(user, "pppp");
  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(language["Invalid email"])
      .required(language["Email Id is required"]),
    fname: Yup.string().required(language["First Name is required"]),
    // lname: Yup.string().required(language["Last Name is required"]),
    phonenumber: Yup.string()
      .required(language["Phone Number is required"])
      .matches(phoneRegExp, language["Phone Number is not valid"])
      .min(8, language["Must contain 8 digits"])
      .max(8, language["Must contain 8 digits"]),
  });
  function onSubmit(values) {
    // console.log(values, "values");
    loadingButton.setLoading(true);
    Keyboard.dismiss();
    setIsLoading(true);
    var data = {
      member_id: user.id,
      fname: values.fname,
      lname: values.lname,
      phone: values.phonenumber,
    };
    // console.log(data);
    Services(constants.API_BASE_URL + "/update_member", data, "POST").then(
      (response) => {
        // console.log("logginnn", response);
        if (response.status === "Success") {
          //   setUser(response);
          fetchProfile(response.message);
        } else {
          alert(response.message);
          loadingButton.setLoading(false);
          setIsLoading(false);
        }
      }
    );
  }
  function fetchProfile(msg) {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Profile Screen");
    }
    Services(constants.API_BASE_URL + "members/" + user.id).then(
      (responses) => {
        if (responses.status !== "Failed") {
          setUser(responses[0]);
          loadingButton.setLoading(false);
          setIsLoading(false);
          Alert.alert(msg, "", [
            { text: "OK", onPress: () => navigation.pop() },
          ]);
        } else {
          loadingButton.setLoading(false);
          setIsLoading(false);
        }
      }
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Profile"} title="Edit Profile" />
      </View>
      <Formik
        initialValues={{
          email: user ? user.email : "",
          fname: user ? user.fname : "",
          lname: user ? user.lname : "",
          phonenumber: user ? user.phone : "",
        }}
        validationSchema={ValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
        }) => {
          // console.log(errors, "errorserrorserrors")
          return (
            <View style={{ marginHorizontal: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: responsiveWidth(2),
                  borderBottomWidth: 0.5,
                  borderBottomColor: "lightgrey",
                  height: 50,
                  marginTop: responsiveWidth(2),
                }}
              >
                <View style={{ flex: 0.9, justifyContent: "center" }}>
                  <TextInput
                    placeholder={language["First Name"]}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholderTextColor="grey"
                    onChangeText={handleChange("fname")}
                    onBlur={handleBlur("fname")}
                    value={values.fname}
                    style={{
                      width: "100%",
                      fontFamily: Fonts.textfont,
                      textAlign: I18nManager.isRTL ? "right" : "left",
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
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
              {/*  <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: responsiveWidth(2),
                  borderBottomWidth: 0.5,
                  borderBottomColor: "lightgrey",
                  height: 50,
                  marginTop: responsiveWidth(2),
                }}
              >
               <View style={{ flex: 0.9, justifyContent: "center" }}>
                  <TextInput
                    placeholder={language["Last Name"]}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholderTextColor="grey"
                    onChangeText={handleChange("lname")}
                    onBlur={handleBlur("lname")}
                    value={values.lname}
                    style={{
                      width: "100%",
                      fontFamily: Fonts.textfont,
                      textAlign: I18nManager.isRTL ? "right" : "left",
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
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
                  marginHorizontal: responsiveWidth(2),
                  borderBottomWidth: 0.5,
                  borderBottomColor: "lightgrey",
                  height: 50,
                  marginTop: responsiveWidth(2),
                }}
              >
                <View style={{ flex: 0.9, justifyContent: "center" }}>
                  <TextInput
                    placeholder={language["Email Address"]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="grey"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={{
                      width: "100%",
                      fontFamily: Fonts.textfont,
                      textAlign: I18nManager.isRTL ? "right" : "left",
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit={false}
                    editable={false}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
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
                  marginHorizontal: responsiveWidth(2),
                  borderBottomWidth: 0.5,
                  borderBottomColor: "lightgrey",
                  height: 50,
                  marginTop: responsiveWidth(2),
                }}
              >
                <View style={{ flex: 0.9, justifyContent: "center" }}>
                  <TextInput
                    placeholder={language["Phone Number"]}
                    //    ref={(input) => {
                    //      phonenumber = input;
                    //    }}
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    placeholderTextColor="grey"
                    onChangeText={handleChange("phonenumber")}
                    onBlur={handleBlur("phonenumber")}
                    value={values.phonenumber}
                    maxLength={8}
                    style={{
                      width: "100%",
                      fontFamily: Fonts.textfont,
                      textAlign: I18nManager.isRTL ? "right" : "left",
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                  onPress={() =>
                    Toast.showWithGravity(
                      errors.phonenumber,
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
                </TouchableOpacity>
              </View>
              <AnimatedLoadingButton
                ref={(c) => (loadingButton = c)}
                containerStyle={{
                  width: "100%",
                  height: 50,
                  marginTop: responsiveWidth(6),
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(1),
                }}
                buttonStyle={{
                  backgroundColor: settings.settings.color1,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: settings.settings.color1,
                }}
                loadingStyle={{
                  color: Colors.white,
                }}
                title={language["Submit"]}
                titleStyle={{
                  fontFamily: Fonts.textfont,
                  fontSize: responsiveFontSize(2),
                  color: Colors.white,

                  textTransform: "uppercase",
                }}
                onPress={handleSubmit}
              />
            </View>
          );
        }}
      </Formik>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            // backgroundColor: "#0e0e0ebf",
            justifyContent: "center",
          }}
        >
          {/* <ActivityIndicator color="black" size="large" /> */}
        </View>
      )}
    </View>
  );
}
