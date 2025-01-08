import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
    responsiveScreenHeight,
} from "react-native-responsive-dimensions";
export default function Skeleton() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
                <SkeletonPlaceholder speed={1000}>


                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                    <View style={{ width: "95%", height: responsiveScreenHeight(12), borderRadius: 10, margin: 10, alignSelf: 'center' }} />
                </SkeletonPlaceholder>
            </View>
        </ScrollView>
    )
}
