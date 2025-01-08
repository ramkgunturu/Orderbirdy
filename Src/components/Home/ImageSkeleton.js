import React from "react";
import { View, Text, ScrollView } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
export default function ImageSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonPlaceholder>
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(80),
              height: responsiveWidth(40),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(80),
              height: responsiveWidth(40),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
        </View>
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(8),
            width: responsiveWidth(100),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(25),
            width: responsiveWidth(100),
          }}
        />

        <View
          style={{
            height: 35,
            // borderWidth: 1,
            marginHorizontal: responsiveWidth(1),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
        <View
          style={{
            height: 35,
            // borderWidth: 1,
            marginHorizontal: responsiveWidth(5),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
        <View
          style={{
            height: 35,
            // borderWidth: 1,
            marginHorizontal: responsiveWidth(7),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
        <View
          style={{
            height: 35,
            // borderWidth: 1,
            marginHorizontal: responsiveWidth(11),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
}
