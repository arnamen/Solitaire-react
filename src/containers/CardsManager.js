import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import $ from 'jquery';
// import classes from './CardsManager.module.css'

import CardsField from '../components/CardsField/CardsField'
import CardsColumns from '../components/CardsColumns/CardsColumns';
import CardsStack from '../components/CardsStack/CardsStack';
import Card from '../components/Card/Card';

//пасьянс паук - 102 карты
//ширина колонки - 8+0.9+0.9vw
class CardsManager extends Component {

    state = {
        cards: [],
        cardsPath: '',
        cardsStack: [],
        cardWidth: parseInt(this.props.cardWidth),
        cardHeight: parseInt(this.props.cardWidth) * Math.sqrt(2),
        cardsShirt: null,
        cardsColumns: {
            cardsColumn0: [],
            cardsColumn1: [],
            cardsColumn2: [],
            cardsColumn3: [],
            cardsColumn4: [],
            cardsColumn5: [],
            cardsColumn6: [],
            cardsColumn7: [],
            cardsColumn8: [],
            cardsColumn9: [],
        }
    }

    constructor(props){
        super(props);

        const cardsPath = this.importAllCards(require.context('../assets/cards-svg/', false, /\.(svg)$/));
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
                    cardId: cardName + '__' + uuidv4(),
                }

                return;
            }

            cards.push({
                    cardPath: cardPath,
                    cardName: cardName,
                    cardId: cardName + '__' + uuidv4(),
                    cardIndex: cardIndex,
                    columnIndex: null //номер колонки, в которой расположена карта (дефолт - не в колонке)
                }
            );
        })
        this.state.cardsStack.push(...this.copyDeckOfCards(cards));
        //добавить уникальные айди копиям карт
        this.state.cardsStack.push(...this.copyDeckOfCards(cards));
        this.state.cardsPath = cardsPath;
        this.state.cards = cards;
        this.state.cardsShirt = cardsShirt;
    }

    copyDeckOfCards(deckArr = []){
        return deckArr.map(( card ) => {
            card.cardId = card.cardName + '__' + uuidv4();
            return card;
        })
    }

    importAllCards = (r) => {
        return r.keys().map(r);
      }

    giveOutCards = (isGameStart = false, columnsSizeForGameStart) => {

        const cardsStack = [...this.state.cardsStack];
        let cardsColumns = {...this.state.cardsColumns};

        Object.keys(cardsColumns)
            //добавить карту в каждую из колонок
            // eslint-disable-next-line array-callback-return
            .map((cardsColumn, index) => {
                //записать в карту данные о том в какую колонку её переместили (надо для анимации перемещения)
                cardsStack[cardsStack.length-1].columnIndex = index;
                cardsColumns[cardsColumn].push(cardsStack.pop());

            })
            this.setState({
                cardsColumns: cardsColumns,
                cardsStack: cardsStack
            }, () => this.fillColumnsToBeginGame(columnsSizeForGameStart+1));

    }

    fillColumnsToBeginGame = (columnsSize = 0) => {
        //раздать карты 5 раз
        if(columnsSize < 5) this.giveOutCards(true, columnsSize); 
    }
    componentDidMount(){
        
        this.fillColumnsToBeginGame();
    }

    render() {
        //карты в стеке
        const cardsInStack = this.state.cardsStack.map((card, index) => {
            return <Card cardWidth={this.state.cardWidth}
                    cardPath={card.cardPath}
                    disableDrag
                    // Изначально сместить карты вправо на величину, равную 5пх*кол-во стеков по 10 карт.
                    // По мере наложения стеков смещать стеки влево на 5пх за каждый стек
                    transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
                    key={uuidv4()}/>
        })

        const testingCard = <Card transitionParams='top 1s, left 1s' x='0.9vw' y='1%'
                            cardWidth={this.state.cardWidth}
                            cardPath={this.state.cards[0].cardPath}/>;
                            
        return (
            <CardsField>
                <CardsColumns columnsQuantity={10}
                    cardsColumns ={this.state.cardsColumns}
                    columnWidth={(parseInt(this.state.cardWidth) - parseInt(this.state.cardWidth)*0.05) + 'px'}/>
                    {testingCard}
                    {/* Ширина стека равна ширине карты + количестве наборов по 10 карт для раздачи * 5 пикселей */}
                <CardsStack width={(parseInt(this.state.cardWidth) + 5*(Math.floor(this.state.cardsStack.length/10))) + 'px'}
                            height={this.state.cardHeight}>
                    {cardsInStack}
                </CardsStack>
            </CardsField>
        );
    }
}

export default CardsManager;
