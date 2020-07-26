import React from 'react';

import Header from '../components/Header/Header';
import classes from './Layout.module.css'
const Layout = ( props ) => {


    //ширину и высоту надо получать из App.js в зависимости от экрана
    return (
        <div className={classes.Layout}>
            <Header/>
            {props.children}
        </div>
    );
}

export default Layout;
