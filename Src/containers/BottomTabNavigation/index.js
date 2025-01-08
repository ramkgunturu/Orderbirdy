import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  I18nManager,
} from "react-native";
import {
  AnimatedTabBarNavigator,
  TabBarIcon,
} from "react-native-animated-nav-tab-bar";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import { Home, Cart, ProductDetails } from "@components";
import {
  MyAccount,
  Shop,
  Wishlist,
  CategoryProducts,
  Offers,
} from "@containers";

import { Images, Fonts, Colors } from "@Themes";
import { createStackNavigator } from "@react-navigation/stack";
const { height, width } = Dimensions.get("screen");
import { Badge } from "react-native-elements";
import { useSelector } from "react-redux";
const Tabs = AnimatedTabBarNavigator();
const Stack = createStackNavigator();

function Shops() {
  return (
    <Stack.Navigator initialRouteName="Shop" headerMode="none">
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
    </Stack.Navigator>
  );
}

function Homes() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigation() {
  const cart = useSelector((state) => state.cart);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Tabs.Navigator
        tabBarOptions={{
          activeTintColor: Colors.white,
          inactiveTintColor: "grey",
          style: {
            backgroundColor: "#FFFFFF",
            elevation: 5,
          },
          labelStyle: {
            textAlign: "center",
            fontSize: responsiveFontSize(1.5),
            color: "white",
            fontFamily: Fonts.textbold,
          },
          indicatorStyle: {
            borderBottomColor: "#87B56A",
            borderBottomWidth: 2,
          },
        }}
        appearance={{
          activeTabBackgrounds: settings.settings.color1
            ? settings.settings.color1
            : Colors.black,
          tabButtonLayout: "horizontal",
          topPadding: responsiveWidth(1.5),

          // floating: true,
        }}
      >
        <Tabs.Screen
          name={language["Home"]}
          component={Homes}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={Images.home}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: color,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={language["Categories"]}
          component={Shops}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={Images.shop}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: color,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name={language["Bag"]}
          component={Cart}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View>
                <Image
                  source={Images.bag}
                  style={{
                    width: responsiveWidth(5),
                    height: responsiveWidth(5),
                    tintColor: color,
                    resizeMode: "contain",
                  }}
                />
                {cart && cart.cartItems.length > 0 ? (
                  <Badge
                    value={cart.cartItems.length}
                    status="error"
                    containerStyle={{
                      position: "absolute",
                      top: focused
                        ? -responsiveWidth(cart.cartItems.length >= 20 ? 7 : 5)
                        : -responsiveWidth(3),
                      right: -responsiveWidth(6),
                      left: focused
                        ? responsiveWidth(16)
                        : responsiveWidth(cart.cartItems.length >= 20 ? 2 : 0),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    badgeStyle={{
                      width: responsiveWidth(
                        cart.cartItems.length >= 20 ? 7 : 5
                      ),
                      height: responsiveWidth(
                        cart.cartItems.length >= 20 ? 7 : 5
                      ),
                      borderRadius:
                        responsiveWidth(cart.cartItems.length >= 20 ? 7 : 5) /
                        2,
                    }}
                  />
                ) : null}
              </View>
            ),
            // tabBarIcon: ({ focused, color, size }) => (
            //   <View>
            //     <Image
            //       source={Images.bag}
            //       style={{
            //         width: responsiveWidth(5),
            //         height: responsiveWidth(5),
            //         tintColor: color,
            //         resizeMode: "contain",
            //       }}
            //     />
            //     <View
            //       style={{
            //         backgroundColor: "red",
            //         position: "absolute",
            //         right: -10,
            //         top: -10,
            //         width: responsiveWidth(5),
            //         height: responsiveWidth(5),
            //         borderRadius: responsiveWidth(5) / 2,
            //         zIndex: 1,
            //         justifyContent: "center",
            //         alignItems: "center",
            //       }}
            //     >
            //       <Text
            //         style={{
            //           fontSize: responsiveFontSize(1.5),

            //           // color: "white",

            //           color: "white",
            //           textAlign: "center",
            //         }}
            //       >
            //         {/* {cart.cartItems.length} */}10
            //       </Text>
            //     </View>
            //   </View>
            // ),
          }}
        />
        {/* <Tabs.Screen
          name={language["Saves"]}
          component={Wishlist}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={Images.heart}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: color,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name={language["offers"]}
          component={Offers}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={Images.offers}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: color,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={language["My Account"]}
          component={MyAccount}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={Images.myaccount}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: color,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />
      </Tabs.Navigator>
    </View>
  );
}
