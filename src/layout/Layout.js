import React from 'react';

const Layout = ( props ) => {


    //ширину и высоту надо получать из App.js в зависимости от экрана
    return (
        <div>
            {props.children}
        </div>
    );
}

export default Layout;
