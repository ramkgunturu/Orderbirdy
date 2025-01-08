import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Fonts, Colors } from "@Themes";

import {
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { SettingsContext } from "@context/settings-context";

export default function ModalAlert(props) {
  const { settings, setSettings } = useContext(SettingsContext);
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: "#0e0e0e4f",
        justifyContent: "center",
        // alignItems: 'center',
      }}
      onPress={() => {
        props.onClose();
      }}
    >
      <TouchableWithoutFeedback style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.lightgrey,
            // alignItems: 'center',
            marginHorizontal: responsiveWidth(5),

            borderRadius: 15,
          }}
        >
          <View
            style={
              {
                // borderBottomWidth: 1,
                // borderBottomColor: Colors.lightgrey,
              }
            }
          >
            <Text
              style={{
                color: Colors.black,
                fontSize: responsiveFontSize(2),
                fontFamily: Fonts.textfont,

                textAlign: "center",
                marginTop: responsiveWidth(5),
              }}
            >
              {props.header}
            </Text>
            <Text
              style={{
                color: Colors.black,
                fontSize: responsiveFontSize(1.6),
                fontFamily: Fonts.textfont,

                // margin: responsiveWidth(5),
                textAlign: "center",
                marginVertical: responsiveWidth(3),
                lineHeight: 20,
                marginHorizontal: responsiveWidth(3),
              }}
              numberOfLines={2}
            >
              {props.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              style={{
                // borderRightWidth: 1,
                // borderRightColor: Colors.lightgrey,
                // flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: settings.settings.color1,
                width: 130,
                marginRight: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: settings.settings.color1,
              }}
              onPress={() => props.onPressLeft()}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: Fonts.textfont,

                  margin: responsiveWidth(2.5),
                  textAlign: "center",
                  // paddingHorizontal: 10
                }}
              >
                {props.leftTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                // flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: settings.settings.color1,
                width: 130,
                marginLeft: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: settings.settings.color1,
              }}
              onPress={() => props.onPressRight()}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: Fonts.textfont,

                  margin: responsiveWidth(2.5),
                  textAlign: "center",
                }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: "absolute", top: 0, right: 15 }}>
            <TouchableOpacity
              style={{
                marginTop: -15,
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={props.onClose}
            >
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
}
