import React from 'react';
import Draggable from 'react-draggable'

import Card from '../../Card/Card';
import './DraggableCardsColumn.css'

const DraggableCardColumn = ( props ) => {
    //в пропсы так же отправлять position left+top
    const cardsInColumn = props.cardsInColumn.map(( cardData, cardIndex ) => {
        return <Card cardData={cardData}
                className={'dragTest'}
                checkIfCardApplied={props.checkIfCardApplied}
                transformCardPosition={{x: '-1vw', y: (3*cardIndex) + 'vh'}}
                hideCardValue={cardData.hideCardValue}
                disableDrag = {true}
                insideColumnIndex={cardData.insideColumnIndex}
                key={cardData.cardId /* cardData.cardData.cardId */}
                style={{
                    pointerEvents: 'auto',
                    ...props.style
                }}/>
    })

    return (
         props.cardsInColumn ? 
         <Draggable position={{
             //начальное смещение колонки задаётся из onStart() кликнутой карты
             x: 0,
             y: 0
         }}
        //  allowAnyClick
        //  handle= '.dragTest'
         defaultClassName='DraggableCardsColumn_drag'
         defaultClassNameDragging='DraggableCardsColumn_dragging'
         defaultClassNameDragged='DraggableCardsColumn_dragged'
         
         onStart={( event ) => { 

             props.selectAndHighZIndexOnCard({
             cardsInColumn: props.cardsInColumn,
             columnClassname: 'DraggableCardsColumn'
            }, true);
        }}

        onDrag={( event ) => {
        }}

        onStop={() => {
            props.defaultZIndexOnCard({
            cardsInColumn: props.cardsInColumn,
            columnClassname: 'DraggableCardsColumn'
            }, true);
            props.checkIfCardApplied();
                }
            }>

                    <div
                        className='DraggableCardsColumn'
                        style={{
                            display: cardsInColumn.length === 0 ? 'none' : 'inline-block',
                            transform: 'none'
                        }}
                        >
                        {cardsInColumn}
                    </div>

        </Draggable> : null
    );
}

export default DraggableCardColumn;
