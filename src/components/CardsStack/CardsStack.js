import React from 'react';

import classes from './CardsStack.module.css'

const CardsStack = ( props ) => {
    return (
        <div className={classes.CardsStack} 
        style={{height: props.height,
                width: props.width}}>
            {props.children}
        </div>
    );
}

export default CardsStack;
