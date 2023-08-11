import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import App from "./App";
import {Provider} from "react-redux";
import {createStore} from "redux";
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
)