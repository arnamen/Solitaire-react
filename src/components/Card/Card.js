import React from 'react';
import Draggable from 'react-draggable';

const Card = ( props ) => {

    const cardPosition = props.transformCardPosition;
    //преобразовать viewpoint в пиксели если нужно
    if(cardPosition &&
        typeof(cardPosition.x) === 'string' &&
        typeof(cardPosition.y) === 'string') {
            if(cardPosition.x.includes('vw')) cardPosition.x = vwTOpx(parseFloat(cardPosition.x));
            if(cardPosition.y.includes('vh')) cardPosition.y = vhTOpx(parseFloat(cardPosition.y));
        }
    
    const card = <img draggable='false'
                    id={props.cardId}
                    style={{
                        display: 'inline-block',
                        width: props.cardWidth,
                        position: 'absolute',
                        }}
                    key={props.cardId} src={props.cardPath} 
                    alt={props.cardName}>
                </img>

    return (
            <Draggable disabled={props.disableDrag} 
                       defaultPosition ={cardPosition}>
                {card}
            </Draggable>
    );
}

const vwTOpx = (value) => {
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;
        // y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    let result = (x*value)/100; // значение viewpoint width->pixels
    return result;
}
  
const vhTOpx = (value) => {
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        // x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    let result = (y*value)/100; // значение viewpoint height->pixels
    return result;
}

export default Card;
