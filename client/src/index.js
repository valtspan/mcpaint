import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from "redux";
import { middleware } from "./api/socket-api"

import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";

import rootReducer from "./store/rootReducer";
import App from "./components/App";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  features: {
    persist: false,
  },
}) || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
