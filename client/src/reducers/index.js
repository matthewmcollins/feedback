import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { items, itemsHasErrored, itemsIsLoading } from "./items";

export default combineReducers({
  //the auth piece of state is handled by the authReducer
  auth: authReducer,
  items,
  itemsHasErrored,
  itemsIsLoading
});
