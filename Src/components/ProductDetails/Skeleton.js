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
      <SkeletonPlaceholder speed={1000}>
        <View style={{ width: "100%", height: responsiveScreenHeight(60) }} />
        <View
          style={{
            width: "95%",
            height: responsiveScreenHeight(5),
            borderRadius: 10,
            marginTop: 10,
            alignSelf: "center",
          }}
        />

        <View
          style={{
            width: "95%",
            height: responsiveScreenHeight(5),
            borderRadius: 10,
            marginTop: 10,
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: "95%",
            height: responsiveScreenHeight(5),
            borderRadius: 10,
            marginTop: 10,
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: "95%",
            height: responsiveScreenHeight(5),
            borderRadius: 10,
            marginTop: 10,
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: "100%",
            height: responsiveScreenHeight(6),
            marginTop: 10,
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
}
