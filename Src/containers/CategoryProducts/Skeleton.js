import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
const { height, width } = Dimensions.get("screen");
export default function Skeleton() {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder>
        {/* <View style={{ width: "100%", height: responsiveHeight(8) }} /> */}
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(60),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
