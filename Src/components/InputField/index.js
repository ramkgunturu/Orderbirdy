import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./styles";
import { Images, Colors } from "@Themes";

export default function InputField(props) {
  function focus() {
    textInput.focus();
  }
  // useEffect(() => {
  //   props.onRef();
  // }, []);

  useEffect(() => {
    if (props.onRef != null) {
      props.onRef();
      // console.log(props.onRef());
    }
  }, []);

  const Error = ({ display = false }) => {
    const viewElement = useRef(null);

    useEffect(() => {
      if (display) {
        viewElement.current.animate("shake", 500);
      } else {
        viewElement.current.animate("bounceOut", 500);
      }
    }, [display]);

    const viewStyles = [styles.error, { opacity: 0 }];

    if (display) {
      viewStyles.push({ opacity: 1 });
    }

    return (
      <Animatable.View style={viewStyles} ref={viewElement}>
        <Text style={styles.errorText}>X</Text>
      </Animatable.View>
    );
  };

  const {
    onerror,
    error,
    onChangeText,
    secureTextEntry,
    keyboardType,
    onBlur,
    value,
    modelarea,
    returnKeyType,
    onPressModal,
    pointerEvents,
    defaultvalue,
    editable,
    onSubmitEditing,
    placeholder,
    maxLength,
  } = props;
  return (
    <View style={{ height: 40 }} pointerEvents={pointerEvents}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: Colors.grey,
          borderColor: "grey",
        }}
      >
        <View style={{ flex: 0.9, justifyContent: "center" }}>
          <TextInput
            placeholderTextColor={Colors.lightgrey}
            placeholder={placeholder}
            style={styles.inputtext}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            onBlur={onBlur}
            value={value}
            borderColor="white"
            borderWidth={0}
            returnKeyType={returnKeyType}
            defaultValue={defaultvalue}
            editable={editable}
            ref={(input) => (textInput = input)}
            onSubmitEditing={onSubmitEditing}
            maxLength={maxLength}
          />
        </View>
        {modelarea ? (
          <View
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 10,
            }}
          >
            <Image
              style={{ width: 15, height: 15, tintColor: "grey" }}
              resizeMode="contain"
              source={Images.downarrow}
            />
          </View>
        ) : (
          <View></View>
        )}
        {onerror ? (
          <View
            style={{
              flex: 0.1,
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 10,
            }}
          >
            <Error display={error} />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}
