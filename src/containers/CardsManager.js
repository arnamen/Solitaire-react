import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import classes from './CardsManager.module.css'

import $ from 'jquery';
import CardsField from '../components/CardsField/CardsField'
import CardsColumns from '../components/CardsColumns/CardsColumns';
import CardsStack from '../components/CardsStack/CardsStack';
import Card from '../components/Card/Card';

//пасьянс паук - 102 карты
//ширина колонки - 8+0.9+0.9vw = 9.8vw
//Анимации делать с помощью jquery  и пофиг
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
                    cardId: null,
                }

                return;
            }

            cards.push({
                    cardPath: cardPath,
                    cardName: cardName,
                    cardId: null,
                    cardIndex: cardIndex,
                    positionInStackX: null, //позиция для оображения карты на экране когда она в стеке
                    positionInStackY: null,
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

            const cardCopy = {...card};
            cardCopy.cardId = card.cardName + '__' + uuidv4();
            return cardCopy;
            
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
        //после того как колонки заполнены - проанимировать выдачу карт
        else {      
            Object.keys(this.state.cardsColumns)
            // eslint-disable-next-line array-callback-return
            .map(( columnName, columnIndex ) => {
                this.state.cardsColumns[columnName].forEach(( cardInColumn, cardInColumnIndex ) => {
                        this.moveCardFromStackToColumnAnim(cardInColumn, columnIndex, cardInColumnIndex);
                    
                })
            })
        }
    }

    moveCardFromStackToColumnAnim = (card, columnIndex, cardInColumnIndex) => {
        console.log('Номер колонки ' + columnIndex + ', карта: ' + card)
        //ширина одной колонки для карт 9.8vw, отступ вычисляем по формуле 9.8*индексКолонки+padding оболочки (~1vw)
        $(`#${card.cardId}`).animate({
            top: 'auto',
            left: 'auto',
            right: `${2+card.positionInStackX}vw`,
            bottom: `${5+card.positionInStackY}vh`
        },0,() => {
            $(`#${card.cardId}`).animate({
                right: 'auto',
                bottom: 'auto',
                left: `${1.4+9.8*columnIndex}vw`,
                top: `${1+cardInColumnIndex}vh`
            }, 2000)
        })
        
    }

    componentDidMount(){
        
        this.fillColumnsToBeginGame();

        // this.moveCardFromStackToColumnAnim('testingCard',6);
    }

    render() {
        //карты в стеке
        const cardsInStack = this.state.cardsStack.map((card, index) => {
            card.positionInStackX = 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10));
            card.positionInStackY = 0;
            return <Card cardWidth={this.state.cardWidth}
                    cardPath={card.cardPath}
                    disableDrag
                    // Изначально сместить карты вправо на величину, равную 5пх*кол-во стеков по 10 карт.
                    // По мере наложения стеков смещать стеки влево на 5пх за каждый стек
                    transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
                    cardId={card.cardId}
                    key={card.cardId}/>
        })

        const testingCard = <Card transitionParams='top 1s, left 1s' x='0.9vw' y='1%'
                            cardWidth={this.state.cardWidth}
                            cardPath={this.state.cards[0].cardPath}
                            cardId='testingCard'/>;
                            
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
