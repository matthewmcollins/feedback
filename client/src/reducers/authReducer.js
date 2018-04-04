import { FETCH_USER } from "../actions/types";

//decides whether or not the user is logged in
//return null by default which means we don't know if the user is logged in
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      //if are logged in, payload will be truthy, else it will '' which will return false
      return action.payload || false;
    default:
      return state;
  }
}
