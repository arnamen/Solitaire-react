import React from 'react';
import Card from '../../Card/Card';

import classes from './CardsColumn.module.css'

const CardsColumn = ( props ) => {

    const cardsInColumn = props.cardsInColumn.map((cardData, cardIndex) => {

        return <Card cardData={cardData}
                    checkIfCardApplied={props.checkIfCardApplied}
                     transformCardPosition={{x: '-1vw', y: (3*cardIndex) + 'vh'}}
                     addCardsToDraggableColumn={props.addCardsToDraggableColumn}
                     hideCardValue={cardData.hideCardValue}
                     /* ОтключитьПеретягивание=НеПоследняяКартаВСтеке */
                     disableDrag = {!checkIfCardDraggable(cardData,props.cardsInColumn)}
                     insideColumnIndex={cardData.insideColumnIndex}
                     key={cardData.cardId}
                     style={{
                        left: `${2+9.8*cardData.columnIndex}vw`,
                        top: `${0.5}vh`
                     }}
                     />
    })

    //высота и ширина места для карт а 5% меньше самих карт
    return (
        <div className={classes.CardsColumn} id={props.columnId}>
            {cardsInColumn}
        </div>
    );
}

const checkIfCardDraggable = (card, columnWithCards) => {
    let draggable = true;
    
    for (let i = card.insideColumnIndex; i < columnWithCards.length - 1; i++) {
        
        //проверка что карты после выбранной распределены по приоритету, а сама выбранная карта не скрыта
        draggable = columnWithCards[i].priority - columnWithCards[i+1].priority === 1  && !card.hideCardValue && draggable; 
    }
    // console.log('card: ' + card.cardName +  ' draggable: ' + draggable + ' hide value: ' + card.hideCardValue)
    return draggable;
}

export default CardsColumn;
