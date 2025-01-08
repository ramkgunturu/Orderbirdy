import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  I18nManager,
  Keyboard,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Fonts, Images } from "@Themes";
import { SettingsContext } from "@context/settings-context";
import { LanguageContext } from "@context/lang-context";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

var formattedArray = [];
var subArray = [];

export default function Areas(props) {
  const [arr, setArr] = useState([]);
  const [sublist, setSublist] = useState([]);
  const [textinput, setTextInput] = useState("");
  const { settings, setSettings } = useContext(SettingsContext);
  const [areasList, setAreasList] = useState(settings.areas);
  const [dataToShow, setDataToShow] = useState([]);
  const { language, setLanguage } = useContext(LanguageContext);
  const [search, setSearch] = useState(false);
  //   const areasList = useSelector((state) => state.areas);
  let results = "";
  function onItemSelected(item) {
    // console.log(item);
    props.getSelected(item);
  }
  // const results = !textinput
  //   ? arr
  //   : arr.filter((item) =>
  //       item.title.toLowerCase().includes(textinput.toLowerCase())
  //   );

  const searchUpdated = (term) => {
    let matchedItemsArray = [];
    if (term === "") {
      setDataToShow(arr);
      setSearch(false);
    } else {
      let count = 0;
      if (term.length >= 4) {
        arr.map((res, key) => {
          res.data.map((item, keys) => {
            if (
              item.title.toLowerCase().includes(term.toLowerCase()) ||
              item.title_ar.toLowerCase().includes(term.toLowerCase())
            ) {
              if (matchedItemsArray.length > 0) {
                matchedItemsArray.map((resid, key) => {
                  if (resid.id === item.id) {
                  } else {
                    matchedItemsArray.push(item);
                  }
                });
              } else {
                matchedItemsArray.push(item);
              }
            }
          });
        });
        if (matchedItemsArray.length > 0) {
          const obj = [
            ...new Map(
              matchedItemsArray.map((items) => [JSON.stringify(items), items])
            ).values(),
          ];
          // setDataToShow(matchedItemsArray);
          // const uniqueData = [...new Set(matchedItemsArray)];
          setDataToShow(obj);
        } else {
          setDataToShow([]);
        }
        setSearch(true);
      }
    }
  };

  useEffect(() => {
    // console.log(areasList);
    var formattedArray = [];
    var subArray = [];
    formatArray();
  }, []);
  function formatArray() {
    var formattedArray = [];
    var subArray = [];
    if (areasList && areasList.length > 0) {
      areasList.map((item, key) => {
        formattedArray.push({
          title: item.title,
          title_ar: item.title_ar,
          data: item.list,
        });
      });
    }

    setArr(formattedArray);
    setDataToShow(formattedArray);
    // console.log(arr);
    // formatSubArray();
  }

  function formatSubArray() {
    props.data.map((item, key) => {
      item.list.map((subItem, i) => {
        subArray.push(subItem);
      });
    });
    setSublist(subArray);
    // console.log(sublist);
  }

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ alignItems: "center", justifyContent: "center", margin: 10 }}
        onPress={() => onItemSelected(item)}
      >
        <Text style={{ fontSize: 15, fontFamily: Fonts.textfont }}>
          {I18nManager.isRTL ? item.title_ar : item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const _renderSectionHeader = ({ section: { title, title_ar } }) => {
    return (
      <View
        style={{
          height: 50,
          backgroundColor: "#e4e4e4",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,

            fontFamily: Fonts.textfont,
          }}
        >
          {/* {title} */}
          {I18nManager.isRTL ? title_ar : title}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#0e0e0e4f",
          paddingHorizontal: 30,
          paddingTop: 40,
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            flex: 0.1,
            backgroundColor: "#e4e4e4",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 0.9,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                // fontWeight: "700",
                color: "black",
                textAlign: "left",
                fontFamily: Fonts.textmedium,
              }}
            >
              {language["Select Area"]}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 0.1,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
            }}
            onPress={() => props.onClose()}
          >
            <Image
              style={{ width: 20, height: 20, tintColor: "black" }}
              source={Images.close}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: responsiveHeight(8),
            backgroundColor: "white",
            padding: 15,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              flex: 1,
              justifyContent: "center",
              borderColor: "lighgrey",
              borderRadius: 10,
              backgroundColor: "#e4e4e4",
            }}
          >
            <TextInput
              style={{
                width: "100%",
                fontWeight: "600",
                paddingLeft: 20,
                color: "black",
                textAlign: I18nManager.isRTL ? "right" : "left",
                paddingVertical: responsiveWidth(1),
              }}
              placeholder={language["Search Area"]}
              placeholderTextColor="grey"
              onChangeText={(text) => searchUpdated(text)}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.85,
            backgroundColor: "white",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {search ? (
            <FlatList
              data={dataToShow}
              renderItem={_renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <SectionList
              sections={dataToShow}
              keyExtractor={(item, index) => item + index}
              renderItem={_renderItem}
              renderSectionHeader={_renderSectionHeader}
              keyboardShouldPersistTaps="always"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
