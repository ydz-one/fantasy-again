import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";
import { App } from "./components/App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducers } from "./reducers";
import * as serviceWorker from "./serviceWorker";
import { applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

ConfigProvider.config({
  theme: {
    primaryColor: "#6050e0",
  },
});

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <ConfigProvider>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
