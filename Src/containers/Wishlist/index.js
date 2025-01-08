import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Images, Fonts, Colors } from "@Themes";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import {
  Header,
  ProductDetails,
  ProductDisplay,
  ModalAlert,
} from "@components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { actions as whishListActions } from "./../../redux/whishlist";
const { width, height } = Dimensions.get("window");

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [spinner, setSpinner] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [details, setDetails] = useState([]);
  const wishlist = useSelector((state) => state.whishlist);

  const isFocused = useIsFocused();
  const user = "123";

  function onPressModal(item) {
    // console.log(item);
    setModalVisibles(true);
    setDetails(item);
  }

  function onPressWishList(item) {
    // console.log(item);
    setModalVisible(true);
    setDetails(item);
  }

  function onWhishlist() {
    // console.log(productDetails, "productDetails")

    whishListActions.removeFromWhishlist(dispatch, details);
  }

  useEffect(() => {
    if (isFocused) {
      checkUser();
    }
  }, [isFocused]);

  const checkUser = () => {
    if (user) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const _renderItemFeature = ({ item, index }) => {
    return (
      <ProductDisplay
        item={item}
        onPressModal={() => onPressModal(item)}
        index={index}
        onPressWishList={() => onPressWishList(item)}
      />
    );
  };
  // console.log(wishlist.whishlistItems, "---wishlist");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.lightgrey,
      }}
    >
      <View
        style={{
          height: responsiveHeight(8),
          borderBottomWidth: 0.3,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"Saves"} title={"Wishlist"} />
      </View>
      {wishlist.whishlistItems && wishlist.whishlistItems.length > 0 ? (
        <FlatList
          data={wishlist.whishlistItems}
          renderItem={_renderItemFeature}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
          // style={{ marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", marginTop: 10, fontWeight: "bold" }}
          >
            No Data
          </Text>
        </View>
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
          title={"Are you sure you want to remove this from Saves"}
          leftTitle={"Ok"}
          rightTitle={"Cancel"}
          onClose={() => setModalVisible(false)}
          onPressLeft={() => {
            setModalVisible(false);

            onWhishlist();
          }}
          onPressRight={() => {
            setModalVisible(false);
          }}
        />
      </Modal>
      <Modal
        animationType="slideInUp"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="slideOutDown"
        animationOutTiming={800}
        transparent={false}
        visible={modalVisibles}
        onRequestClose={() => {
          setModalVisibles(false);
        }}
      >
        <ProductDetails
          details={details}
          onClose={() => setModalVisibles(false)}
        />
      </Modal>
    </View>
  );
}
