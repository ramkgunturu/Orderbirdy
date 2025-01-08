import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Modal,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  I18nManager,
  Keyboard,
} from "react-native";
import Services from "@Services";
import constants from "@constants";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Images, Fonts, Colors } from "@Themes";
import {
  Header,
  SingUp,
  InputField,
  ProductDisplay,
  ProductDetails,
} from "@components";
import * as Animatable from "react-native-animatable";
import { Content, Row, Spinner } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import { ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { UserContext } from "@context/user-context";
import { SettingsContext } from "@context/settings-context";
import { CommonCheckOut, Areas } from "@components";
import Toast from "react-native-simple-toast";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import { LanguageContext } from "@context/lang-context";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailidRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

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

export default function AddAddress(props) {
  const { user, setUser } = useContext(UserContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [selectAnyData, setSelectAnyData] = useState([
    { label: "House", value: "1" },
    { label: "Building", value: "2" },
    { label: "Office", value: "3" },
  ]);
  const dispatch = useDispatch();
  const [colorPayment, setColorPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(false);
  const [countries, setCountries] = useState(settings.countries);
  const [selectCountry, setSelectCountry] = useState(settings.countries[0]);
  const [selectAny, setSelectAny] = useState(selectAnyData[0]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);

  loadingButton = React.createRef();

  const GuestCheckOutSchema = Yup.object().shape({
    building:
      selectAny.value === "2" || selectAny.value === "3"
        ? Yup.string().required(language["Building No/Name is required"])
        : Yup.string(),
    block: Yup.string().required(language["Block is required"]),
    street: Yup.string().required(language["Street is required"]),
    floor:
      selectAny.value === "2" || selectAny.value === "3"
        ? Yup.string().required(language["Floor Number is required"])
        : Yup.string(),
    flat:
      selectAny.value === "2"
        ? Yup.string().required(language["Flat Number is required"])
        : Yup.string(),
    officeno:
      selectAny.value === "3"
        ? Yup.string().required(language["Office Number is required"])
        : Yup.string(),
    houseno:
      selectAny.value === "1"
        ? Yup.string().required(language["House No/Name is required"])
        : Yup.string(),
    title: Yup.string().required(language["Title is required"]),
    phonenumber: Yup.string()
      .required(language["Phone Number is required"])
      .matches(phoneRegExp, language["Phone Number is not valid"])
      .min(8, language["Must contain 8 digits"])
      .max(8, language["Must contain 8 digits"]),
  });

  const GuestCheckOutSchemaOtherCountry = Yup.object().shape({
    title: Yup.string().required(language["Title is required"]),
    state: Yup.string().required(language["State is required"]),
    city: Yup.string().required(language["City is required"]),
    address: Yup.string().required(language["Address is required"]),
    pincode: Yup.string().required(language["Pin Code is required"]),
    phonenumber: Yup.string()
      .required(language["Phone Number is required"])
      .matches(phoneRegExp, language["Phone Number is not valid"])
      .min(8, language["Must contain 8 digits"])
      .max(8, language["Must contain 8 digits"]),
  });

  function onSubmit(values) {
    values.country = selectCountry.value;
    values.selectany = selectAny.value;
    values.area = selectedValue ? selectedValue.id : null;

    if (!selectedValue && values.country === "Kuwait") {
      var message = language["Please select area."];
      alert(message);
    } else {
      var addressData = {
        member_id: user.id,
        title: values.title,
        phone: values.phonenumber,
        area: values.area ? values.area : "",
        country: values.country ? values.country : "",
        city: values.city ? values.city : "",
        block: values.block ? values.block : "",
        street: values.street ? values.street : "",
        avenue: values.avenue ? values.avenue : "",
        house: values.houseno ? values.houseno : "",
        type:
          values.selectany === "1"
            ? "House"
            : values.selectany === "2"
            ? "Flat"
            : "Office",
        state: values.state ? values.state : "",
        address: values.address ? values.address : "",
        address2: values.address2 ? values.address2 : "",
        pincode: values.pincode ? values.pincode : "",
        building: values.building ? values.building : "",
        floor: values.floor ? values.floor : "",
        flat: values.flat ? values.flat : values.officeno,
        directions: values.extradirections ? values.extradirections : "",
      };
      console.log(addressData);
      Services(
        constants.API_BASE_URL + "add_address",
        addressData,
        "POST"
      ).then((response) => {
        if (response.status === "Success") {
          addressData.id = response.address_id;
          props.route.params.onNavigateBack(addressData);
          loadingButton.setLoading(false);
          navigation.goBack();
        } else {
          alert(response.message);
          loadingButton.setLoading(false);
          setIsLoading(false);
        }
      });
    }
  }

  function getSelectedValue(item) {
    // console.log(item);
    setSelectedValue(item);
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header screen={"AddAddress"} title={language["Add Address"]} />
      </View>

      <Formik
        initialValues={{
          title: "",
          email: "",
          fullname: "",
          phonenumber: "",
          block: "",
          area: "",
          street: "",
          floor: "",
          flat: "",
          avenue: "",
          pincode: "",
          state: "",
          building: "",
          city: "",
          avenue: "",
          extradirections: "",
          houseno: "",
          officeno: "",
          address: "",
          address2: "",
        }}
        validationSchema={
          selectCountry.value === "105"
            ? GuestCheckOutSchema
            : GuestCheckOutSchemaOtherCountry
        }
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
        }) => {
          return (
            <View style={{ flex: 1, marginTop: responsiveWidth(0) }}>
              <Content>
                <View
                  style={{
                    height: responsiveHeight(6),
                    backgroundColor: Colors.e4e4e4,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(1.6),

                      color: Colors.grey,
                      textTransform: "uppercase",
                      marginTop: responsiveWidth(3),
                      marginBottom: responsiveWidth(3),
                      marginHorizontal: responsiveWidth(2),
                      textAlign: "left",
                    }}
                  >
                    {language["Address Details"]}
                  </Text>
                </View>
                <View style={{ flex: 0.9 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      marginHorizontal: responsiveWidth(2),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "lightgrey",
                      // borderRadius: 25,
                      marginTop: responsiveWidth(2),
                      // paddingLeft: responsiveWidth(2),
                      // backgroundColor: "white",
                      // shadowOpacity: 0.5,
                      // shadowOffset: { width: 1, height: 1 },
                      // shadowColor: "grey",
                      // elevation: 5,
                    }}
                  >
                    <View style={{ flex: 0.9, justifyContent: "center" }}>
                      <TextInput
                        placeholder={language["Address Title"] + " *"}
                        ref={(input) => {
                          // title = input;
                        }}
                        keyboardType="default"
                        autoCapitalize="none"
                        placeholderTextColor="grey"
                        onChangeText={handleChange("title")}
                        onBlur={handleBlur("title")}
                        value={values.title}
                        style={{
                          width: "100%",
                          fontFamily: Fonts.textfont,
                          textAlign: I18nManager.isRTL ? "right" : "left",
                          height: 50,
                        }}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ flex: 0.1, justifyContent: "center" }}
                      onPress={() =>
                        Toast.showWithGravity(
                          errors.title,
                          Toast.SHORT,
                          Toast.BOTTOM
                        )
                      }
                    >
                      {errors.title && touched.title ? (
                        <Error display={errors.title && touched.title} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      marginHorizontal: responsiveWidth(2),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "lightgrey",
                      // borderRadius: 25,
                      marginTop: responsiveWidth(2),
                    }}
                  >
                    <View style={{ flex: 0.9, justifyContent: "center" }}>
                      <TextInput
                        placeholder={language["Phone Number"]}
                        ref={(input) => {
                          phonenumber = input;
                        }}
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        placeholderTextColor="grey"
                        onChangeText={handleChange("phonenumber")}
                        onBlur={handleBlur("phonenumber")}
                        value={values.phonenumber}
                        style={{
                          width: "100%",
                          fontFamily: Fonts.textfont,
                          textAlign: I18nManager.isRTL ? "right" : "left",
                          height: 50,
                        }}
                        returnKeyType="next"
                        maxLength={8}
                        onSubmitEditing={() => {
                          passwordInput.focus();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ flex: 0.1, justifyContent: "center" }}
                      onPress={() =>
                        Toast.showWithGravity(
                          errors.phonenumber,
                          Toast.SHORT,
                          Toast.BOTTOM
                        )
                      }
                    >
                      {errors.phonenumber && touched.phonenumber ? (
                        <Error
                          display={errors.phonenumber && touched.phonenumber}
                        />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      marginHorizontal: responsiveWidth(2),
                      borderBottomWidth: 0.5,
                      borderBottomColor: "lightgrey",
                      // borderRadius: 25,
                      marginTop: responsiveWidth(2),
                    }}
                  >
                    {countries && countries.length > 0 ? (
                      <RNPickerSelect
                        pickerProps={{
                          accessibilityLabel: language["Country"] + " *",
                          flex: 1,
                        }}
                        placeholder={{}}
                        useNativeAndroidPickerStyle={false}
                        value={selectCountry.value}
                        // onDonePress={() => {
                        //   onAddToCart();
                        //   // console.log(sizeSelect, "-select size");
                        // }}
                        onValueChange={(value) => {
                          countries.filter((items) => {
                            if (items.value === value) {
                              setSelectCountry(items);
                            }
                          });
                        }}
                        items={countries}
                        style={{
                          ...styles,
                          placeholder: {
                            justifyContent: "center",
                          },
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.textbold,
                            fontSize: responsiveFontSize(1.8),

                            color: Colors.grey,
                            textTransform: "capitalize",
                            marginTop: responsiveWidth(3),
                            marginBottom: responsiveWidth(3),
                            textAlign: "left",
                          }}
                        >
                          {language["Country"]}
                        </Text>
                        <View
                          style={{
                            width: responsiveWidth(100),
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: responsiveWidth(0),
                            // backgroundColor: "yellow",
                            height: 45,
                          }}
                        >
                          <View
                            style={{
                              flex: 0.9,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.textfont,
                                fontSize: responsiveFontSize(2),
                                color: Colors.black,
                                textTransform: "capitalize",
                                textAlign: "left",
                                marginHorizontal: responsiveWidth(1),
                              }}
                            >
                              {selectCountry.label}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0.1,
                            }}
                          >
                            <Image
                              source={Images.downarrow}
                              style={{
                                width: responsiveWidth(3.5),
                                height: responsiveWidth(3),
                                marginHorizontal: responsiveWidth(2),
                                resizeMode: "contain",
                                tintColor: Colors.black,
                              }}
                            />
                          </View>
                        </View>
                      </RNPickerSelect>
                    ) : null}
                  </View>
                  {/* <View
                    style={{
                      backgroundColor: Colors.white,
                      justifyContent: "center",
                      height: responsiveWidth(10),
                      paddingLeft: responsiveWidth(3),
                    }}
                  >
                    
                  </View> */}
                  {selectCountry.value === "105" ? (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          alignItems: "center",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                        onPress={() => {
                          Keyboard.dismiss();
                          setModalVisible(true);
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.textbold,
                            fontSize: responsiveFontSize(1.8),

                            color: Colors.grey,
                            textTransform: "capitalize",
                            marginTop: responsiveWidth(3),
                            marginBottom: responsiveWidth(3),
                          }}
                        >
                          {selectedValue
                            ? I18nManager.isRTL
                              ? selectedValue.title_ar
                              : selectedValue.title
                            : language["Area"] + " *"}
                        </Text>
                        <Image
                          source={Images.downarrow}
                          style={{
                            width: responsiveWidth(3.5),
                            height: responsiveWidth(3),
                            // marginHorizontal: responsiveWidth(2),
                            resizeMode: "contain",
                            tintColor: Colors.black,
                          }}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["Block"] + " *"}
                            ref={(input) => {
                              // block = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("block")}
                            onBlur={handleBlur("block")}
                            value={values.block}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.block,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.block && touched.block ? (
                            <Error display={errors.block && touched.block} />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["Street"] + " *"}
                            ref={(input) => {
                              // street = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("street")}
                            onBlur={handleBlur("street")}
                            value={values.street}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.street,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.street && touched.street ? (
                            <Error display={errors.street && touched.street} />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["Avenue"]}
                            ref={(input) => {
                              // avenue = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("avenue")}
                            onBlur={handleBlur("avenue")}
                            value={values.avenue}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <RNPickerSelect
                          // pickerProps={{
                          //   accessibilityLabel: "Select Any *",
                          //   flex: 1,
                          // }}
                          placeholder={{}}
                          useNativeAndroidPickerStyle={false}
                          value={selectAny.value}
                          onValueChange={(value) => {
                            selectAnyData.filter((items) => {
                              if (items.value === value) {
                                setSelectAny(items);
                              }
                            });
                          }}
                          items={selectAnyData}
                          style={{
                            ...styles,
                            placeholder: {
                              justifyContent: "center",
                            },
                          }}
                        >
                          <View
                            style={{
                              width: responsiveWidth(100),
                              flexDirection: "row",
                              alignItems: "center",
                              paddingHorizontal: responsiveWidth(0),
                              // backgroundColor: "yellow",
                              height: 50,
                            }}
                          >
                            <View
                              style={{
                                flex: 0.9,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: Fonts.textfont,
                                  fontSize: responsiveFontSize(2),
                                  color: Colors.grey,
                                  textTransform: "capitalize",
                                  textAlign: "left",
                                }}
                              >
                                {selectAny
                                  ? selectAny.label
                                  : language["Select Any"] + " *"}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 0.1,
                              }}
                            >
                              <Image
                                source={Images.downarrow}
                                style={{
                                  width: responsiveWidth(3.5),
                                  height: responsiveWidth(3),
                                  marginHorizontal: responsiveWidth(2),
                                  resizeMode: "contain",
                                  tintColor: Colors.black,
                                }}
                              />
                            </View>
                          </View>
                        </RNPickerSelect>
                      </View>
                      {selectAny.value === "1" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1,
                            marginHorizontal: responsiveWidth(2),
                            borderBottomWidth: 0.5,
                            borderBottomColor: "lightgrey",
                            // borderRadius: 25,
                            marginTop: responsiveWidth(2),
                          }}
                        >
                          <View style={{ flex: 0.9, justifyContent: "center" }}>
                            <TextInput
                              placeholder={language["House Number"] + " *"}
                              ref={(input) => {
                                // houseno = input;
                              }}
                              keyboardType="default"
                              autoCapitalize="none"
                              placeholderTextColor="grey"
                              onChangeText={handleChange("houseno")}
                              onBlur={handleBlur("houseno")}
                              value={values.houseno}
                              style={{
                                width: "100%",
                                fontFamily: Fonts.textfont,
                                textAlign: I18nManager.isRTL ? "right" : "left",
                                height: 50,
                              }}
                              returnKeyType="done"
                              onSubmitEditing={() => {
                                Keyboard.dismiss();
                              }}
                              blurOnSubmit={false}
                            />
                          </View>
                          <TouchableOpacity
                            style={{ flex: 0.1, justifyContent: "center" }}
                            onPress={() =>
                              Toast.showWithGravity(
                                errors.houseno,
                                Toast.SHORT,
                                Toast.BOTTOM
                              )
                            }
                          >
                            {errors.houseno && touched.houseno ? (
                              <Error
                                display={errors.houseno && touched.houseno}
                              />
                            ) : null}
                          </TouchableOpacity>
                        </View>
                      ) : selectAny.value === "2" || selectAny.value === "3" ? (
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              flex: 1,
                              marginHorizontal: responsiveWidth(2),
                              borderBottomWidth: 0.5,
                              borderBottomColor: "lightgrey",
                              // borderRadius: 25,
                              marginTop: responsiveWidth(2),
                            }}
                          >
                            <View
                              style={{ flex: 0.9, justifyContent: "center" }}
                            >
                              <TextInput
                                placeholder={
                                  language["Building Name/Number"] + " *"
                                }
                                ref={(input) => {
                                  // buildingnameno = input;
                                }}
                                keyboardType="default"
                                autoCapitalize="none"
                                placeholderTextColor="grey"
                                onChangeText={handleChange("building")}
                                onBlur={handleBlur("building")}
                                value={values.building}
                                style={{
                                  width: "100%",
                                  fontFamily: Fonts.textfont,
                                  textAlign: I18nManager.isRTL
                                    ? "right"
                                    : "left",
                                  height: 50,
                                }}
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                  Keyboard.dismiss();
                                }}
                                blurOnSubmit={false}
                              />
                            </View>
                            <TouchableOpacity
                              style={{ flex: 0.1, justifyContent: "center" }}
                              onPress={() =>
                                Toast.showWithGravity(
                                  errors.building,
                                  Toast.SHORT,
                                  Toast.BOTTOM
                                )
                              }
                            >
                              {errors.building && touched.building ? (
                                <Error
                                  display={errors.building && touched.building}
                                />
                              ) : null}
                            </TouchableOpacity>
                          </View>
                          {selectAny.value === "2" ? (
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
                                  // borderRadius: 25,
                                  marginTop: responsiveWidth(2),
                                }}
                              >
                                <View
                                  style={{
                                    flex: 0.9,
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextInput
                                    placeholder={
                                      language["Floor Number"] + " *"
                                    }
                                    ref={(input) => {
                                      // floor = input;
                                    }}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    placeholderTextColor="grey"
                                    onChangeText={handleChange("floor")}
                                    onBlur={handleBlur("floor")}
                                    value={values.floor}
                                    style={{
                                      width: "100%",
                                      fontFamily: Fonts.textfont,
                                      textAlign: I18nManager.isRTL
                                        ? "right"
                                        : "left",
                                      height: 50,
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                      Keyboard.dismiss();
                                    }}
                                    blurOnSubmit={false}
                                  />
                                </View>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.1,
                                    justifyContent: "center",
                                  }}
                                  onPress={() =>
                                    Toast.showWithGravity(
                                      errors.floor,
                                      Toast.SHORT,
                                      Toast.BOTTOM
                                    )
                                  }
                                >
                                  {errors.floor && touched.floor ? (
                                    <Error
                                      display={errors.floor && touched.floor}
                                    />
                                  ) : null}
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
                                  // borderRadius: 25,
                                  marginTop: responsiveWidth(2),
                                }}
                              >
                                <View
                                  style={{
                                    flex: 0.9,
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextInput
                                    placeholder={language["Flat Number"] + " *"}
                                    ref={(input) => {
                                      // flat = input;
                                    }}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    placeholderTextColor="grey"
                                    onChangeText={handleChange("flat")}
                                    onBlur={handleBlur("flat")}
                                    value={values.flat}
                                    style={{
                                      width: "100%",
                                      fontFamily: Fonts.textfont,
                                      textAlign: I18nManager.isRTL
                                        ? "right"
                                        : "left",
                                      height: 50,
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                      Keyboard.dismiss();
                                    }}
                                    blurOnSubmit={false}
                                  />
                                </View>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.1,
                                    justifyContent: "center",
                                  }}
                                  onPress={() =>
                                    Toast.showWithGravity(
                                      errors.flat,
                                      Toast.SHORT,
                                      Toast.BOTTOM
                                    )
                                  }
                                >
                                  {errors.flat && touched.flat ? (
                                    <Error
                                      display={errors.flat && touched.flat}
                                    />
                                  ) : null}
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
                                  // borderRadius: 25,
                                  marginTop: responsiveWidth(2),
                                }}
                              >
                                <View
                                  style={{
                                    flex: 0.9,
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextInput
                                    placeholder={
                                      language["Floor Number"] + " *"
                                    }
                                    ref={(input) => {
                                      // floor = input;
                                    }}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    placeholderTextColor="grey"
                                    onChangeText={handleChange("floor")}
                                    onBlur={handleBlur("floor")}
                                    value={values.floor}
                                    style={{
                                      width: "100%",
                                      fontFamily: Fonts.textfont,
                                      textAlign: I18nManager.isRTL
                                        ? "right"
                                        : "left",
                                      height: 50,
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                      Keyboard.dismiss();
                                    }}
                                    blurOnSubmit={false}
                                  />
                                </View>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.1,
                                    justifyContent: "center",
                                  }}
                                  onPress={() =>
                                    Toast.showWithGravity(
                                      errors.floor,
                                      Toast.SHORT,
                                      Toast.BOTTOM
                                    )
                                  }
                                >
                                  {errors.floor && touched.floor ? (
                                    <Error
                                      display={errors.floor && touched.floor}
                                    />
                                  ) : null}
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
                                  // borderRadius: 25,
                                  marginTop: responsiveWidth(2),
                                }}
                              >
                                <View
                                  style={{
                                    flex: 0.9,
                                    justifyContent: "center",
                                  }}
                                >
                                  <TextInput
                                    placeholder={
                                      language["Office Number"] + " *"
                                    }
                                    ref={(input) => {
                                      // officeno = input;
                                    }}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    placeholderTextColor="grey"
                                    onChangeText={handleChange("officeno")}
                                    onBlur={handleBlur("officeno")}
                                    value={values.officeno}
                                    style={{
                                      width: "100%",
                                      fontFamily: Fonts.textfont,
                                      textAlign: I18nManager.isRTL
                                        ? "right"
                                        : "left",
                                      height: 50,
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                      Keyboard.dismiss();
                                    }}
                                    blurOnSubmit={false}
                                  />
                                </View>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.1,
                                    justifyContent: "center",
                                  }}
                                  onPress={() =>
                                    Toast.showWithGravity(
                                      errors.officeno,
                                      Toast.SHORT,
                                      Toast.BOTTOM
                                    )
                                  }
                                >
                                  {errors.officeno && touched.officeno ? (
                                    <Error
                                      display={
                                        errors.officeno && touched.officeno
                                      }
                                    />
                                  ) : null}
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      ) : null}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["Extra Directions"]}
                            ref={(input) => {
                              // extradirections = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("extradirections")}
                            onBlur={handleBlur("extradirections")}
                            value={values.extradirections}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["State"] + " *"}
                            ref={(input) => {
                              // state = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("state")}
                            onBlur={handleBlur("state")}
                            value={values.state}
                            style={{
                              paddingLeft: responsiveWidth(2),
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.state,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.state && touched.state ? (
                            <Error display={errors.state && touched.state} />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["City"] + " *"}
                            ref={(input) => {
                              // city = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("city")}
                            onBlur={handleBlur("city")}
                            value={values.city}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.city,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.city && touched.city ? (
                            <Error display={errors.city && touched.city} />
                          ) : null}
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["address"] + " *"}
                            ref={(input) => {
                              // address = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("address")}
                            onBlur={handleBlur("address")}
                            value={values.address}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.address,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.address && touched.address ? (
                            <Error
                              display={errors.address && touched.address}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["address2"] + " *"}
                            ref={(input) => {
                              // address = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("address2")}
                            onBlur={handleBlur("address2")}
                            value={values.address2}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View style={{ flex: 0.9, justifyContent: "center" }}>
                          <TextInput
                            placeholder={language["Pin Code"] + " *"}
                            ref={(input) => {
                              // pincode = input;
                            }}
                            keyboardType="default"
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onChangeText={handleChange("pincode")}
                            onBlur={handleBlur("pincode")}
                            value={values.pincode}
                            style={{
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flex: 0.1, justifyContent: "center" }}
                          onPress={() =>
                            Toast.showWithGravity(
                              errors.pincode,
                              Toast.SHORT,
                              Toast.BOTTOM
                            )
                          }
                        >
                          {errors.pincode && touched.pincode ? (
                            <Error
                              display={errors.pincode && touched.pincode}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </Content>
              <View
                style={{
                  flex: 0.1,
                  // backgroundColor: Colors.black,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // borderRadius: 5,
                  // marginHorizontal: responsiveWidth(1),
                  marginBottom: responsiveWidth(2),
                }}
              >
                <AnimatedLoadingButton
                  ref={(c) => (loadingButton = c)}
                  containerStyle={{
                    width: "100%",
                    height: 50,
                    marginTop: responsiveWidth(6),
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: responsiveWidth(1),
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.black,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  title={language["Submit"]}
                  titleStyle={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),
                    color: Colors.white,

                    textTransform: "uppercase",
                  }}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          );
        }}
      </Formik>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Areas
          getSelected={getSelectedValue}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}
