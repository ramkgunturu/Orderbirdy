import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Animated,
  Modal,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import { Header, Address, ModalAlert } from "@components";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Images, Colors } from "@Themes";
import { useNavigation } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import styles from "./styles";
import Skeleton from "./Skeleton";
import Services from "@Services";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import { LanguageContext } from "@context/lang-context";

export default function MyAddress(props) {
  const navigation = useNavigation();
  const [onRowOpen, setOnRowOpen] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    fetchAddresses();
  }, [dummy, address]);

  function fetchAddresses() {
    Services(constants.API_BASE_URL + "addresses?member_id=" + user.id).then(
      (response) => {
        // console.log(response, "responseresponseresponse")
        if (response) {
          // areaActions.areasList(dispatch, response);

          if (response && response.length >= 0) {
            response.map((res, i) => {
              res.key = i + 1;
            });
            setAddress(response);
            setSpinner(false);
            setLoading(false);
            // console.log(response, "response")
          }
        } else {
          setSpinner(false);
          setLoading(false);
        }
      }
    );
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };
  function onAddAddress() {
    // navigation.push("Address",{})

    navigation.push("AddAddress", { onNavigationBack: handleOnNavigateBack });
  }
  const handleOnNavigateBack = (value) => {
    // if (route.params) {
    //     getLocationValues()
    // } else {
    fetchAddresses();
    // }
    // fetchAddresses();
  };
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };
  function onDeleteAddress() {
    setLoading(true);
    Services(
      constants.API_BASE_URL + "/address_delete/" + user.id + "/" + item.id
    ).then((response) => {
      // console.log(response, "responseresponseresponse")
      if (response) {
        // areaActions.areasList(dispatch, response);
        setDummy(dummy + 1);
        // fetchAddresses();

        // console.log(response, "response")
      } else {
        setLoading(false);
      }
    });
  }
  const onRowPress = (key, rowMap) => () => {
    const rowRef = rowMap[key];
    // console.log(key, "keykeykeykey", rowRef)
    if (onRowOpen === key) {
      closeRow(rowMap, key);
      setOnRowOpen(null);
    } else if (rowMap[key]) {
      if (I18nManager.isRTL) {
        rowRef.manuallySwipeRow(responsiveWidth(20));
      } else {
        rowRef.manuallySwipeRow(-responsiveWidth(20));
      }

      setOnRowOpen(key);
    }
  };

  const onRowCheckOutPress = (key, rowMap) => () => {
    if (props && props.route.params === "CheckOut") {
      props.route.selectAddressList(key);
    }
    navigation.push();
  };

  const _renderItem = (data, rowMap) => {
    // console.log(data, "datadata")
    const regex = /(<([^>]+)>)/gi;
    const address = data.item.address_str.replace(regex, "");
    return (
      <TouchableOpacity
        // onPress={() => console.log("You touched me")}
        activeOpacity={1}
        onPress={
          props && props.route && props.route.params === "CheckOut"
            ? onRowCheckOutPress(data.item, rowMap)
            : onRowPress(data.item.key, rowMap)
        }
        style={styles.rowFront}
      >
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontFamily: Fonts.textfont,

                textAlign: "left",
              }}
            >
              {data.item.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={Images.more}
                style={{
                  width: responsiveWidth(3),
                  height: responsiveWidth(3),
                  paddingRight: 20,
                  tintColor: "red",
                }}
              />
            </View>
          </View>
          <Text
            style={{
              marginTop: 10,
              fontSize: responsiveFontSize(1.6),
              fontFamily: Fonts.textfont,
              fontWeight: "normal",
              textAlign: "left",
            }}
          >
            {address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  function renderHiddenItem(data, rowMap) {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          // onPress={() => closeRow(rowMap, data.item.key)}
          onPress={() =>
            navigation.push("AddAddress", {
              item: data.item,
              onNavigateBack: handleOnNavigateBack,
            })
          }
        >
          {/* <Text style={styles.backTextWhite}>Close</Text> */}
          <Image
            source={Images.edit}
            style={{
              width: responsiveWidth(5),
              height: responsiveWidth(5),
              paddingRight: 20,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          // onPress={() => deleteRow(rowMap, data.item.key)}
          onPress={() => {
            setItem(data.item);
            setModalVisible(true);
          }}
        >
          <Image
            source={Images.trash}
            style={{
              width: responsiveWidth(5),
              height: responsiveWidth(5),
              paddingRight: 20,
              resizeMode: "contain",
              // tintColor: Colors.e4e4e4,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          height: responsiveHeight(8),
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header
          title={language["Saved Address"]}
          screen={"MyAddresses"}
          onAddAddress={onAddAddress}
        />
      </View>

      {spinner ? (
        <View style={{ flex: 1 }}>
          <Skeleton />
        </View>
      ) : address && address.length > 0 ? (
        <View style={{ flex: 1 }}>
          <SwipeListView
            data={address}
            renderItem={_renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={I18nManager.isRTL ? false : true}
            disableLeftSwipe={I18nManager.isRTL ? true : false}
            rightOpenValue={-75}
            leftOpenValue={75}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <Text
          style={{
            fontFamily: Fonts.textfont,
            marginTop: responsiveHeight(25),
            fontSize: responsiveFontSize(1.8),
            paddingLeft: responsiveWidth(2),
            color: Colors.black,
            textAlign: "center",
          }}
        >
          {language["No Addresses Found"]}
        </Text>
      )}
      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ModalAlert
          title={language["Are you sure you want to delete this Address?"]}
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setModalVisible(false)}
          onPressLeft={() => {
            setModalVisible(false);
            onDeleteAddress();
          }}
          onPressRight={() => setModalVisible(false)}
        />
      </Modal>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "transparent",
          }}
        >
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
}
