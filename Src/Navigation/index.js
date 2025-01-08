import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CountryContext } from "@context/country-context";
import { LanguageContext } from "@context/lang-context";
import * as Animatable from "react-native-animatable";
import { SettingsContext } from "@context/settings-context";
import { Fonts } from "@Themes";
import constants from "@constants";
import {
  BottomTabNavigation,
  CategoryProducts,
  CheckOut,
  SignInList,
  GuestCheckOut,
  Payment,
  MyOrders,
  MyAddress,
  SelectCountry,
  SelectLanguage,
  Profile,
  ForgetPassword,
  AboutUs,
  Search,
  OrderTracking,
  Offers,
} from "@containers";
import {
  Cart,
  SignIn,
  SignUp,
  ProductDetails,
  ProductDetailsParallex,
  AddAddress,
  Address,
  AddressList,
  OfferDetails,
} from "@components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images } from "@Themes";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const Stack = createStackNavigator();

function InitalStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="SelectCountry" component={SelectCountry} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
    </Stack.Navigator>
  );
}
function LangStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
    </Stack.Navigator>
  );
}
function HomeScreen() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
      />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CheckOut" component={CheckOut} />
      <Stack.Screen name="GuestCheckOut" component={GuestCheckOut} />
      <Stack.Screen name="SignInList" component={SignInList} />
      <Stack.Screen name="AddressList" component={AddressList} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="MyAddress" component={MyAddress} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="OrderTracking" component={OrderTracking} />
      <Stack.Screen name="Offers" component={Offers} />
      <Stack.Screen name="OfferDetails" component={OfferDetails} />
      <Stack.Screen
        name="ProductDetailsParallex"
        component={ProductDetailsParallex}
      />
    </Stack.Navigator>
  );
}

export default function Navigation(props) {
  const { country, setCountry } = useContext(CountryContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);

  useEffect(() => {
    if (settings.countries && settings.countries.length === 1) {
      AsyncStorage.setItem(
        "CountryDetails",
        JSON.stringify(settings.countries[0])
      );

      setCountry(settings.countries[0]);
    }
    getLanguage();
  }, [language]);

  const getLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("language");

      if (lang === "arabic") {
        // console.log(lang, "---language");
        I18nManager.forceRTL(true);
        setLanguage(settings.words.ar);
        setSpinner(false);
      } else if (lang === "english") {
        setLanguage(settings.words.en);
        I18nManager.forceRTL(false);
      }
    } catch (error) {}
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
    <NavigationContainer>
      {country !== null && language !== null ? (
        <HomeScreen />
      ) : country ? (
        <LangStack />
      ) : (
        <InitalStack />
      )}
    </NavigationContainer>
  );
}
