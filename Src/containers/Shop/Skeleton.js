import React from "react";
import { View, Text, ScrollView } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
export default function Skeleton() {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder>
        {/* <View style={{ width: "100%", height: responsiveHeight(8) }} /> */}
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
          <View
            style={{
              height: responsiveWidth(50),
              width: responsiveWidth(47),
              marginHorizontal: responsiveWidth(1),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              marginTop: responsiveHeight(1),
            }}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
