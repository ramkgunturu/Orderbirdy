import { StyleSheet } from "react-native";

import { Fonts, Colors } from "@Themes";

export default StyleSheet.create({
  inputtext: {
    borderWidth: 1,
    borderColor: Colors.black,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "center",
    fontFamily: Fonts.textfont,
    fontSize: 16,
    color: Colors.black,
  },
});
