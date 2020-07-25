import React from 'react';

import classes from './CardsSetsStack.module.css'

const CardsSetsStack = ( props ) => {
    return (
        <div className={classes.CardsSetsStack}
        style={{
            marginTop: `${95-parseFloat(pixelToVH(props.height*2))}vh`,
            height: props.height,
            width: props.width}}>
            {props.children}
        </div>
    );
}

const pixelToVH = (value) => {
    return `${(100 * value) / window.innerHeight}vh`;
  }

export default CardsSetsStack;
