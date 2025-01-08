import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image,
  Keyboard,
  ImageBackground,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";

import Services from "@Services";
import { Header, InputField, Areas } from "@components";
import constants from "@constants";
import { UserContext } from "@context/user-context";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import { Images, Fonts, Colors } from "@Themes";

const HouseSchema = Yup.object().shape({
  addresstitle: Yup.string().required("Address title is Required"),
  block: Yup.string().required("Block is  Required"),
  street: Yup.string().required("Street is  Required"),
  phonenumber: Yup.string()
    .matches("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[s./0-9]*$", "Format is not valid")
    .min(8, "Too Short!")
    .required("Phone Number is Required "),
  buildingnameno: Yup.string().required("Building Name is  Required"),
  floorno: Yup.string().required("Floor No is  Required"),
  flatno: Yup.string().required("Flat No is  Required"),
});

export default function Address(props) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectvalue, setSelectValue] = useState(null);
  const [selectany, setSelectAny] = useState(null);
  const [selectindex, setSelectIndex] = useState(null);
  const [userId, setUserId] = useState(null);
  const [item, setItem] = useState(null);
  const { user, setUser } = useContext(UserContext);

  loadingButton = React.createRef();
  // const userData = JSON.parse(user);
  // console.log(user.id, "userDatauserDatauserDatauserData")
  // console.log(props.route.params.item.item);
  const onSubmit = (values, { resetForm }) => {
    // console.log(values, '------');
    if (!selectvalue) {
      alert("Please select Area value");
    } else {
      values.area = selectvalue.id;
      values.userId = user.id;
      // console.log(values);
      var data = {
        member_id: values.userId,
        phone: values.phonenumber,
        title: values.addresstitle,
        area: values.area,
        block: values.block,
        street: values.street,
        building: values.buildingnameno,
        floor: values.floorno,
        flat: values.flatno,
      };
      if (item) {
        loadingButton.setLoading(true);
        data.address_id = item.id;
        onAddAddress(data, { resetForm });
      } else {
        loadingButton.setLoading(true);
        // console.log(values, "values")
        onAddAddress(data, { resetForm });
      }
    }
  };

  function onAddAddress(data, { resetForm }) {
    // loadingButton.setLoading(true);
    setSpinner(true);

    // console.log(data, "data")
    Services(constants.API_BASE_URL + "/address", data, "POST").then(
      (response) => {
        // console.log("logginnn", response);
        if (response.status === "Success") {
          loadingButton.setLoading(false);
          setSpinner(false);
          resetForm({});
          props.route.params.onNavigateBack();
          navigation.pop();
        } else {
          alert(response.message);
          loadingButton.setLoading(false);
          setSpinner(false);
        }
      }
    );
  }

  // function onUpdateAddress(values, { resetForm }) {
  //   //console.log('----inside', values);
  //   setSpinnerr(true);

  //   Mutations.updateAddress(values).then((response) => {
  //     //console.log('Adding Address-----', response);
  //     if (response) {
  //       setSpinnerr(false);
  //       if (response.status === "Success") {
  //         alert("Address updated successfully");

  //         resetForm({});
  //         setSelectValue(null);
  //         setSelectAny(null);
  //         setSelectIndex(null);
  //         props.route.params.callBack();
  //         props.navigation.pop();
  //       } else {
  //         alert(response.message);
  //       }
  //     } else {
  //       setSpinnerr(false);
  //     }
  //   });
  // }

  function getSelectedValue(selectarea) {
    setSelectValue(selectarea);
    setModalVisible(false);
  }

  useEffect(() => {
    // setSpinner(true);
    // fetchData();
    if (props.route.params && props.route.params.item) {
      setItem(props.route.params.item);
      setSelectValue({
        title: props.route.params.item.area,
        id: props.route.params.item.id,
      });
    }
  }, []);

  function fetchData() {
    Services(constants.API_BASE_URL + "/areas").then((response) => {
      // console.log(response, "responseresponseresponse")
      if (response) {
        setData(response);

        // setCategory(response[0].)
        setSpinner(false);
      } else {
        setSpinner(false);
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: responsiveHeight(8),
        }}
      >
        <Header screen={"AddAddress"} title={"Address"} />
      </View>

      <Formik
        initialValues={{
          addresstitle: item ? item.title : "",
          area: "",
          block: item ? item.block : "",
          street: item ? item.street : "",
          selectany: "",
          phonenumber: item ? item.phone : "",
          buildingnameno: item ? item.building : "",
          floorno: item ? item.floor : "",
          flatno: item ? item.flat : "",
          userId: userId,
        }}
        enableReinitialize={true}
        validationSchema={HouseSchema}
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
              {/* <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Images.addressgif}
                    style={{
                      width: responsiveWidth(100),
                      height: responsiveWidth(50),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </View> */}

              <View
                style={{
                  flex: 0.92,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  paddingTop: responsiveWidth(2),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: responsiveWidth(2),
                  }}
                >
                  <View style={{ flex: 0.5, margin: 5 }}>
                    {/* <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          margin: 5,
                        }}></Text> */}
                    <InputField
                      placeholder={" Address Title *"}
                      keyboardType={"default"}
                      secureTextEntry={false}
                      onChangeText={handleChange("addresstitle")}
                      onBlur={handleBlur("addresstitle")}
                      value={values.addresstitle}
                      pointerEvents={"auto"}
                      style={{
                        fontFamily: Fonts.textfont,
                      }}
                    />
                    {errors.addresstitle && touched.addresstitle ? (
                      <Text
                        style={{
                          color: "red",
                          marginTop: 5,
                          // marginLeft: 10,
                          fontFamily: Fonts.textfont,
                        }}
                      >
                        {errors.addresstitle}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ flex: 0.5, margin: 5 }}>
                    {/* <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          margin: 5,
                        }}></Text> */}

                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        Keyboard.dismiss();
                        setModalVisible(true);
                      }}
                    >
                      <InputField
                        placeholder={"Area *"}
                        modelarea={"Area"}
                        pointerEvents={"none"}
                        editable={false}
                        defaultvalue={selectvalue ? selectvalue.title : ""}
                        style={{ fontFamily: Fonts.textfont }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: responsiveWidth(2),
                  }}
                >
                  <View style={{ flex: 0.5, margin: 5 }}>
                    {/* <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          margin: 5,
                        }}></Text> */}
                    <InputField
                      placeholder="Block *"
                      keyboardType={"default"}
                      secureTextEntry={false}
                      onChangeText={handleChange("block")}
                      onBlur={handleBlur("block")}
                      value={values.block}
                      style={{
                        fontFamily: Fonts.textfont,
                      }}
                    />
                    {errors.block && touched.block ? (
                      <Text
                        style={{
                          color: "red",
                          marginTop: 8,
                          // marginLeft: 10,
                          fontFamily: Fonts.textfont,
                        }}
                      >
                        {errors.block}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ flex: 0.5, margin: 5 }}>
                    {/* <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          margin: 5,
                        }}></Text> */}
                    <InputField
                      placeholder={"Street *"}
                      keyboardType={"default"}
                      secureTextEntry={false}
                      onChangeText={handleChange("street")}
                      onBlur={handleBlur("street")}
                      value={values.street}
                      style={{
                        fontFamily: Fonts.textfont,
                      }}
                    />
                    {errors.street && touched.street ? (
                      <Text
                        style={{
                          color: "red",
                          marginTop: 8,
                          // marginLeft: 10,
                          fontFamily: Fonts.textfont,
                        }}
                      >
                        {errors.street}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: responsiveWidth(2),
                    }}
                  >
                    <View style={{ flex: 1, margin: 5 }}>
                      {/* <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            margin: 5,
                          }}></Text> */}
                      <InputField
                        placeholder={"Building *"}
                        keyboardType={"default"}
                        secureTextEntry={false}
                        onChangeText={handleChange("buildingnameno")}
                        onBlur={handleBlur("buildingnameno")}
                        value={values.buildingnameno}
                        style={{
                          fontFamily: Fonts.textfont,
                        }}
                      />
                      {errors.buildingnameno && touched.buildingnameno ? (
                        <Text
                          style={{
                            color: "red",
                            marginTop: 8,
                            // marginLeft: 10,
                            fontFamily: Fonts.textfont,
                          }}
                        >
                          {errors.buildingnameno}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: responsiveWidth(2),
                    }}
                  >
                    <View style={{ flex: 0.5, margin: 5 }}>
                      {/* <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            margin: 5,
                          }}></Text> */}
                      <InputField
                        placeholder={"Floor No *"}
                        keyboardType={"default"}
                        secureTextEntry={false}
                        onChangeText={handleChange("floorno")}
                        onBlur={handleBlur("floorno")}
                        value={values.floorno}
                        style={{
                          fontFamily: Fonts.textfont,
                        }}
                      />
                      {errors.floorno && touched.floorno ? (
                        <Text
                          style={{
                            color: "red",
                            marginTop: 8,
                            // marginLeft: 10,
                            fontFamily: Fonts.textfont,
                          }}
                        >
                          {errors.floorno}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{ flex: 0.5, margin: 5 }}>
                      {/* <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            margin: 5,
                          }}></Text> */}
                      <InputField
                        placeholder={" Flat No *"}
                        keyboardType={"default"}
                        secureTextEntry={false}
                        onChangeText={handleChange("flatno")}
                        onBlur={handleBlur("flatno")}
                        value={values.flatno}
                        style={{
                          fontFamily: Fonts.textfont,
                        }}
                      />
                      {errors.flatno && touched.flatno ? (
                        <Text
                          style={{
                            color: "red",
                            marginTop: 8,
                            // marginLeft: 10,
                            fontFamily: Fonts.textfont,
                          }}
                        >
                          {errors.flatno}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    margin: 5,
                    paddingTop: responsiveWidth(2),
                  }}
                >
                  {/* <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        margin: 5,
                      }}></Text> */}
                  <InputField
                    placeholder={"Phone Number *"}
                    keyboardType={"numeric"}
                    secureTextEntry={false}
                    onChangeText={handleChange("phonenumber")}
                    onBlur={handleBlur("phonenumber")}
                    returnKeyType={"done"}
                    value={values.phonenumber}
                    maxLength={8}
                  />
                  {errors.phonenumber && touched.phonenumber ? (
                    <Text
                      style={{
                        color: "red",
                        marginTop: 8,
                        // marginLeft: 10,
                        fontFamily: Fonts.textfont,
                      }}
                    >
                      {errors.phonenumber}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  flex: 0.08,
                  marginTop: 20,
                  // paddingHorizontal: 10,
                  backgroundColor: "white",
                }}
              >
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    height: responsiveHeight(7),
                    // borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      color: "white",
                    
                      fontFamily: Fonts.textfont,
                    }}
                  >
                    SUBMIT
                    </Text>
                </TouchableOpacity> */}
                <AnimatedLoadingButton
                  // ref={(loadingButton) =>
                  //   (this.loadingButton = loadingButton)
                  // }
                  ref={(c) => (loadingButton = c)}
                  containerStyle={{
                    backgroundColor: "black",
                    height: responsiveHeight(7),
                    // borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.black,
                    // borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  // title={language["Log in"]}
                  title={"SUBMIT"}
                  titleStyle={{
                    fontFamily: Fonts.textfont,
                    fontSize: responsiveFontSize(2),
                    color: Colors.white,
                  }}
                  onPress={handleSubmit}
                />
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <Areas
                  data={data}
                  getSelected={getSelectedValue}
                  onClose={() => setModalVisible(false)}
                />
              </Modal>
            </View>
          );
        }}
      </Formik>
      {spinner ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "transparent",
          }}
        />
      ) : null}
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
