import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import classes from './CardsManager.module.css'

import $ from 'jquery';
import CardsField from '../components/CardsField/CardsField'
import CardsColumns from '../components/CardsColumns/CardsColumns';
import CardsStack from '../components/CardsStack/CardsStack';
import DraggableCardsColumn from '../components/CardsColumns/DraggableCardColumn/DraggableCardsColumn';
import Card from '../components/Card/Card';

//пасьянс паук - 102 карты
//ширина колонки - 8+0.9+0.9vw = 9.8vw
//Анимации делать с помощью jquery  и пофиг
class CardsManager extends Component {

    selectedCard = null; //картка, которую выбрал пользователь
    hoveredCard = null; //карта на которую навёл пользователь

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
        },
        cardsDraggableColumn: [

        ]
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
                    priority: this.getCardPriority(cardName), //приоритет карты в числовой форме, 1...14. -1 - не задано
                    cardIndex: cardIndex,
                    cardShirt: null,
                    hideCardValue: false,
                    cardWidth: this.props.cardWidth,
                    insideColumnIndex: null,
                    columnIndex: null, //номер колонки, в которой расположена карта (дефолт - не в колонке)
                    selected: false,
                }
            );
        })
        this.state.cardsShirt = cardsShirt;
        this.state.cardsStack.push(...this.copyDeckOfCards(cards));
        //добавить уникальные айди копиям карт
        this.state.cardsStack.push(...this.copyDeckOfCards(cards));
        this.state.cardsPath = cardsPath;
        this.state.cards = cards;
        console.log(this.state.cards)
    }

    getCardPriority = (cardName = '') => {
        switch (cardName.charAt(0).toLowerCase()) {
            case 'a':
                return 1;
            case '2':
                return 2;
            case '3':
                return 3;
            case '4':
                return 4;
            case '5':
                return 5;
            case '6':
                return 6;
            case '7':
                return 7;
            case '8':
                return 8;
            case '9':
                return 9;
            case 't':
                return 10;
            case 'j':
                return 11;
            case 'q':
                return 12;
            case 'k':
                return 13;
        
            default:
                return -1;
        }
    }

    copyDeckOfCards(deckArr = []){

        return deckArr.map(( card ) => {

            const cardCopy = {...card};
            cardCopy.cardShirt = this.state.cardsShirt;
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
                const cardFromStack = cardsStack.pop();
                cardFromStack.columnIndex = index;
                cardFromStack.insideColumnIndex = cardsColumns[cardsColumn].length //какая по счетку карта в колонке

                if(isGameStart && columnsSizeForGameStart < 4) cardFromStack.hideCardValue = true;

                cardsColumns[cardsColumn].push(cardFromStack);

            })
            this.setState({
                cardsColumns: cardsColumns,
                cardsStack: cardsStack
            }, () => this.fillColumnsToBeginGame(columnsSizeForGameStart+1));

    }

    fillColumnsToBeginGame = (columnsSize = 0, cardsDealMode = 2) => {
        //cardsDealMode определяет каким образом раздавать карты. 1 - по столбикам, 2 - по строкам
        //раздать карты 5 раз
        if(columnsSize < 5) this.giveOutCards(true, columnsSize); 
        //после того как колонки заполнены - проанимировать выдачу карт
        else {    
            let animDelayCounter = 0;  //счетчик для задержки перед выдачей карт
            switch (cardsDealMode) {
                case 1:
                    //раздача карт слева направо по 5 в столбик

                    Object.keys(this.state.cardsColumns)
                        .map((columnName, columnIndex) => {
                            return this.state.cardsColumns[columnName].forEach((cardInColumn, cardInColumnIndex) => {
                                this.moveCardFromStackToColumnAnim(cardInColumn, columnIndex, cardInColumnIndex, animDelayCounter);
                                animDelayCounter++;
                            })
                        })
                    break;

                case 2:
                    //раздача карт слева направо по строкам
                    for (let i = 0; i < this.state.cardsColumns['cardsColumn0'].length; i++) {

                        Object.values(this.state.cardsColumns)
                            // eslint-disable-next-line no-loop-func
                            .map((cardsInColumn, columnIndex) => {

                                this.moveCardFromStackToColumnAnim(cardsInColumn[i], columnIndex, i, animDelayCounter);
                                return animDelayCounter++;
                            })

                    }
                    break;
                default:
                    break;
            }
            
        }
    }
    //устанавливается во время перетягивания
    selectAndHighZIndexOnCard = (card) => {
        card.selected = true;
        this.selectedCard = card;
        let cardElem = $(`#${card.cardId}`);
        cardElem.css({
            zIndex: 11111,
            pointerEvents: 'none'
        })

    }
    //устанавливается во время отпускания пользователем карты
    defaultZIndexOnCard = (card) => {
        card.selected = false;
        // this.selectedCard = null;

        let cardElem = $(`#${card.cardId}`);
        cardElem.css({
            zIndex: card.insideColumnIndex,
            pointerEvents: 'auto'
        })
        
    }
    //проверка подходит ли карта для перемещения в выбранную колонку
    //selectedCard устанавливается автоматически при начале перемещения карты
    //перемещение выполняется в этой же функции
    checkIfCardApplied = (hoveredCard = {...this.hoveredCard}, selectedCard = {...this.selectedCard}) => {

        if(!selectedCard || !hoveredCard || $.isEmptyObject(hoveredCard) || $.isEmptyObject(selectedCard)) return;
        
        //если приоритет выбранной карты на 1 ниже наведенной
        if(hoveredCard.priority - 1 === selectedCard.priority &&
            //условие - если карта наведенная является последней в колонке
            hoveredCard.insideColumnIndex === this.state.cardsColumns['cardsColumn' + hoveredCard.columnIndex].length - 1){

                const hoveredCardColumn = [...this.state.cardsColumns['cardsColumn' + hoveredCard.columnIndex]];
                const selectedCardColumn = [...this.state.cardsColumns['cardsColumn' + selectedCard.columnIndex]];

                const cardFromSelectedColumn = selectedCardColumn.pop(); //удалить выбранную карту из её колонки
                //изменить данные карты в соответствии с перемещеной колонкой
                cardFromSelectedColumn.insideColumnIndex = hoveredCard.insideColumnIndex + 1;
                cardFromSelectedColumn.columnIndex = hoveredCard.columnIndex;
                //раскрыть значение последней карты в колонке если оно скрыто
                selectedCardColumn[selectedCardColumn.length - 1].hideCardValue = false;
                //добавить выбранную карту в выбранную колонку
                hoveredCardColumn.push(cardFromSelectedColumn); 

                const cardsColumns = {...this.state.cardsColumns};
                cardsColumns['cardsColumn' + hoveredCard.columnIndex] = hoveredCardColumn;
                cardsColumns['cardsColumn' + selectedCard.columnIndex] = selectedCardColumn;
                //очистить данные о выбранной и наведенной карте
                this.hoveredCard = null;
                this.selectedCard = null;

                this.setState({
                    cardsColumns: cardsColumns
                })
        }
    }

    moveCardFromStackToColumnAnim = (card, columnIndex, cardInColumnIndex, animDelayMultiplier) => {

        //запомнить предыдущий параметр transform (возможно сдеплать по формуле через индекс карты в колонке, не в приоритете)
        let initialCardYTransform = $(`#${card.cardId}`).css('transform').split(',')[5];
        initialCardYTransform = initialCardYTransform.substr(0, initialCardYTransform.indexOf(')'))
        //ширина одной колонки для карт 9.8vw, отступ вычисляем по формуле 9.8*индексКолонки+padding оболочки (~1vw)
        //сначала установить карту в её теоретическое положение в стеке
        $(`#${card.cardId}`).css({
            left: 'auto',
            top: 'auto',
            bottom: `${5}vh`,
            right: '2vw',
            transform: `translate(${-5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(card.cardIndex/10))}px,${pixelToVH(-2)})`,
            zIndex: 1000+card.cardIndex
        })
        // transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
        //потом запустить анимацию её передвижения на место в столбике
        $(`#${card.cardId}`).delay(animDelayMultiplier * 20).animate({
            //left: padding + ширина столбика, top: для красоты + отступ на позицию карты в колонке
            bottom: 'auto',
            right: 'auto',
            left: `${2 + 9.8 * columnIndex}vw`,
            top: `${0.5}vh`,
            
        }, 20,
            () => {
                $(`#${card.cardId}`).css({
                    transform: `translate(${-1}vw,${initialCardYTransform}px)`,
                    zIndex: 'auto'
                })
            })

    }
    //в этом методе происходит обработка hover карт в колонках
    componentDidUpdate(){
        console.log('updated')
        //получение колонок из обьекта
        Object.keys(this.state.cardsColumns)
        .forEach(( columnName ) => {
            //получение массива карт в каждой колонке
            this.state.cardsColumns[columnName]
            .forEach(( cardData ) => {

                const card = $(`#${cardData.cardId}`);
                //событие наведения на карту hover
                card.hover(

                    () => {
                        card.css({border: '1px solid red'})
                        this.hoveredCard = cardData;
                    },

                    //событие окончания навдения на карту hover
                    () => {
                        card.css({border: 'none'})
                        this.hoveredCard = null;
                    }
                )
            })
        })

    }

    componentDidMount(){
        
        this.fillColumnsToBeginGame();

        // this.moveCardFromStackToColumnAnim('testingCard',6);
    }

    render() {
        //карты в стеке
        const cardsInStack = this.state.cardsStack.map((card, index) => {
            return <Card cardWidth={this.state.cardWidth}
                    cardPath={card.cardPath}
                    cardShirtPath={card.cardShirt}
                    cardData={card}
                    disableDrag
                    // Изначально сместить карты вправо на величину, равную 5пх*кол-во стеков по 10 карт.
                    // По мере наложения стеков смещать стеки влево на 5пх за каждый стек
                    transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
                    cardId={card.cardId}
                    key={card.cardId}/>
        })

        const testingCard = <Card transformCardPosition={{x: '50vw', y: '50vh'}}
                            cardWidth={this.state.cardWidth}
                            cardPath={this.state.cards[0].cardPath}
                            cardData={this.state.cards[0]}
                            cardId='testingCard'/>;
                            
        return (
            <CardsField>
                <CardsColumns columnsQuantity={10}
                    selectAndHighZIndexOnCard={this.selectAndHighZIndexOnCard}
                    defaultZIndexOnCard={this.defaultZIndexOnCard}
                    cardsColumns ={this.state.cardsColumns}
                    checkIfCardApplied={this.checkIfCardApplied}
                    columnWidth={(parseInt(this.state.cardWidth) - parseInt(this.state.cardWidth)*0.05) + 'px'}/>
                    {/* перетягиваемая буферная колонка с картами для их перемещения */}
                    <DraggableCardsColumn cardsInColumn={[testingCard]}/>
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

const pixelToVH = (value) => {
    return `${(100 * value) / window.innerHeight}vh`;
  }
// eslint-disable-next-line no-unused-vars
const pixelToVW = (value) => {
    return `${(100 * value) / window.innerWidth}vw`;
  }
export default CardsManager;
