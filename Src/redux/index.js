//@ts-check
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reducer as cart } from "./cart";
import { reducer as whishlist } from "./whishlist";
import { reducer as areas } from "./areas";

const config = {
  key: "root",
  storage: AsyncStorage,
};

export default persistCombineReducers(config, {
  cart,
  whishlist,
  areas,
});
