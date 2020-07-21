import React from 'react';
import Draggable from 'react-draggable'

import Card from '../../Card/Card';
import classes from './DraggableCardsColumn.module.css'

const DraggableCardColumn = ( props ) => {
    //в пропсы так же отправлять position left+top

    const cardsInColumn = props.cardsInColumn.map(( cardData, cardIndex ) => {
        return <Card cardData={cardData}
                checkIfCardApplied={props.checkIfCardApplied}
                transformCardPosition={{x: '-1vw', y: (2*cardIndex) + 'vh'}}
                selectAndHighZIndexOnCard={props.selectAndHighZIndexOnCard}
                defaultZIndexOnCard={props.defaultZIndexOnCard}
                hideCardValue={cardData.hideCardValue}
                /* ОтключитьПеретягивание=НеПоследняяКартаВСтеке */
                disableDrag = {!(cardIndex === props.cardsInColumn.length-1)}
                insideColumnIndex={cardData.insideColumnIndex}
                key={cardData.cardId}
                style={{
                    left: `${2+9.8*cardData.columnIndex}vw`,
                    top: `${0.5}vh`
                }}/>
    })

    return (
         props.cardsInColumn ? <Draggable>
            <div className={classes.DraggableCardsColumn}>
                {cardsInColumn}
            </div>
        </Draggable> : null
    );
}

export default DraggableCardColumn;
