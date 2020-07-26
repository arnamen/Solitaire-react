import React from 'react';

import classes from './CardsField.module.css'

const CardsField = ( props ) => {
    return (
        <div className={classes.CardsField}>
            {props.children}
        </div>
    );
}

export default CardsField;
