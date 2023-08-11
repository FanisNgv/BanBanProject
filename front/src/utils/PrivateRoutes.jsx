import React from 'react';
import {Route, Navigate, Routes} from 'react-router-dom';

const PrivateRoutes = ({ component: Component, ...rest }) => {
    return (
        localStorage.getItem('token')
            ? <Component {...rest} />
            : <Navigate to='/login' />
    )
}

export default PrivateRoutes;