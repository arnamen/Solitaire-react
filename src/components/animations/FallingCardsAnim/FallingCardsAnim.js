import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';

import classes from './FallingCardsAnim.module.css'

class FallingCardsAnim extends Component {

        cards = [];
        cardsShirt =  null;

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
                    cardId: cardName + '__' + uuidv4()
                }
            );
        })
        this.cardsShirt = cardsShirt;
        this.cards = cards;

    }

    importAllCards = (r) => {
        return r.keys().map(r);
      }

    beginAnimation = (delay = 500) => {

        setInterval(() => {
            const card = this.cards[randomInteger(0, this.cards.length - 1)];
            // console.log(card.cardId)
            $(`#${card.cardId}`)
            .css({
                position: 'absolute',
                left: `${randomInteger(0,100)}vw`,
                top: '0px',
                transform: '1s webkitTransform'
            })
            .animate({
                top: '110vh',
                deg: randomInteger(-180,180),
            }, {
                duration: randomInteger(2500,5000),
                step: function(now) {
                    $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
            })

        }, delay);

    }

    componentDidMount(){
        this.beginAnimation();
    }

    render() {

        const cards = this.cards.map(( card ) => {
            return <img 
                    src={card.cardPath}
                    alt={card.cardName}
                    id={card.cardId}
                    fillOpacity='0.4'
                    key={card.cardId}
                    style={{
                        width: card.cardWidth,
                        position: 'absolute',
                        opacity: '0.3',
                        left: '-100%'
                    }}></img>
        })

        return (
            <div className={classes.FallingCardsAnim}>
                {cards}
            </div>
        );
    }
}

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

export default FallingCardsAnim;
