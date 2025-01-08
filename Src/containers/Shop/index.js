import React, { useState, useEffect, useContext } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Platform,
  I18nManager,
  ImageBackground,
  ScrollView,
  Settings,
} from "react-native";
import Services from "@Services";
import constants from "@constants";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Fonts, Colors } from "@Themes";
import { Header, SingUp, InputField } from "@components";
// import { Content } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Skeleton from "./Skeleton";
import { LanguageContext } from "@context/lang-context";
import AutoHeightImage from "react-native-auto-height-image";
import * as Animatable from "react-native-animatable";
import { SettingsContext } from "@context/settings-context";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

const { width, height } = Dimensions.get("screen");
const SPACING = responsiveWidth(3);
const AVATAR_SIZE = responsiveWidth(35);
const ITEM_SIZE = AVATAR_SIZE + SPACING * responsiveWidth(0.3);

export default function Shop() {
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);
  const [textinput, setTextInput] = useState("");
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [imageLoader, setImageLoader] = useState(true);

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Categories Screen");
    }
    setSpinner(true);
    fetchData();
  }, []);

  const fetchData = () => {

    Services(constants.API_BASE_URL + "categories_full").then((response) => {
      // console.log(response, "responseresponseresponse");
      if (response) {
        setData(response.categories);
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const _renderImage = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() =>
          item.type === ""
            ? null
            : navigation.push("CategoryProducts", {
              item: item,
              title: I18nManager.isRTL ? item.title_ar : item.title,
              route: "shop",
            })
        }
      >
        <Animatable.View
          animation="bounceIn"
          easing="ease-in"
          duration={1500}
          iterationCount={1}
        >
          <AutoHeightImage
            width={responsiveWidth(49.8)}
            margin={responsiveWidth(1)}
            source={{ uri: item.image }}
            onLoadStart={() => setImageLoader(true)}
            onLoad={() => setImageLoader(false)}
            ImageCacheEnum={"only-if-cached"}
            PlaceholderContent={
              <View
                style={{
                  width: responsiveWidth(49.8),
                  height: responsiveWidth(40),
                  backgroundColor: Colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <ActivityIndicator color="black" /> */}
              </View>
            }
          ></AutoHeightImage>
          <View
            style={{
              width: responsiveWidth(49.8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: responsiveFontSize(1.6),
                textAlign: "center",
                fontFamily: Fonts.textmedium,
                paddingVertical: responsiveWidth(4),
              }}
            >
              {I18nManager.isRTL ? item.title_ar : item.title}
            </Text>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.3,
        borderBottomColor: Colors.lightgrey,
      }}
    >
      <View
        style={{
          height: responsiveHeight(Platform.OS === "android" ? 8 : 6),
          backgroundColor: Colors.white,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Shop"} title={language["Categories"]} />
      </View>

      {spinner ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {data && data.length > 0 ? (
              <Animated.FlatList
                data={data}
                renderItem={_renderImage}
                initialNumToRender={2}
                keyExtractor={(item) => item.id}
                numColumns={2}
                style={{
                  // marginBottom: 10,
                  marginTop: responsiveWidth(2),
                  marginBottom: responsiveWidth(3),
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.4),
                    color: Colors.black,
                    paddingTop: responsiveHeight(2),

                    fontFamily: Fonts.textbold,
                  }}
                >
                  {language["No Data"]}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
