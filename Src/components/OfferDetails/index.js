import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  I18nManager,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Fonts, Colors } from "@Themes";
import { LanguageContext } from "@context/lang-context";
import { Header, ProductDetails, ProductDetailsParallex } from "@components";
import AutoHeightImage from "react-native-auto-height-image";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { SettingsContext } from "@context/settings-context";
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function OfferDetails(props) {
  const navigation = useNavigation();
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [details, setDetails] = useState([]);
  const regex = /(<([^>]+)>)/gi;

  const routeProductDetails = (item) => {
    setDetails(item.type_id);
    setModalVisibles(true);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          height: responsiveHeight(8),
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header
          title={language["offerdetails"]}
          screen={"MyOrders"}
          navigation={props.navigation}
        />
      </View>
      <ScrollView style={{ flex: 0.91 }}>
        {/* <Image
          source={{ uri: props.route.params.offerData.item.image }}
          resizeMode="cover"
          style={{ width: responsiveWidth(100), height: responsiveWidth(55) }}
        /> */}
        <AutoHeightImage
          width={responsiveWidth(100)}
          source={{ uri: props.route.params.offerData.item.image }}
          ImageCacheEnum={"only-if-cached"}
          PlaceholderContent={
            <View
              style={{
                width: responsiveWidth(100),
                height: responsiveWidth(50),
                backgroundColor: Colors.white,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          }
        />
        <View
          style={{
            flex: 0.1,
            backgroundColor: Colors.lightgrey,
            paddingTop: responsiveWidth(1),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(2),
              color: Colors.black,
              textTransform: "capitalize",
            }}
          >
            {I18nManager.isRTL
              ? props.route.params.offerData.item.title_ar
              : props.route.params.offerData.item.title}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: Fonts.textbold,
            fontSize: responsiveFontSize(1.8),
            padding: responsiveWidth(2),
            color: Colors.black,
            textAlign: "left",
            textTransform: "capitalize",
          }}
        >
          {I18nManager.isRTL
            ? props.route.params.offerData.item.description_ar.replace(
                regex,
                ""
              )
            : props.route.params.offerData.item.description.replace(regex, "")}
        </Text>
      </ScrollView>
      <View style={{ flex: 0.09 }}>
        <TouchableOpacity
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: settings.settings.color1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: responsiveWidth(2),
            flexDirection: "row",
            marginHorizontal: responsiveWidth(1),
            paddingHorizontal: responsiveWidth(2),
            borderRadius: 5,
            marginBottom: responsiveWidth(2),
            backgroundColor: settings.settings.color1,
          }}
          onPress={() =>
            props.route.params.offerData.item.type.toLowerCase() === "product"
              ? routeProductDetails(props.route.params.offerData.item)
              : navigation.push("CategoryProducts", {
                  item: props.route.params.offerData.item,
                  title: I18nManager.isRTL
                    ? props.route.params.offerData.item.title_ar
                    : props.route.params.offerData.item.title,
                  route: "home",
                  banner: "category",
                })
          }
        >
          <Text
            style={{
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(2),
              color: Colors.white,
              textTransform: "capitalize",
            }}
          >
            {/* {language["viewdetails"]} */}
            {I18nManager.isRTL
              ? props.route.params.offerData.item.sub_title_ar
              : props.route.params.offerData.item.sub_title}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fadeIn"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="slideOutDown"
        animationOutTiming={800}
        transparent={false}
        visible={modalVisibles}
        onRequestClose={() => {
          setModalVisibles(false);
        }}
      >
        {settings.settings.product_view === "1" ? (
          <ProductDetails
            details={details}
            onClose={() => setModalVisibles(false)}
          />
        ) : (
          <ProductDetailsParallex
            details={details}
            onClose={() => setModalVisibles(false)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
