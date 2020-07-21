import React from 'react';
import Draggable from 'react-draggable';

// import classes from './Card.module.css'

const Card = ( props ) => {

    const cardPosition = props.transformCardPosition;
    //преобразовать viewpoint в пиксели если нужно
    if(cardPosition &&
        typeof(cardPosition.x) === 'string' &&
        typeof(cardPosition.y) === 'string') {
            if(cardPosition.x.includes('vw')) cardPosition.x = vwTOpx(parseFloat(cardPosition.x));
            if(cardPosition.y.includes('vh')) cardPosition.y = vhTOpx(parseFloat(cardPosition.y));
        }
    const card = <img 
                    draggable='false'
                    id={props.cardData.cardId}
                    style={{
                        display: 'inline-block',
                        width: props.cardData.cardWidth,
                        position: 'absolute',
                        ...props.style
                        }}
                    key={props.cardData.cardId} 
                    src={props.cardData.hideCardValue ? props.cardData.cardShirt.cardPath : props.cardData.cardPath} 
                    alt={props.cardData.cardName}>
                </img>

    return (
            <Draggable disabled={props.disableDrag} 
                       defaultPosition ={cardPosition}
                       position={cardPosition}
                       onStop={() => {
                           props.defaultZIndexOnCard(props.cardData)
                           props.checkIfCardApplied();
                        }}
                       onStart={() => {
                           props.selectAndHighZIndexOnCard(props.cardData)
                           }}>
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
