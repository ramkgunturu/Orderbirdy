import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  I18nManager,
  FlatList,
} from "react-native";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Fonts, Colors } from "@Themes";
import { Header, SingUp, InputField } from "@components";
import { Content } from "native-base";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: "1",
    title: "Vest",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    id: "2",
    title: "Dress",
    image:
      "https://www.rivafashion.com/media/wysiwyg/riva-new/menu/teens_shoes.jpg",
  },
  {
    id: "3",
    title: "Blouse",
    image:
      "https://www.dalmamall.ae/media/5281/b-small-banner-640x460px.jpg?center=0.59459459459459463,0.60776699029126213&mode=crop&width=880&height=495&rnd=132117190160000000",
  },
  {
    id: "4",
    title: "Jacket",
    image: "https://diva-fashion.co/uploads/products/1615289300.JPG",
  },
  {
    id: "5",
    title: "Skirt",
    image: "https://diva-fashion.co/uploads/products/1615370479.JPG",
  },
  // {
  //   id: "6",
  //   title: "Trousers",
  //   image: "https://diva-fashion.co/uploads/products/1615370327.JPG",
  // },
  // {
  //   id: "7",
  //   title: "Accessore",
  //   image: "",
  // },
  // {
  //   id: "8",
  //   title: "Belt",
  //   image: "",
  // },
  // {
  //   id: "9",
  //   title: "Long Shirt",
  //   image: "https://diva-fashion.co/uploads/products/16152878613.JPG",
  // },
  // {
  //   id: "10",
  //   title: "Twins",
  //   image: "https://diva-fashion.co/uploads/products/1615362245.JPG",
  // },
  // {
  //   id: "11",
  //   title: "Cut Dress",
  //   image: "",
  // },
  // {
  //   id: "12",
  //   title: "Shirt",
  //   image: "https://diva-fashion.co/uploads/products/1615369018.JPG",
  // },
  // {
  //   id: "13",
  //   title: "Suit",
  //   image: "",
  // },
  // {
  //   id: "14",
  //   title: "Shawl",
  //   image: "",
  // },
  // {
  //   id: "15",
  //   title: "Long Blouse",
  //   image: "https://diva-fashion.co/uploads/products/16152824413.JPG",
  // },
  // {
  //   id: "16",
  //   title: "Sampel",
  //   image: "",
  // },
  // {
  //   id: "17",
  //   title: "Training Suit",
  //   image: "https://diva-fashion.co/uploads/products/16152837613.JPG",
  // },
  // {
  //   id: "18",
  //   title: "Jeans Jacket",
  //   image: "",
  // },
  // {
  //   id: "19",
  //   title: "Sherwall",
  //   image: "",
  // },
  // {
  //   id: "20",
  //   title: "Long Jacket",
  //   image: "https://diva-fashion.co/uploads/products/1615287686.JPG",
  // },
  // {
  //   id: "21",
  //   title: "Pullover",
  //   image: "https://diva-fashion.co/uploads/products/1615284466.JPG",
  // },
  // {
  //   id: "22",
  //   title: "Cout",
  //   image: "",
  // },
  // {
  //   id: "23",
  //   title: "High Neck",
  //   image: "",
  // },
  // {
  //   id: "24",
  //   title: "Treco Jacket",
  //   image: "",
  // },
  // {
  //   id: "25",
  //   title: "Bag",
  //   image: "",
  // },
  // {
  //   id: "26",
  //   title: "Scarf",
  //   image: "",
  // },
  // {
  //   id: "27",
  //   title: "Cap",
  //   image: "",
  // },
];

export default function Shop(props) {
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,

          // marginHorizontal: responsiveWidth(3),
        }}
      >
        <View
          style={{
            // height: responsiveWidth(35),
            height: "auto",
            borderRadius: 10,
            marginTop: responsiveWidth(2),
            marginRight: 0,
            flexDirection: "row",
          }}
        >
          <View>
            <Image
              style={{
                width: responsiveWidth(90),
                height: responsiveWidth(40),
                borderRadius: 10,
                // resizeMode: "contain",
              }}
              source={{ uri: item.image }}
            />
          </View>
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0e0e0e2b",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2.2),
                color: Colors.lightblack,
                fontFamily: Fonts.textfont,
                fontWeight: "bold",
              }}
            >
              {/* {"Title"} */}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const renderItems = ({ item }) => {
    return (
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: "lightgrey" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",

            height: 45,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: responsiveWidth(4),
          }}
        >
          <Text
            style={{
              fontSize: responsiveFontSize(1.8),
              fontFamily: Fonts.textfont,
            }}
          >
            {item.title}
          </Text>
          <Image
            style={{ width: responsiveWidth(3), height: responsiveWidth(3) }}
            source={Images.back}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Shop"} title={"Shop"} />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ marginHorizontal: responsiveWidth(3) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
