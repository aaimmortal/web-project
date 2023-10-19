import { createStore } from 'redux';
import counterReducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(counterReducer,composeWithDevTools());

export default store;