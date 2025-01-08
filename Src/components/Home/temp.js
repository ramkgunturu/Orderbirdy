import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Colors, Images, Fonts } from "@Themes";
import { Header, ProductRow } from "@components";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Services from "@Services";
import constants from "@constants";
import Skeleton from "./Skeleton";

const _renderItem = ({ item, index }) => {
  return (
    <ProductRow
      item={item}
      onPressModal={() => onPressModal(item)}
      index={index}
      textdisplay={false}
    />
  );
};
const _renderItem1 = ({ item, index }) => {
  return (
    <ProductRow
      item={item}
      onPressModal={() => onPressModal(item)}
      index={index}
      textdisplay={true}
    />
  );
};

export default function Home() {
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    setSpinner(true);
    fetchData();
  }, []);
  const fetchData = () => {
    Services(constants.API_BASE_URL + "home").then((response) => {
      // console.log(response, "responseresponseresponse");
      if (response) {
        setData(response);
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  };
  return (
    <View style={{ flex: 1 }}>
      {spinner ? (
        <Skeleton />
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
          <View style={{ width: "100%", height: responsiveHeight(8) }}>
            <Header screen="Home" title="DIVA" />
          </View>

          <View
            style={{
              height: 35,
              // borderWidth: 1,
              marginHorizontal: responsiveWidth(6),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 0.15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: responsiveWidth(4),
                  height: responsiveHeight(3),
                  tintColor: Colors.black,
                  resizeMode: "contain",
                }}
                source={Images.search}
              />
            </View>
            <TextInput
              placeholder="Search keyword"
              keyboardType={"default"}
              secureTextEntry={false}
              onChangeText={(text) => console.log(text)}
              blurOnSubmit={true}
              // value={}
              style={{
                fontFamily: Fonts.textfont,
                fontSize: responsiveFontSize(2),
              }}
              returnKeyType="done"
              // onSubmitEditing={() => onsubmit()}
            />
          </View>
          <FlatList
            data={imagedata1}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            style={{ marginBottom: 10, marginTop: responsiveWidth(2) }}
            showsHorizontalScrollIndicator={false}
          />
          <View
            style={{
              marginTop: responsiveHeight(1),
              marginBottom: responsiveHeight(1),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(8),
                resizeMode: "cover",
              }}
              source={Images.banner1}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1),
              marginBottom: responsiveHeight(1),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(65),
                resizeMode: "cover",
              }}
              source={Images.banner2}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(20),
                resizeMode: "cover",
              }}
              source={Images.banner4}
            />
          </View>
          <FlatList
            data={imagedata1}
            renderItem={_renderItem1}
            keyExtractor={(item) => item.id}
            horizontal={true}
            style={{ marginBottom: 10, marginTop: responsiveWidth(2) }}
            showsHorizontalScrollIndicator={false}
          />
          <View
            style={{
              marginTop: responsiveHeight(1),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(60),
                resizeMode: "cover",
              }}
              source={Images.banner3}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(20),
                resizeMode: "cover",
              }}
              source={Images.banner5}
            />
          </View>
          <FlatList
            data={imagedata1}
            renderItem={_renderItem1}
            keyExtractor={(item) => item.id}
            horizontal={true}
            style={{ marginBottom: 10, marginTop: responsiveWidth(2) }}
            showsHorizontalScrollIndicator={false}
          />
          <View
            style={{
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(20),
                resizeMode: "cover",
              }}
              source={Images.banner6}
            />
          </View>

          <View
            style={{
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(60),
                resizeMode: "cover",
              }}
              source={Images.banner7}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(20),
                resizeMode: "cover",
              }}
              source={Images.banner8}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(60),
                resizeMode: "cover",
              }}
              source={Images.banner9}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(2),
            }}
          >
            <Image
              style={{
                width: responsiveWidth(100),
                height: responsiveHeight(60),
                resizeMode: "cover",
              }}
              source={Images.banner10}
            />
          </View>
        </ScrollView>
      )}

      {/* {spinner
        ? null
        : setTimeout(() => {
            <View
              style={{
                backgroundColor: Colors.whatsapp,
                top: responsiveHeight(70),
                left: responsiveWidth(60),
                right: responsiveWidth(2),
                bottom: responsiveHeight(15),
                position: 'absolute',
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: Fonts.textbold,
                  fontSize: responsiveFontSize(1.5),
                  fontStyle: 'italic',
                  fontWeight: '900',
                }}>
                Live Chat 24/7
              </Text>
            </View>;
          }, 600)} */}
    </View>
  );
}
