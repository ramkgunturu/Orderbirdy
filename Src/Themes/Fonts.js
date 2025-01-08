import { I18nManager } from "react-native";
const Fonts = {
  textfont: I18nManager.isRTL ? "Cairo-Regular" : "Poppins-Regular",
  textbold: I18nManager.isRTL ? "Cairo-Regular" : "Poppins-Light",
  textlight: I18nManager.isRTL ? "Cairo-Regular" : "Poppins-Light",
  textmedium: I18nManager.isRTL ? "Cairo-Regular" : "Poppins-Medium",
};

export default Fonts;
