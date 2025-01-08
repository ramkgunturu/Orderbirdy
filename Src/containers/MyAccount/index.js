import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  I18nManager,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import AnimatedLoadingButton from "react-native-animated-loading-button";
import { Images, Fonts, Colors } from "@Themes";
import { Header, SignIn, SignUp, ModalAlert, Countries } from "@components";
// import { Content } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@context/user-context";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { actions as cartActions } from "./../../redux/cart";
import { actions as whishListActions } from "./../../redux/whishlist";
import { CountryContext } from "@context/country-context";
import { LanguageContext } from "@context/lang-context";
import { SettingsContext } from "@context/settings-context";
import RNRestart from "react-native-restart";
import Services from "@Services";
import constants from "@constants";

const { height, width } = Dimensions.get("screen");
const url = constants.API_BASE_URL;
export default function MyAccount(props) {
  const dispatch = useDispatch();
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [deleteModalVisibles, setDeleteModalVisibles] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { country, setCountry } = useContext(CountryContext);
  const [checkUserLang, setCheckUserLang] = useState(null);
  const { language, setLanguage } = useContext(LanguageContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [textinput, setTextInput] = useState("");

  const navigation = useNavigation();
  loadingSingInButton = React.createRef();
  loadingSingUpButton = React.createRef();

  useEffect(() => {
    // setData(myAccountOptions);

    getLanguage();
  }, []);

  const myAccountOption = [
    //{
    //  id: 1,
    //   suboptionname: language["Change Country"],
    //  route: "ChangeCountry",
    //  imagepath: Images.flag,
    // },
    {
      id: 2,
      suboptionname: language["Change Language"],
      route: "ChangeLanguage",
      imagepath: Images.language,
    },
    {
      id: 3,
      suboptionname: language["Track Order"],
      route: "OrderTracking",
      imagepath: Images.trackorder,
    },
    // {
    //   id: 4,
    //   suboptionname: language["About Us"],
    //   route: "AboutUs",
    //   routetitle: "AboutUs",
    //   imagepath: Images.aboutus,
    // },

    // {
    //   id: 5,
    //   suboptionname: language["Privacy Policy"],
    //   route: "AboutUs",
    //   routetitle: "PrivacyPolicy",
    //   imagepath: Images.privacypolicy,
    // },
    // {
    //   id: 6,
    //   suboptionname: language["Terms & Conditions"],
    //   route: "AboutUs",
    //   routetitle: "Terms&Conditions",
    //   imagepath: Images.tconditions,
    // },

    {
      id: 7,
      suboptionname: language["Contact us"],
      route: "AboutUs",
      routetitle: "ContactUs",
      imagepath: Images.contactus,
    },
    // {
    //   id: 3,
    //   suboptionname: language["Our Store Locations"],
    //   route: "OurStoreLocations",
    //   imagepath: Images.storeloaction,
    // },
    // {
    //   id: 4,
    //   suboptionname: language["Live Chat"],
    //   route: "Live Chat",
    //   imagepath: Images.chat,
    // },
    // {
    //   id: 5,
    //   suboptionname: language["My Settings"],
    //   route: "MySettings",
    //   imagepath: Images.mysettings,
    // },

    // {
    //   id: 7,
    //   suboptionname: language["Rate our APP in App Store"],
    //   route: "RateStore",
    //   imagepath: Images.rate,
    // },
  ];

  const myAccountOptionLogin = [
    {
      id: 1,
      suboptionname: language["Change Country"],
      route: "ChangeCountry",
      imagepath: Images.flag,
    },

    {
      id: 2,
      suboptionname: language["Change Language"],
      route: "ChangeLanguage",
      imagepath: Images.language,
    },
    {
      id: 3,
      suboptionname: language["Track Order"],
      route: "OrderTracking",
      imagepath: Images.trackorder,
    },
    // {
    //   id: 4,
    //   suboptionname: language["About Us"],
    //   route: "AboutUs",
    //   routetitle: "AboutUs",
    //   imagepath: Images.aboutus,
    // },

    // {
    //   id: 5,
    //   suboptionname: language["Privacy Policy"],
    //   route: "AboutUs",
    //   routetitle: "PrivacyPolicy",
    //   imagepath: Images.privacypolicy,
    // },
    // {
    //   id: 6,
    //   suboptionname: language["Terms & Conditions"],
    //   route: "AboutUs",
    //   routetitle: "Terms&Conditions",
    //   imagepath: Images.tconditions,
    // },

    {
      id: 7,
      suboptionname: language["Contact us"],
      route: "AboutUs",
      routetitle: "ContactUs",
      imagepath: Images.contactus,
    },
    {
      id: 8,
      suboptionname: language["Delete Account"],
      route: "deleteaccount",
      routetitle: "DeleteAccount",
      imagepath: Images.contactus,
    },

    {
      id: 9,
      suboptionname: language["Sign out from your account"],
      route: "logout",
      imagepath: Images.logout,
    },
  ];

  const getLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("language");

      if (lang) {
        if (lang === "arabic") {
          setCheckUserLang("arabic");
        } else if (lang === "english") {
          setCheckUserLang("english");
        }
      } else {
        setCheckUserLang("english");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressSignIn = () => {
    setSignInModalVisible(true);
  };

  const onPressSignUp = () => {
    setSignUpModalVisible(true);
  };
  const onCloseSignIn = () => {
    setSignInModalVisible(false);
  };
  const onCloseSignUp = () => {
    setSignUpModalVisible(false);
  };
  const onPressMenu = (item) => {
    if (item.route === "AddAddress") {
      navigation.push(item.route);
    } else if (item.route === "logout") {
      setModalVisibles(true);
    } else if (item.route === "deleteaccount") {
      setDeleteModalVisibles(true);
    } else if (item.route === "ChangeCountry") {
      setModalVisible(true);
    } else if (item.route === "ChangeLanguage") {
      setLanguageModalVisible(true);
    } else {
      props.navigation.navigate(item.route, {
        title: item.suboptionname,
        route: item.routetitle,
      });
    }
  };
  const onLogOut = () => {
    AsyncStorage.removeItem("userDetails");
    setUser(null);
    cartActions.emptyCart(dispatch, null);
    whishListActions.emptyWhishlist(dispatch, null);
  };

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          paddingVertical: responsiveWidth(4),
          borderWidth: 0.5,
          borderColor: Colors.lightgrey,
          // justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.white,
        }}
        onPress={() => onPressMenu(item)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: item.route === "logout" ? 1 : 0.9,
          }}
        >
          {item && item.imagepath ? (
            item.suboptionname === language["Change Country"] ? (
              country ? (
                <Image
                  source={{ uri: country.currency.image }}
                  style={{
                    width: responsiveWidth(7),
                    height: responsiveWidth(7),
                    marginHorizontal: responsiveWidth(3),
                    // resizeMode: "contain",
                  }}
                />
              ) : (
                <Image
                  source={item.imagepath}
                  style={{
                    width: responsiveWidth(5),
                    height: responsiveWidth(5),
                    tintColor: Colors.black,
                    marginHorizontal: responsiveWidth(3),
                    resizeMode: "contain",
                  }}
                />
              )
            ) : (
              <Image
                source={item.imagepath}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: Colors.black,
                  marginHorizontal: responsiveWidth(3),
                  resizeMode: "contain",
                }}
              />
            )
          ) : null}
          <Text
            style={{
              textAlign: "left",
              fontSize: responsiveFontSize(2),
              color: Colors.lightblack,
              fontFamily: Fonts.textfont,
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            {item.suboptionname === language["Change Country"] && country
              ? I18nManager.isRTL
                ? country.title_ar
                : country.title
              : item.suboptionname}
          </Text>
        </View>
        {item.route === "logout" ? null : (
          <View style={{ flex: 0.1 }}>
            {I18nManager.isRTL ? (
              <Image
                source={Images.smallfrontarrow}
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(4),
                  paddingHorizontal: responsiveWidth(3),
                }}
              />
            ) : (
              <Image
                source={Images.back}
                style={{
                  width: responsiveWidth(4),
                  height: responsiveWidth(4),
                  paddingHorizontal: responsiveWidth(3),
                }}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.lightgrey,
      }}
    >
      <View
        style={{
          height: responsiveHeight(8),
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightgrey,
        }}
      >
        <Header
          screen={"My Youe"}
          title={user ? user.fname + " " + user.lname : language["My Account"]}
        />
      </View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          {user ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: responsiveWidth(5),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.push("MyOrders")}
              >
                <Image
                  source={Images.orders}
                  style={{
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    tintColor: Colors.black,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    fontFamily: Fonts.textfont,
                    paddingTop: responsiveHeight(2),
                    textAlign: "left",
                  }}
                >
                  {language["My Orders"]}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: responsiveWidth(5),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.push("MyAddress")}
              >
                <Image
                  source={Images.address}
                  style={{
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    tintColor: Colors.black,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    fontFamily: Fonts.textfont,
                    paddingTop: responsiveHeight(2),
                  }}
                >
                  {language["Saved Address"]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: responsiveWidth(5),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.push("Profile")}
              >
                <Image
                  source={Images.myaccount}
                  style={{
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    tintColor: Colors.black,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: responsiveFontSize(1.8),
                    color: Colors.black,
                    fontFamily: Fonts.textfont,
                    paddingTop: responsiveHeight(2),
                  }}
                >
                  {language["My Profile"]}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                marginTop: responsiveHeight(2),
                justifyContent: "center",
                alignItems: "center",
                //   marginHorizontal: responsiveWidth(10),
              }}
            >
              <Image
                source={Images.myaccount}
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  tintColor: Colors.black,
                  resizeMode: "contain",
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveFontSize(2),
                  color: Colors.black,
                  fontFamily: Fonts.textfont,
                  paddingTop: responsiveHeight(2),
                }}
              >
                {" "}
                {user ? null : language["Hey there! Come on in."]}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: responsiveFontSize(2),
                  color: Colors.grey,
                  fontFamily: Fonts.textfont,
                  paddingTop: responsiveHeight(2),
                  marginHorizontal: responsiveWidth(10),
                }}
              >
                {" "}
                {user
                  ? null
                  : language[
                      "Sign in below and get tapping! Your shopping bag awaits."
                    ]}
              </Text>
            </View>
          )}
        </View>
        {user ? null : (
          <AnimatedLoadingButton
            ref={(c) => (loadingSingUpButton = c)}
            containerStyle={{
              width: "100%",
              height: 50,
              marginTop: responsiveWidth(6),
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: responsiveWidth(8),
            }}
            buttonStyle={{
              borderWidth: 1,
              borderColor: settings.settings.color1,
              backgroundColor: settings.settings.color1,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
            // title={language["Log in"]}
            title={language["create an account"]}
            titleStyle={{
              textTransform: "uppercase",
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(2),
              color: Colors.white,
            }}
            onPress={() => onPressSignUp()}
          />
        )}
        {user ? null : (
          <AnimatedLoadingButton
            ref={(c) => (loadingSingInButton = c)}
            containerStyle={{
              width: "100%",
              height: 50,
              marginTop: responsiveWidth(3),
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: responsiveWidth(8),
            }}
            buttonStyle={{
              backgroundColor: settings.settings.color1,
              borderWidth: 1,
              borderColor: Colors.white,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
            // title={language["Log in"]}
            title={language["Sign In"]}
            titleStyle={{
              textTransform: "uppercase",
              fontFamily: Fonts.textfont,
              fontSize: responsiveFontSize(2),
              color: Colors.white,
            }}
            onPress={() => onPressSignIn()}
          />
        )}

        <FlatList
          data={user ? myAccountOptionLogin : myAccountOption}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          style={{ paddingTop: 20, paddingBottom: 10 }}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        transparent={false}
        visible={signInModalVisible}
        onRequestClose={() => {
          setSignInModalVisible(false);
        }}
      >
        <SignIn onCloseSignIn={onCloseSignIn} />
      </Modal>
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        transparent={false}
        visible={signUpModalVisible}
        onRequestClose={() => {
          setSignUpModalVisible(false);
        }}
      >
        <SignUp onCloseSignUp={onCloseSignUp} navigation={props.navigation} />
      </Modal>

      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={modalVisibles}
        onRequestClose={() => {
          setModalVisibles(false);
        }}
      >
        <ModalAlert
          title={language["Are sure you want to Logout?"]}
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setModalVisibles(false)}
          onPressLeft={() => {
            setModalVisibles(false);
            onLogOut();
          }}
          onPressRight={() => {
            setModalVisibles(false);
          }}
        />
      </Modal>

      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Countries onClose={() => setModalVisible(false)} />
      </Modal>

      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => {
          setLanguageModalVisible(false);
        }}
      >
        <ModalAlert
          title={
            checkUserLang === "english"
              ? language["Do you want to change your Language to Arabic?"]
              : language["Do you want to change your language to English?"]
          }
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setLanguageModalVisible(false)}
          onPressLeft={() => {
            {
              if (checkUserLang === "english") {
                I18nManager.forceRTL(true);
                AsyncStorage.setItem("language", "arabic");
              } else {
                I18nManager.forceRTL(false);
                AsyncStorage.setItem("language", "english");
              }
            }
            setLanguageModalVisible(false);

            RNRestart.Restart();
          }}
          onPressRight={() => {
            setLanguageModalVisible(false);
          }}
        />
      </Modal>
      <Modal
        animationType="fade"
        animationInTiming={800}
        avoidKeyboard={true}
        animationOut="fade"
        animationOutTiming={800}
        transparent={true}
        visible={deleteModalVisibles}
        onRequestClose={() => {
          setDeleteModalVisibles(false);
        }}
      >
        <ModalAlert
          title={
            language["Are sure you want to delete your account permanently?"]
          }
          leftTitle={language["OK"]}
          rightTitle={language["Cancel"]}
          onClose={() => setDeleteModalVisibles(false)}
          onPressLeft={async () => {
            {
              // console.log(await AsyncStorage.getItem("userDetails"), "id----");
              var data = await AsyncStorage.getItem("userDetails");

              Services(url + "profile_delete?member_id=" + data, "POST").then(
                (response) => {
                  // console.log(response, "---count");
                  if (response.status === "Success") {
                    setDeleteModalVisibles(false);
                    onLogOut();
                  }
                }
              );
            }
          }}
          onPressRight={() => {
            setDeleteModalVisibles(false);
          }}
        />
      </Modal>
    </View>
  );
}
