import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, I18nManager } from "react-native";
import styles from "./styles";
import { Images } from "@Themes";
import { useNavigation } from "@react-navigation/native";
import { LanguageContext } from "@context/lang-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { SettingsContext } from "@context/settings-context";
import { responsiveWidth } from "react-native-responsive-dimensions";

export default function Header(props) {
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const navigation = useNavigation();
  // console.log('header--', props);
  function onPressLeftarrow() {
    if (
      (props.screen === "SignIn" && props.route === "SignInList") ||
      (props.screen === "SignUp" && props.route === "SignInList")
    ) {
      navigation.goBack();
    } else {
      navigation.popToTop();
    }
  }

  function onPressLeftClose() {
    props.onClose();
  }

  function onPressLeft() {
    if (
      props.screen === "CheckOut" ||
      props.screen === "AddAddress" ||
      props.screen === "MyAddresses" ||
      props.screen === "MyOrders" ||
      props.screen === "Profile" ||
      props.screen === "ForgetPassword"
    ) {
      navigation.goBack();
    } else {
      navigation.popToTop();
    }
  }

  const languageChange = async () => {
    // console.log(responses);

    try {
      const lang = await AsyncStorage.getItem("language");

      if (lang) {
        if (lang === "arabic") {
          I18nManager.forceRTL(false);
          AsyncStorage.setItem("language", "english");
        } else if (lang === "english") {
          I18nManager.forceRTL(true);
          AsyncStorage.setItem("language", "arabic");
        }

        RNRestart.Restart();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.mainView}>
      {props.screen === "Home" ? (
        <View
          style={[
            {
              flex: 0.85,
              justifyContent: "center",
              paddingHorizontal: responsiveWidth(1),
            },
          ]}
        >
          <Image style={styles.ImageStyle} source={Images.logo} />
        </View>
      ) : props.screen === "My Youe" ? (
        <View style={styles.menuImageView} />
      ) : props.screen === "Home" ||
        (props.screen === "Cart" && props.route === "ProductDetails") ? (
        <TouchableOpacity
          style={styles.userImageView}
          onPress={() => onPressLeftarrow()}
        >
          <Image
            style={styles.userAlterImageStyle}
            source={Images.frontarrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : props.screen === "Category" ||
        props.screen === "CheckOut" ||
        props.screen === "SignInList" ||
        props.screen === "AddAddress" ||
        props.screen === "MyAddresses" ||
        props.screen === "MyOrders" ||
        props.screen === "Profile" ||
        props.screen === "ForgetPassword" ? (
        <TouchableOpacity
          style={styles.userImageView}
          onPress={() => onPressLeft()}
        >
          {I18nManager.isRTL ? (
            <Image
              style={styles.userAlterImageStyle}
              source={Images.backarrow}
              resizeMode="contain"
            />
          ) : (
            <Image
              style={styles.userAlterImageStyle}
              source={Images.frontarrow}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      ) : (props.screen === "SignIn" || props.screen === "SignUp") &&
        (props.route === "signup" || props.route === "SignInList") ? (
        <TouchableOpacity
          style={styles.userImageView}
          onPress={() => onPressLeftarrow()}
        >
          <Image
            style={styles.userAlterImageStyle}
            source={Images.frontarrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : props.screen === "SignUp" && props.route === "signin" ? (
        <TouchableOpacity
          style={styles.userImageView}
          onPress={() => onPressLeftarrow()}
        >
          <Image
            style={styles.userAlterImageStyle}
            source={Images.frontarrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : props.screen !== "Shop" &&
        props.screen !== "Cart" &&
        props.screen !== "Saves" &&
        props.screen !== "SignInList" ? (
        <TouchableOpacity
          style={styles.userImageView}
          onPress={() => onPressLeftClose()}
        >
          <Image
            style={styles.userAlterImageStyle}
            source={Images.close}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.userImageView} />
      )}
      {props.screen === "Home" ? null : (
        <View style={styles.userTitleView}>
          {/* <Image style={styles.ImageStyle} source={Images.logo} /> */}
          <Text style={styles.userTitleStyle}>{props.title}</Text>
        </View>
      )}
      {props.screen !== "Home" &&
      props.screen !== "SignIn" &&
      props.screen !== "SignUp" &&
      props.screen !== "CheckOut" &&
      props.screen !== "SignInList" &&
      props.screen !== "AddAddress" &&
      props.screen !== "MyAddresses" &&
      props.screen !== "My Youe" &&
      props.screen !== "Shop" &&
      props.screen !== "MyOrders" &&
      props.screen !== "Profile" &&
      props.screen !== "ForgetPassword" ? (
        <TouchableOpacity
          style={styles.CartImageView}
          // onPress={() => navigation.push("Cart")}
        >
          <Image style={styles.CartImageStyle} source={Images.search} />
        </TouchableOpacity>
      ) : props.screen === "SignInList" ? null : props.screen === // </TouchableOpacity> //   <Text style={styles.guestTextStyle}>{language["Guest"]}</Text> // > //   }} //     navigation.push("GuestCheckOut"); //   onPress={() => { //   style={styles.guestStyle} // <TouchableOpacity
        "MyAddresses" ? (
        <TouchableOpacity
          style={styles.guestStyle}
          onPress={() => {
            navigation.push("AddAddress");
          }}
        >
          <Image style={styles.CartImageStyle} source={Images.add} />
        </TouchableOpacity>
      ) : props.screen === "Home" ? (
        <View style={styles.menuImageView}>
          <TouchableOpacity
            style={[
              styles.languageStyle,
              { backgroundColor: settings.settings.color1 },
            ]}
            onPress={() => {
              languageChange();
            }}
          >
            {I18nManager.isRTL ? (
              <Image style={styles.languageImageStyle} source={Images.en} />
            ) : (
              <Image style={styles.languageImageStyle} source={Images.ar} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.menuImageView} />
      )}
    </View>
  );
}
