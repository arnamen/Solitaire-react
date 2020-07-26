import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';

import classes from './FallingCardsAnim.module.css'

class FallingCardsAnim extends Component {

    state = {
        cards: [],
        cardsShirt: null
    }

    constructor(props){
        super(props);

        const cardsPath = this.importAllCards(require.context('../../../assets/cards-svg/', false, /\.(svg)$/));
        let cardsShirt = null;
        const cards = [];

        cardsPath.forEach((cardPath, cardIndex) => {
            //создать карту (тестовый режим, только данные)
            let cardName = cardPath.split("/").pop().replace(/\.[^/.]+$/, "")
            cardName = cardName.split('').splice(0,cardName.indexOf('.')).join('');

            if(cardPath.includes('card-background')){
                
                cardsShirt = {
                    cardPath: cardPath,
                    cardName: cardName,
                    cardId: null,
                }

                return;
            }

            cards.push({
                    cardPath: cardPath,
                    cardName: cardName,
                    cardShirt: null,
                    cardWidth: this.props.cardWidth || '9vw',
                    cardId: cardName + uuidv4()
                }
            );
        })
        this.state.cardsShirt = cardsShirt;
        this.state.cards = cards;
        this.state.cards = cards.map(( card ) => {
            return <img 
                    src={card.cardPath}
                    alt={card.cardName}
                    key={card.cardId}
                    style={{
                        width: card.cardWidth,
                        position: 'absolute'
                    }}></img>
        })
        console.log(cards)
    }

    importAllCards = (r) => {
        return r.keys().map(r);
      }

    render() {


        return (
            <div className={classes.FallingCardsAnim}>
                {this.state.cards}
            </div>
        );
    }
}

export default FallingCardsAnim;
