import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';
import { items, itemsHasErrored, itemsIsLoading } from './items';

export default combineReducers({
  //the auth piece of state is handled by the authReducer
  auth: authReducer,
  form: reduxForm,
  surveys: surveysReducer,
  items,
  itemsHasErrored,
  itemsIsLoading
});
