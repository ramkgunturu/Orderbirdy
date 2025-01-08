import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Fonts, Colors } from "@Themes";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    // paddingHorizontal: 40,
  },
  headerText: {
    textAlign: "center",
    color: Colors.lightblack,
    fontFamily: Fonts.textlight,
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveHeight(5),
    marginHorizontal: responsiveWidth(15),
    lineHeight: 25,
  },
  inputContainer: {
    backgroundColor: "#f4f6f8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputLabel: {
    paddingVertical: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(1),
    textAlign: "left",
    fontFamily: Fonts.textfont,
    fontSize: 16,
    color: Colors.black,
  },
  input: {
    color: "#353031",
    fontWeight: "normal",
    fontSize: 14,
    marginTop: 3,
    marginRight: 10,
    flex: 1,
  },
  error: {
    backgroundColor: "#cc0011",
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(6) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "normal",
  },
  button: {
    backgroundColor: "#9374b7",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "normal",
  },
  hairline: {
    backgroundColor: "#A2A2A2",
    height: 2,
    width: 120,
  },

  loginButtonBelowText1: {
    fontFamily: Fonts.textfont,
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: 5,
    alignSelf: "center",
    color: "#A2A2A2",
  },
});

export default styles;
