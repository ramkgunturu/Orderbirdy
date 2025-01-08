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
        {/* <View style={{ width: "100%", height: responsiveHeight(6) }} /> */}
        <View
          style={{
            height: responsiveHeight(8), // borderWidth: 1,
            marginHorizontal: responsiveWidth(0),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(20),
            width: responsiveWidth(100),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(20),
            width: responsiveWidth(100),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(20),
            width: responsiveWidth(100),
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
}
