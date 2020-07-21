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
                     disableDrag = {!(cardIndex === props.cardsInColumn.length-1)}
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
        <div className={classes.CardsColumn}>
            {cardsInColumn}
        </div>
    );
}

export default CardsColumn;
