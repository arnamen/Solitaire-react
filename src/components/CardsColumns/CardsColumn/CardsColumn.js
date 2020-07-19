import React from 'react';

import Card from '../../Card/Card';

import classes from './CardsColumn.module.css'

const CardsColumn = ( props ) => {

    const cardsInColumn = props.cardsInColumn.map((cardData, cardIndex) => {
        return <Card cardPath={cardData.cardPath}
                     cardName={cardData.cardName}
                     transformCardPosition={{x: '0//-1vw', y: (-0.5 + 2*cardIndex) + 'vh'}}
                     cardWidth='126px'
                     /* ОтключитьПеретягивание=НеПоследняяКартаВСтеке */
                     disableDrag = {!(cardIndex === props.cardsInColumn.length-1)}
                     cardId = {cardData.cardId}
                     cardIndex = {cardData.cardIndex}
                     columnIndex = {cardData.columnIndex}
                     key={cardData.cardId}/>
    })

    //высота и ширина места для карт а 5% меньше самих карт
    return (
        <div className={classes.CardsColumn}>
            {cardsInColumn}
        </div>
    );
}

export default CardsColumn;
