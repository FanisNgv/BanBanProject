import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import PLogin from "./pages/login";
import PRegistration from "./pages/registration";
import Desk from "./components/Desk/Desk";
import PrivateRoutes from "./utils/PrivateRoutes";
import PHome from "./pages/home";
import {Helmet} from "react-helmet";
import Head from "./components/Head/Head";
import CreateTask from "./components/CreateTask/CreateTask";
import TaskList from "./components/TaskColumn/TaskColumn";
import EditTask from "./components/EditTask/EditTask";
import PDesk from "./pages/desk";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PHome />} />
                <Route path="/login" element={<PLogin />} />
                <Route path="/registration" element={<PRegistration />} />
                <Route path="*" element={<PLogin/>} />
                <Route path="/desk" element={<PDesk/>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;

