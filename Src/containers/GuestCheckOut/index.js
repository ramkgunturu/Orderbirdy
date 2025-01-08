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
  ScrollView,
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
// import { Content, Row, Spinner } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { actions as whishListActions } from "./../../redux/whishlist";
import RNPickerSelect from "react-native-picker-select";
import { UserContext } from "@context/user-context";
import { SettingsContext } from "@context/settings-context";
import { CommonCheckOut, Areas, OrderSuccess } from "@components";
import { SwipeablePanel } from "rn-swipeable-panel";
import Toast from "react-native-simple-toast";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { LanguageContext } from "@context/lang-context";
import { CountryContext } from "@context/country-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { TrackingPermissionContext } from "@context/tracking-permission";

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

export default function GuestCheckOut(props) {
  const { user, setUser } = useContext(UserContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const trackingStatus = useContext(TrackingPermissionContext);
  const [selectAnyData, setSelectAnyData] = useState([
    { label: language["House"], value: "1" },
    { label: language["Building"], value: "2" },
    { label: language["Office"], value: "3" },
  ]);
  const dispatch = useDispatch();
  const [payment, setPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);
  const [spinner, setSpinner] = useState(false);
  const [countries, setCountries] = useState(settings.countries);
  const [selectCountry, setSelectCountry] = useState(settings.countries[0]);
  const [selectAny, setSelectAny] = useState(selectAnyData[0]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(null);
  const [subTotal, setSubTotal] = useState(0);
  const [placeOrderDetails, setPlaceOrderDetails] = useState(null);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const { country, setCountry } = useContext(CountryContext);
  const [weightCalculate, setWeightCalculate] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(
    settings.settings.delivery_now === "1" ? "1" : "0"
  );
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState({});
  const [selectDeliveryTime, setSelectDeliveryTime] = useState(null);
  const [tomorrowDate, setTomorrowDate] = useState(null);
  const [cod, setCod] = useState(null);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    onlySmall: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // closeOnTouchOutside: true,
    // ...or any prop you want
  });

  // const [viewAddressFields, setViewAddressFields] = useState(false);
  const [dummy, setDummy] = useState(1);
  const GuestCheckOutSchema = Yup.object().shape({
    email: Yup.string()
      .email(language["Invalid email"])
      .required(language["Email Id is required"])
      .matches(emailidRegExp, language["Email is not valid"]),

    fname: Yup.string().required(language["First Name is required"]),
    // lname: Yup.string().required(language["Last Name is required"]),
    building:
      selectAny.value === "2" || selectAny.value === "3"
        ? Yup.string().required(language["Building No/Name is required"])
        : Yup.string(),
    block: Yup.string().required(language["Block is required"]),
    street: Yup.string().required(language["Street is required"]),
    floor:
      selectAny.value === "2"
        ? Yup.string().required(language["Floor Number is required"])
        : Yup.string(),
    flat:
      selectAny.value === "2" || selectAny.value === "3"
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

    phonenumber: Yup.string()
      .required(language["Phone Number is required"])
      .matches(phoneRegExp, language["Phone Number is not valid"])
      .min(8, language["Must contain 8 digits"])
      .max(8, language["Must contain 8 digits"]),
  });

  const GuestCheckOutSchemaOtherCountry = Yup.object().shape({
    email: Yup.string()
      .email(language["Invalid email"])
      .required(language["Email Id is required"])
      .matches(emailidRegExp, language["Email is not valid"]),

    fname: Yup.string().required(language["First Name is required"]),
    // lname: Yup.string().required(language["Last Name is required"]),
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

  useEffect(() => {
    if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
      AppEventsLogger.logEvent("Guest CheckOut");
    }
    // console.log(
    //   console.log(moment(new Date()).add(1, "days").calendar()),
    //   "00000"
    // );
    // var today = moment();
    // var tomorrow = today.add("days", 1);
    // console.log(tomorrow, "tomorrow");
    // console.log(new Date());
    // console.log(moment(tomorrow).format());
    // console.log(new Date(tomorrow));
    setTomorrowDate(new Date());
    setDummy(1);
    calculateData();
    // console.log(dummy);
  }, [selectedValue, dummy, selectCountry]);

  function calculateData() {
    let count = 0;
    let weight = 0;
    if (cart && cart.cartItems.length > 0) {
      cart.cartItems.map((res, key) => {
        weight = weight + parseFloat(res?.weight);
        count = count + 1;
      });

      if (cart.cartItems.length === count) {
        setWeightCalculate(weight);
      }
      setSpinner(false);
    } else {
      setSpinner(false);
    }
  }

  function onSubmit(values) {
    if (!selectCountry) {
      let addressmessage = language["Please select Country"];
      alert(addressmessage);
    } else if (!selectedValue && selectCountry.value === "105") {
      let areamessage = language["Please select Area"];
      alert(areamessage);
    } else if (!payment) {
      let paymessage = language["Please select a payment type"];
      alert(paymessage);
    } else if (!selectedDate && deliveryOption === "2") {
      let datemessage = language["Please select Delivery Date"];
      alert(datemessage);
    } else if (parseFloat(subTotal) < parseFloat(deliveryInfo.minimum)) {
      let errormessage =
        language["Please select your order amount more than"] +
        "  " +
        deliveryInfo.minimum;
      alert(errormessage);
    } else {
      var products = [];
      var addonsArray = [];
      cart.cartItems.map((product, i) => {
        addonsArray = [];
        // product.addons.map((addon, j) => {
        //   addonsArray.push({
        //     title: addon.title,
        //     title_ar: addon.title_ar,
        //     titileId: addon.id,
        //     product: addon.product,
        //     minimum: addon.minimum,
        //     maximum: addon.maximum,
        //     data: {
        //       productId: addon.data.id,
        //       title: addon.data.title,
        //       product: addon.data.product,
        //       addon: addon.data.addon,
        //       item: addon.data.item,
        //       price: addon.data.price,
        //       now: addon.data.now,
        //       title_ar: addon.data.title_ar,
        //     },
        //   });
        // });
        products.push({
          product_id: product.id,
          product_name: product.title,
          product_name_ar: product.title_ar,
          product_price: product.price,
          // product_code: product.item_code,
          quantity: product.quantity,
          price: product.total_price,
          total: (
            parseInt(product.quantity) *
            (parseFloat(product.price) + parseFloat(product.addonPrice))
          ).toFixed(3),
          addons: product.addons,
          weight: product?.weight,
          extra_details: product.extradetails ? product.extradetails : "",
        });
      });

      var placeOrder = {
        fname: values.fname,
        lname: values.lname ? values.lname : "",
        email: values.email,
        phone: values.phonenumber,
        country: selectCountry ? selectCountry.value : "",
        area: selectedValue ? selectedValue.id : "",
        type:
          selectAny.value === "1"
            ? "House"
            : selectAny.value === "2"
              ? "Flat"
              : "Office",
        block: values.block,
        state: values.state ? values.state : "",
        pincode: values.pincode ? values.pincode : "",
        address: values.address ? values.address : "",
        address2: values.address2 ? values.address2 : "",
        street: values.street,
        house: values.houseno,
        building: values.building,
        avenue: values.avenue ? values.avenue : "",
        office: values.officeno,
        floor: values.floor,
        flat: values.flat,
        payment_method: payment.label,
        addr_type: "Delivery",
        price: parseFloat(subTotal).toFixed(3),
        currency: selectCountry ? selectCountry.currency.id : "",
        coupon: "",
        discount: "",
        delivery_charges: deliveryInfo.delivery_charges
          ? deliveryInfo.delivery_charges
          : "",
        total_price: (
          parseFloat(subTotal) + parseFloat(deliveryInfo.delivery_charges)
        ).toFixed(3),
        member_id: "-1",
        products: products,
        deliver_time: deliveryInfo.delivery_time
          ? deliveryInfo.delivery_time
          : "",
        directions: values.extradirections ? values.extradirections : "",
        delivery_timing: deliveryOption ? deliveryOption : "",
        delivery_date: selectedDate ? selectedDate : "",
        delivery_time: selectDeliveryTime ? selectDeliveryTime : "",
      };

      // console.log(placeOrder, "---");
      // setPlaceOrderDetails(placeOrder);
      // setIsPanelActive(true);
      if (trackingStatus.trackingPermission === 'authorized' || trackingStatus.trackingPermission === 'unavailable') {
        AppEventsLogger.logPurchase(placeOrder.total_price, "KWD", { param: placeOrder });
      }
      if (deliveryInfo && parseInt(deliveryInfo.cur_status) === 1) {
        setPlaceOrderDetails(placeOrder);
        setIsPanelActive(true);
      } else {
        let errormessage = language["Shop is busy"];
        alert(errormessage);
      }
    }
  }

  function getSelectedValue(item) {
    let temp = {
      country: selectCountry.value,
      area: item.id,
    };
    setSelectAddressId(temp);
    setSelectedValue(item);

    setModalVisible(false);
    setDummy(dummy + 1);
    getfetchDelivery(item.id, 0, 0);
  }

  function getDeliveryCharges(value) {
    // console.log(value, "---value in main");
    setDeliveryCharges(value);
  }
  function getCouponAmount(amount) {
    // console.log(amount);
  }

  function getPaymentMethod(value) {
    setPayment(value);
  }

  function getSubTotal(value) {
    setSubTotal(value);
  }
  const closePanel = () => {
    setIsPanelActive(false);
  };

  function getCountry(item) {
    // console.log(item);
    let temp = {
      country: item.value,
    };
    setSelectAddressId(temp);

    setDummy(dummy + 1);

    if (item.value === "105") {
      getfetchDelivery(item.value, 0, 0);
    } else {
      getfetchDelivery(item.value, 1, weightCalculate);
    }
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (selectAddressId) {
      // console.log(
      //   moment(date).format("DD-MM-YYYY"),
      //   moment(new Date()).format("DD-MM-YYYY")
      // );
      // setTomorrowDate(new Date(tomorrow));
      // console.log(moment(new Date(tomorrow)).format("DD-MM-YYYY"));
      // setSelectedDate(moment(new Date(tomorrow)).format("DD-MM-YYYY"));
      if (
        moment(new Date()).format("DD-MM-YYYY") ===
        moment(date).format("DD-MM-YYYY")
      ) {
        var today = moment();
        var tomorrow = today.add("days", 1);
        setSelectedDate(moment(new Date(tomorrow)).format("DD-MM-YYYY"));
      } else {
        setSelectedDate(moment(date).format("DD-MM-YYYY"));
      }
      hideDatePicker();

      // getfetchDeliveryTime(
      //   moment(date).format("DD-MM-YYYY"),
      //   selectAddressId.area
      // );
    } else {
      hideDatePicker();
      let errormessage = language["Please select Area"];
      alert(errormessage);
    }
  };
  function getfetchDelivery(areaId, type, weight) {
    setSpinner(true);
    // console.log(
    //   constants.API_BASE_URL + "delivery/" + areaId + "/" + type + "/" + weight
    // );
    Services(
      constants.API_BASE_URL + "delivery/" + areaId + "/" + type + "/" + weight
    ).then((response) => {
      // console.log(response, "response");
      if (response) {
        setDeliveryInfo(response);
        setSpinner(false);
        if (response && response.delivery_now === "0") {
          setDeliveryOption("2");
          var today = moment();
          var tomorrow = today.add("days", 1);
          setTomorrowDate(new Date(tomorrow));
        } else if (response && response.delivery_now === "1") {
          var today = moment();
          var tomorrow = today.add("days", 0);
          setTomorrowDate(new Date(tomorrow));
        }
        setDummy(dummy + 1);
        if (parseFloat(subTotal) < parseFloat(response.minimum)) {
          setSpinner(false);
          let errormessage =
            language["Please select your order amount more than"] +
            "  " +
            (I18nManager.isRTL
              ? country.currency.currency
              : country.currency.currency_ar) +
            "  " +
            response.minimum;
          alert(errormessage);
        }
        setDummy(dummy + 1);
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  }
  function getfetchDeliveryTime(date, areaId) {
    setSpinner(true);

    Services().then((response) => {
      // constants.API_BASE_URL + "delivery_time/" + areaId + "/" + date
      if (response) {
        if (response === "") {
          let errormessage = language["Please select a different date"];
          alert(errormessage);
        }
        setDeliveryTime(response);
        setSpinner(false);
      } else {
        if (response === "") {
          let errormessage = language["Please select a different date"];
          alert(errormessage);
        }
        setSpinner(false);
      }
    });
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
        <Header screen={"CheckOut"} title={language["Guest CheckOut"]} />
      </View>
      <Formik
        initialValues={{
          email: "",
          fname: "",
          lname: "",
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
            <View style={{ flex: 1 }}>
              <ScrollView>
                <View style={{ flex: 0.95 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(2),
                      color: Colors.black,
                      textTransform: "uppercase",
                      margin: responsiveWidth(3),
                      textAlign: "left",
                    }}
                  >
                    {language["Your Details"]}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
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
                          placeholder={language["Full Name"] + " *"}
                          keyboardType="default"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("fname")}
                          onBlur={handleBlur("fname")}
                          value={values.fname}
                          style={{
                            paddingHorizontal: responsiveWidth(2),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            emailInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>

                      <TouchableOpacity
                        style={{ flex: 0.1, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.fname,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.fname && touched.fname ? (
                          <Error display={errors.fname && touched.fname} />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                    {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 0.5,
                        marginHorizontal: responsiveWidth(2),
                        borderBottomWidth: 0.5,
                        borderBottomColor: "lightgrey",
                        // borderRadius: 25,
                        marginTop: responsiveWidth(2),
                      }}
                    >
                      <View style={{ flex: 0.8, justifyContent: "center" }}>
                        <TextInput
                          placeholder={language["Last Name"] + " *"}
                          keyboardType="default"
                          autoCapitalize="none"
                          placeholderTextColor="grey"
                          onChangeText={handleChange("lname")}
                          onBlur={handleBlur("lname")}
                          value={values.lname}
                          style={{
                            paddingHorizontal: responsiveWidth(2),
                            width: "100%",
                            fontFamily: Fonts.textfont,
                            textAlign: I18nManager.isRTL ? "right" : "left",
                            height: 50,
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            lname.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>

                      <TouchableOpacity
                        style={{ flex: 0.2, justifyContent: "center" }}
                        onPress={() =>
                          Toast.showWithGravity(
                            errors.lname,
                            Toast.SHORT,
                            Toast.BOTTOM
                          )
                        }
                      >
                        {errors.lname && touched.lname ? (
                          <Error display={errors.lname && touched.lname} />
                        ) : null}
                      </TouchableOpacity>
                    </View>*/}
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
                        placeholder={language["Email Address"] + " *"}
                        ref={(input) => {
                          emailInput = input;
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="grey"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        style={{
                          paddingLeft: responsiveWidth(2),
                          width: "100%",
                          fontFamily: Fonts.textfont,
                          textAlign: I18nManager.isRTL ? "right" : "left",
                          height: 50,
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          phonenumber.focus();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ flex: 0.1, justifyContent: "center" }}
                      onPress={() =>
                        Toast.showWithGravity(
                          errors.email,
                          Toast.SHORT,
                          Toast.BOTTOM
                        )
                      }
                    >
                      {errors.email && touched.email ? (
                        <Error display={errors.email && touched.email} />
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
                        placeholder={language["Phone Number"] + " *"}
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
                          paddingLeft: responsiveWidth(2),
                          width: "100%",
                          fontFamily: Fonts.textfont,
                          textAlign: I18nManager.isRTL ? "right" : "left",
                          height: 50,
                        }}
                        returnKeyType="next"
                        maxLength={8}
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
                  <Text
                    style={{
                      fontFamily: Fonts.textbold,
                      fontSize: responsiveFontSize(2),
                      color: Colors.black,
                      textTransform: "uppercase",
                      margin: responsiveWidth(3),
                      marginTop: responsiveWidth(3),
                      textAlign: "left",
                    }}
                  >
                    {language["Delivery Address"]}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 0.5,
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
                          accessibilityLabel: "Country *",
                          flex: 1,
                        }}
                        placeholder={{}}
                        useNativeAndroidPickerStyle={false}
                        value={selectCountry.value}
                        onValueChange={(value) => {
                          countries.filter((items) => {
                            if (items.value === value) {
                              setSelectCountry(items);

                              if (value !== "105") {
                                getCountry(items);
                                setCod(0);
                              } else {
                                setCod(1);
                              }
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
                        <View
                          style={{
                            width: responsiveWidth(100),
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: responsiveWidth(3),
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

                  {selectCountry.value === "105" ? (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 0.5,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                          alignItems: "center",
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
                            margin: responsiveWidth(3),
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
                            marginHorizontal: responsiveWidth(2),
                            padding: responsiveWidth(1),
                            resizeMode: "contain",
                            tintColor: Colors.black,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1,
                            marginHorizontal: responsiveWidth(2),
                            borderBottomWidth: 0.5,
                            borderBottomColor: "lightgrey",
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
                            marginTop: responsiveWidth(2),
                          }}
                        >
                          <View
                            style={{ flex: 0.85, justifyContent: "center" }}
                          >
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
                            style={{ flex: 0.15, justifyContent: "center" }}
                            onPress={() =>
                              Toast.showWithGravity(
                                errors.street,
                                Toast.SHORT,
                                Toast.BOTTOM
                              )
                            }
                          >
                            {errors.street && touched.street ? (
                              <Error
                                display={errors.street && touched.street}
                              />
                            ) : null}
                          </TouchableOpacity>
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
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                          marginHorizontal: responsiveWidth(2),
                          borderBottomWidth: 0.5,
                          borderBottomColor: "lightgrey",
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <RNPickerSelect
                          // pickerProps={{
                          //   accessibilityLabel: "Select Any *",
                          //   flex: 1,
                          // }}
                          placeholder={{}}
                          fixAndroidTouchableBug={true}
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
                              paddingHorizontal: responsiveWidth(3),
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
                            marginTop: responsiveWidth(2),
                            // borderRadius: 25,
                            // marginTop: responsiveWidth(2),
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
                                  paddingLeft: responsiveWidth(2),
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
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 0.5,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
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
                                      paddingLeft: responsiveWidth(2),
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
                                  flex: 0.5,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
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
                                      paddingLeft: responsiveWidth(2),
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
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 0.5,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
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
                                      paddingLeft: responsiveWidth(2),
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
                                  flex: 0.5,
                                  marginHorizontal: responsiveWidth(2),
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: "lightgrey",
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
                                      paddingLeft: responsiveWidth(2),
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
                          marginTop: responsiveWidth(2),
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            marginBottom: responsiveWidth(2),
                          }}
                        >
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
                              paddingLeft: responsiveWidth(2),
                              width: "100%",
                              fontFamily: Fonts.textfont,
                              textAlign: I18nManager.isRTL ? "right" : "left",
                              height: 50,
                              marginBottom: responsiveWidth(2),
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
                          borderWidth: 0.5,
                          borderColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                          paddingLeft: responsiveWidth(2),
                          backgroundColor: "white",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: "grey",
                          elevation: 5,
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
                          borderWidth: 0.5,
                          borderColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                          paddingLeft: responsiveWidth(2),
                          backgroundColor: "white",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: "grey",
                          elevation: 5,
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
                          borderWidth: 0.5,
                          borderColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                          paddingLeft: responsiveWidth(2),
                          backgroundColor: "white",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: "grey",
                          elevation: 5,
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
                          borderWidth: 0.5,
                          borderColor: "lightgrey",
                          // borderRadius: 25,
                          marginTop: responsiveWidth(2),
                          paddingLeft: responsiveWidth(2),
                          backgroundColor: "white",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: "grey",
                          elevation: 5,
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
                <Text
                  style={{
                    fontFamily: Fonts.textbold,
                    fontSize: responsiveFontSize(2),
                    fontWeight: "normal",
                    color: Colors.black,
                    textTransform: "uppercase",
                    margin: responsiveWidth(3),
                  }}
                >
                  {language["Delivery Time"]}
                </Text>
                <View
                  style={{
                    flex: 1,

                    // alignItems: "center",
                    // justifyContent: "space-between",
                    // marginHorizontal: responsiveWidth(5),

                    marginTop: responsiveWidth(1),
                    borderRadius: 10,
                    paddingHorizontal: responsiveWidth(5),
                  }}
                >
                  {settings.settings.delivery_now === "1" ||
                    (deliveryInfo && deliveryInfo.delivery_no === "1") ? (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ flex: 1 }}
                        pointerEvents={
                          deliveryInfo && deliveryInfo.delivery_now === "0"
                            ? "none"
                            : "auto"
                        }
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            // justifyContent: "center",
                            alignItems: "center",
                            marginTop: responsiveWidth(1),
                          }}
                          onPress={() => {
                            setDeliveryOption("1");
                            setSelectedDate(null);
                            setSelectDeliveryTime(null);
                          }}
                        >
                          <Image
                            source={
                              deliveryOption === "1"
                                ? Images.paymentafter
                                : Images.paymentbefore
                            }
                            style={{
                              width: responsiveWidth(4),
                              height: responsiveWidth(4),
                              resizeMode: "contain",
                            }}
                          />

                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color:
                                deliveryOption === "2"
                                  ? Colors.lightgrey
                                  : Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivered within"]}{" "}
                            {/* {deliveryInfo && deliveryInfo.delivery_now === "1" */}
                            {deliveryInfo
                              ? I18nManager.isRTL
                                ? deliveryInfo.delivery_time_ar
                                : deliveryInfo.delivery_time
                              : language["Selected  Area"]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            // justifyContent: "center",
                            alignItems: "center",
                            marginTop: responsiveWidth(2),
                          }}
                          onPress={() => setDeliveryOption("2")}
                        >
                          <Image
                            source={
                              deliveryOption === "2"
                                ? Images.paymentafter
                                : Images.paymentbefore
                            }
                            style={{
                              width: responsiveWidth(4),
                              height: responsiveWidth(4),
                              resizeMode: "contain",
                            }}
                          />

                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color:
                                deliveryOption === "1"
                                  ? Colors.lightgrey
                                  : Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivery Later"]}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            paddingBottom: responsiveWidth(2),
                            marginTop: responsiveWidth(2),
                          }}
                          pointerEvents={
                            deliveryOption === "1" ? "none" : "auto"
                          }
                        >
                          <View style={{ flex: 0.5 }}>
                            <Text
                              style={{
                                fontFamily: Fonts.textfont,
                                fontSize: responsiveFontSize(1.8),
                                color:
                                  deliveryOption === "1"
                                    ? Colors.lightgrey
                                    : Colors.black,
                                textTransform: "capitalize",
                                marginHorizontal: responsiveWidth(2),
                                textAlign: "left",
                              }}
                            >
                              {language["Delivery Date"] + " *"}
                            </Text>
                            <TouchableOpacity
                              style={{
                                height: 45,
                                borderWidth: 1,
                                borderColor: "black",
                                marginHorizontal: responsiveWidth(2),
                                justifyContent: "center",
                                marginTop: responsiveWidth(2),
                              }}
                              onPress={showDatePicker}
                            >
                              <Text
                                style={{
                                  fontFamily: Fonts.textbold,
                                  fontSize: responsiveFontSize(1.8),
                                  color:
                                    deliveryOption === "1"
                                      ? Colors.lightgrey
                                      : Colors.black,
                                  textTransform: "uppercase",
                                  textAlign: "left",
                                  marginHorizontal: responsiveWidth(2),
                                }}
                              >
                                {selectedDate
                                  ? selectedDate
                                  : language["Select Date"]}
                              </Text>
                              <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                // minimumDate={new Date()}
                                minimumDate={tomorrowDate}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                              />
                            </TouchableOpacity>
                          </View>

                          {/* <View
                            style={{
                              flex: 0.5,
                              marginTop: I18nManager.isRTL
                                ? responsiveWidth(0)
                                : 0,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.textfont,
                                fontSize: responsiveFontSize(1.8),
                                color:
                                  deliveryOption === "1"
                                    ? Colors.lightgrey
                                    : Colors.black,
                                textTransform: "capitalize",
                                marginHorizontal: responsiveWidth(2),
                                textAlign: "left",
                              }}
                            >
                              {language["Delivery Time"] + " *"}
                            </Text>
                            <View
                              style={{
                                height: 45,
                                borderWidth: 1,
                                borderColor: "black",
                                marginHorizontal: responsiveWidth(2),
                                justifyContent: "center",
                                marginTop: responsiveWidth(2),
                              }}
                            >
                              <RNPickerSelect
                                fixAndroidTouchableBug={true}
                                pickerProps={{
                                  accessibilityLabel: selectDeliveryTime,
                                }}
                                placeholder={{
                                  label: language["Select Time"],
                                  value: "",
                                }}
                                items={deliveryTime}
                                useNativeAndroidPickerStyle={true}
                                onValueChange={(value) => {
                                  setSelectDeliveryTime(value);
                                }}
                                // onDonePress={() => onUpdateItem(item)}
                                style={{
                                  ...styles,
                                  // iconContainer: {
                                  //   top: responsiveWidth(1),
                                  //   color: Colors.black,
                                  //   alignItems: "center",
                                  // },
                                }}
                                value={selectDeliveryTime}
                              >
                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    // justifyContent: "center",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.textbold,
                                      fontSize: responsiveFontSize(1.8),
                                      color:
                                        deliveryOption === "1"
                                          ? Colors.lightgrey
                                          : Colors.black,
                                      textTransform: "uppercase",
                                      textAlign: "center",
                                      marginHorizontal: responsiveWidth(2),
                                    }}
                                  >
                                    {selectDeliveryTime
                                      ? moment(
                                          moment(
                                            selectDeliveryTime,
                                            "DD-MM-YYYY h:mm:ss a"
                                          )
                                        ).format("h:mm A")
                                      : language["Select Time"]}
                                  </Text>

                                  <Image
                                    source={Images.downarrow}
                                    style={{
                                      width: responsiveWidth(4),
                                      height: responsiveWidth(4),
                                      margin: responsiveWidth(2),
                                      resizeMode: "contain",
                                      tintColor:
                                        deliveryOption === "1"
                                          ? Colors.lightgrey
                                          : Colors.black,
                                    }}
                                  />
                                </TouchableOpacity>
                              </RNPickerSelect>
                            </View>
                          </View> */}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          // justifyContent: "center",
                          alignItems: "center",
                          marginTop: responsiveWidth(2),
                        }}
                        onPress={() => setDeliveryOption("2")}
                      >
                        <Image
                          source={
                            deliveryOption === "2"
                              ? Images.paymentafter
                              : Images.paymentbefore
                          }
                          style={{
                            width: responsiveWidth(4),
                            height: responsiveWidth(4),
                            resizeMode: "contain",
                          }}
                        />

                        <Text
                          style={{
                            fontFamily: Fonts.textfont,
                            fontSize: responsiveFontSize(1.8),
                            color: Colors.black,
                            textTransform: "capitalize",
                            marginHorizontal: responsiveWidth(2),
                            textAlign: "left",
                          }}
                        >
                          {language["Delivery Later"]}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          paddingBottom: responsiveWidth(2),
                          marginTop: responsiveWidth(2),
                        }}
                        pointerEvents={deliveryOption === "1" ? "none" : "auto"}
                      >
                        <View style={{ flex: 0.5 }}>
                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color: Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivery Date"] + " *"}
                          </Text>
                          <TouchableOpacity
                            style={{
                              height: 45,
                              borderWidth: 1,
                              borderColor: "black",
                              marginHorizontal: responsiveWidth(2),
                              justifyContent: "center",
                              marginTop: responsiveWidth(2),
                            }}
                            onPress={showDatePicker}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.textbold,
                                fontSize: responsiveFontSize(1.8),
                                color: Colors.black,
                                textTransform: "uppercase",
                                textAlign: "left",
                                marginHorizontal: responsiveWidth(2),
                              }}
                            >
                              {selectedDate
                                ? selectedDate
                                : language["Select Date"]}
                            </Text>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              // minimumDate={new Date()}
                              minimumDate={tomorrowDate}
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </TouchableOpacity>
                        </View>

                        {/* <View
                          style={{
                            flex: 0.5,
                            marginTop: I18nManager.isRTL ? 0 : 0,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.textfont,
                              fontSize: responsiveFontSize(1.8),
                              color: Colors.black,
                              textTransform: "capitalize",
                              marginHorizontal: responsiveWidth(2),
                              textAlign: "left",
                            }}
                          >
                            {language["Delivery Time"] + " *"}
                          </Text>
                          <View
                            style={{
                              height: 45,
                              borderWidth: 1,
                              borderColor: "black",
                              marginHorizontal: responsiveWidth(2),
                              justifyContent: "center",
                              marginTop: responsiveWidth(2),
                            }}
                          >
                            <RNPickerSelect
                              fixAndroidTouchableBug={true}
                              pickerProps={{
                                accessibilityLabel: selectDeliveryTime,
                              }}
                              placeholder={{
                                label: language["Select Time"],
                                value: "",
                              }}
                              items={deliveryTime}
                              useNativeAndroidPickerStyle={true}
                              onValueChange={(value) => {
                                setSelectDeliveryTime(value);
                              }}
                              // onDonePress={() => onUpdateItem(item)}
                              style={{
                                ...styles,
                                // iconContainer: {
                                //   top: responsiveWidth(1),
                                //   color: Colors.black,
                                //   alignItems: "center",
                                // },
                              }}
                              value={selectDeliveryTime}
                            >
                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  // justifyContent: "center",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.textbold,
                                    fontSize: responsiveFontSize(1.8),
                                    color: Colors.black,
                                    textTransform: "uppercase",
                                    textAlign: "center",
                                    marginHorizontal: responsiveWidth(2),
                                  }}
                                >
                                  {selectDeliveryTime
                                    ? moment(
                                        moment(
                                          selectDeliveryTime,
                                          "DD-MM-YYYY h:mm:ss a"
                                        )
                                      ).format("h:mm A")
                                    : language["Select Time"]}
                                </Text>

                                <Image
                                  source={Images.downarrow}
                                  style={{
                                    width: responsiveWidth(4),
                                    height: responsiveWidth(4),
                                    margin: responsiveWidth(2),
                                    resizeMode: "contain",
                                    tintColor: Colors.black,
                                  }}
                                />
                              </TouchableOpacity>
                            </RNPickerSelect>
                          </View>
                        </View> */}
                      </View>
                    </View>
                  )}
                </View>
                {dummy === 1 ? (
                  <CommonCheckOut
                    getCouponAmount={getCouponAmount}
                    getPaymentMethod={getPaymentMethod}
                    getDeliveryCharges={
                      deliveryInfo &&
                        parseInt(deliveryInfo.delivery_charges) > 0
                        ? deliveryInfo.delivery_charges
                        : 0
                    }
                    selectAddressId={selectAddressId}
                    selectedValue={selectedValue}
                    getSubTotal={getSubTotal}
                    cod={cod}
                  />
                ) : null}
              </ScrollView>
              <TouchableOpacity
                style={{
                  // flex: 0.05,
                  // backgroundColor: settings.settings.color1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // borderRadius: 25,
                  // marginHorizontal: responsiveWidth(1),
                  // marginBottom: responsiveWidth(1),
                  height: 50,
                  backgroundColor: settings.settings.color1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveWidth(2),
                  flexDirection: "row",
                  marginHorizontal: responsiveWidth(1),
                  paddingHorizontal: responsiveWidth(2),
                  borderRadius: 5,
                  marginBottom: responsiveWidth(2),
                  borderWidth: 1,
                  borderColor: settings.settings.color1,
                }}
                onPress={() => {
                  if (
                    deliveryInfo &&
                    deliveryInfo.minimum &&
                    parseFloat(subTotal) < parseFloat(deliveryInfo.minimum)
                  ) {
                    let erromessge =
                      language["Please select your order amount more than"] +
                      "  " +
                      (I18nManager.isRTL
                        ? country.currency.currency
                        : country.currency.currency_ar) +
                      "  " +
                      deliveryInfo.minimum;
                    alert(erromessge);
                  } else {
                    handleSubmit();
                  }
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),
                    textTransform: "uppercase",
                  }}
                >
                  {language["Place Order"]}
                </Text>
                {/* <Text
                  style={{
                    color: settings.settings.color1,
                    fontFamily: Fonts.textfont,

                    fontSize: responsiveFontSize(2),
                    textTransform: "uppercase",
                  }}
                >
                  {deliveryInfo && deliveryInfo.minimum
                    ? parseFloat(subTotal) >= parseFloat(deliveryInfo.minimum)
                      ? language["Place Order"]
                      : language[
                          "Please select your order amount  more then or equal to"
                        ] +
                        "  " +
                        (I18nManager.isRTL
                          ? country.currency.currency
                          : country.currency.currency_ar) +
                        "  " +
                        deliveryInfo.minimum
                    : language["Place Order"]}
                </Text> */}
              </TouchableOpacity>
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
      <SwipeablePanel {...panelProps} isActive={isPanelActive}>
        <OrderSuccess
          closePanel={closePanel}
          placeOrder={placeOrderDetails}
          type={"guest"}
        />
      </SwipeablePanel>
      {spinner ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <ActivityIndicator color="black" size="small" />
        </View>
      ) : null}
    </View>
  );
}
