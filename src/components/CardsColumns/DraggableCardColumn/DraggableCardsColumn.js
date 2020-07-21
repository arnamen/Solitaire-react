import React from 'react';
import Draggable from 'react-draggable'

import Card from '../../Card/Card';
import './DraggableCardsColumn.css'

const DraggableCardColumn = ( props ) => {
    const dragHandles = [];
    //в пропсы так же отправлять position left+top
    const cardsInColumn = props.cardsInColumn.map(( cardData, cardIndex ) => {
        dragHandles.push('' + cardData.cardId);
        return <Card cardData={cardData}
                className={'dragTest'}
                checkIfCardApplied={props.checkIfCardApplied}
                transformCardPosition={{x: '-1vw', y: (6*cardIndex) + 'vh'}}
                hideCardValue={cardData.hideCardValue}
                disableDrag = {true}
                insideColumnIndex={cardData.insideColumnIndex}
                key={cardData.cardId /* cardData.cardData.cardId */}
                style={props.style || {
                    left: `${2+9.8*cardData.columnIndex}vw`,
                    top: `${0.5}vh`
                }}/>
    })

    return (
         props.cardsInColumn ? 
         <Draggable 
        //  allowAnyClick
         handle= '.dragTest'
         defaultClassName='DraggableCardsColumn_drag'
         defaultClassNameDragging='DraggableCardsColumn_dragging'
         defaultClassNameDragged='DraggableCardsColumn_dragged'
         
         onStart={() => { 
             props.selectAndHighZIndexOnCard({
             cardsInColumn: props.cardsInColumn,
             columnClassname: 'DraggableCardsColumn'
            }, true);
        }}

        onStop={() => {props.defaultZIndexOnCard({
            cardsInColumn: props.cardsInColumn,
            columnClassname: 'DraggableCardsColumn'
            }, true);
            props.checkIfCardApplied(true);
                }
            }
                
                >

                    <div 
                        className='DraggableCardsColumn'>
                        {cardsInColumn}
                    </div>

        </Draggable> : null
    );
}

export default DraggableCardColumn;
