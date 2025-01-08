import { StyleSheet } from "react-native";
import { Colors } from "@Themes";
import { responsiveWidth } from "react-native-responsive-dimensions";

export default styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  backTextWhite: {
    // color: "#FFF",
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: Colors.white,
    // backgroundColor: "red",
    borderColor: Colors.e4e4e4,
    borderWidth: 1,
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 10,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "grey",
    elevation: 5,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: Colors.white,
    flex: 1,
    // borderBottomColor: Colors.e4e4e4,
    // borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "center",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: responsiveWidth(10),
  },
  backRightBtnLeft: {
    backgroundColor: Colors.white,
    right: responsiveWidth(10),
  },
  backRightBtnRight: {
    backgroundColor: Colors.white,
    right: responsiveWidth(2),
  },
});
