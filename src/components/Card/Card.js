import React from 'react';
import Draggable from 'react-draggable';
import $ from 'jquery'

const Card = ( props ) => {

    const cardPosition = props.transformCardPosition;
    //преобразовать viewpoint в пиксели если нужно
    if(cardPosition &&
        typeof(cardPosition.x) === 'string' &&
        typeof(cardPosition.y) === 'string') {
            if(cardPosition.x.includes('vw')) cardPosition.x = vwTOpx(parseFloat(cardPosition.x));
            if(cardPosition.y.includes('vh')) cardPosition.y = vhTOpx(parseFloat(cardPosition.y));
        }

        if(props.cardData.cardId === 'testingCard'){
            console.log(props.cardData.cardPath)
        }

    const card = <img 
                    className={props.className}
                    draggable='false'
                    id={props.cardData.cardId}
                    style={{
                        display: 'inline-block',
                        width: props.cardData.cardWidth,
                        position: 'absolute',
                        borderStyle: 'border-box',
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
                       onStart={(event) => {
                           //переместить колонку на позицию нажатия курсором
                        event.stopPropagation();
                        console.log($(`#${props.cardData.cardId}`).position().top);
                        $('.DraggableCardsColumn').css({
                            top: $(`#${props.cardData.cardId}`).position().top + 'px',
                            left: ($(`#${props.cardData.cardId}`).position().left + 2) + 'px'
                        });
                        //в качестве аргумента передаётся первая карта
                        //карты, которые следуют за ней функция получает самостоятельно
                        props.addCardsToDraggableColumn(props.cardData);
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
