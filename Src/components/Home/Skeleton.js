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
        <View
          style={{
            width: responsiveWidth(100),
            height: responsiveWidth(60),
            marginHorizontal: responsiveWidth(0.1),
            backgroundColor: "#EBEEEE",
            borderRadius: 10,
            marginTop: responsiveHeight(1),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
            height: responsiveHeight(6),
            width: responsiveWidth(100),
          }}
        />
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
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
            height: responsiveHeight(6),
            width: responsiveWidth(100),
          }}
        />
        <View style={{ flexDirection: "row", marginTop: responsiveHeight(1) }}>
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
              marginHorizontal: responsiveWidth(2),
              backgroundColor: "#EBEEEE",
              borderRadius: 10,
              flexDirection: "row",
            }}
          />
          <View
            style={{
              width: responsiveWidth(40),
              height: responsiveWidth(50),
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
