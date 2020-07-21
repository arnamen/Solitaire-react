import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import classes from './CardsColumns.module.css'
import CardsColumn from './CardsColumn/CardsColumn';

const CardsColumns = ( props ) => {
    let columnsWithCards = [];
    Object.keys(props.cardsColumns)
        // eslint-disable-next-line array-callback-return
        .map((ColumnWithCards, columnIndex) => {
            columnsWithCards.push(

                <CardsColumn columnWidth={props.columnWidth}
                checkIfCardApplied={props.checkIfCardApplied}
                selectAndHighZIndexOnCard={props.selectAndHighZIndexOnCard}
                defaultZIndexOnCard={props.defaultZIndexOnCard}
                cardsStackLength={props.cardsStackLength}
                cardsInColumn={props.cardsColumns[ColumnWithCards] /* передать содержимое (карты) в колонке */}
                columnIndex={columnIndex}
                key={uuidv4()}
                >

                </CardsColumn>
            )
        })


    return (
        <div className={classes.CardsColumns}>
            {columnsWithCards}
        </div>
    );
}

export default CardsColumns;
