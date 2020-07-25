import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
//для обработки наведения на пустые колонки
import columnClasses from '../components/CardsColumns/CardsColumn/CardsColumn.module.css';

import $ from 'jquery';
import CardsField from '../components/CardsField/CardsField'
import CardsColumns from '../components/CardsColumns/CardsColumns';
import CardsStack from '../components/CardsStack/CardsStack';
import DraggableCardsColumn from '../components/CardsColumns/DraggableCardColumn/DraggableCardsColumn';
import CardsSetsStack from '../components/CardsSetsStack/CardsSetsStack';
import Card from '../components/Card/Card';

//пасьянс паук - 102 карты
//ширина колонки - 8+0.9+0.9vw = 9.8vw
//Анимации делать с помощью jquery  и пофиг
class CardsManager extends Component {

    debug = false;

    selectedCards = null; //картка, которую выбрал пользователь
    hoveredCard = null; //карта на которую навёл пользователь
    hoveredColumn = null; //пустая колонка, на которую навёл пользователь

    state = {
        cards: [],
        cardsPath: '',
        cardsStack: [],
        cardsSetsStack: [],
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
                    hideCardValue: !this.debug,
                    cardWidth: this.props.cardWidth,
                    disableDrag: true,
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

        inOrder(this.state.cardsStack); //перемешать карты в стеке
        // shuffle(this.state.cardsStack); //разложить карты по приоритету
        this.state.cardsPath = cardsPath;
        this.state.cards = cards;

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
    //проверка на то, собран ли весь набор начиная с заданой карты
    //вызывается после добавления новой карты в колонку
    checkIfCardsSetCollected = (initialCard) => {

        //проверить каждую карту в колонке, начать более подробную проверку если карта - король
        const columnToCheck = this.state.cardsColumns['cardsColumn' + initialCard.columnIndex];

        let collectedSetFirstCardIndex = -1;
        for (let i = 0; i < columnToCheck.length; i++) {

            if(columnToCheck[i].priority === 13){
                //начиная с короля, проверить все последующие карты
                for (let j = i; j < columnToCheck.length - 1; j++) {
                    const delta = columnToCheck[j].priority - columnToCheck[j+1].priority;
                    //если карта не следующая по приоритету - прекратить проверку
                    if(delta !== 1) return;
                    if(j - i >= 11) {
                        console.log(j, columnToCheck[i].insideColumnIndex)
                        console.log('set collected! column: ', initialCard)
                        collectedSetFirstCardIndex = i;
                    }
                }
            }
            else continue; //если первая проверяемая карта не король - дальше проверять нету смысла
        }

        if(collectedSetFirstCardIndex === -1) return;
        //дальнейший код будет выполнен только если собран набор карт

        const setOfCardsArr = columnToCheck.splice(collectedSetFirstCardIndex);
        console.log(initialCard.priority)
        this.setState({
            cardsSetsStack: setOfCardsArr
        }, () => {
            //анимировать перемещение всех карт в стек с собранными наборами
            this.state.cardsSetsStack.slice().reverse().forEach((card, index) => {
                this.moveCardFromcolumnTostackAnim(card, index);
            })
        })
    }

    giveOutCards = (isGameStart = false, columnsSizeForGameStart) => {

        const cardsStack = [...this.state.cardsStack];
        let cardsColumns = {...this.state.cardsColumns};
        //последняя колонка для которой надо анимировать выдачу карт
        //в последней выдаче не 10 карт, поэтому анимировать каждую колонку не нужно
        let lastColumnToAnim = 0; 

        Object.keys(cardsColumns)
            //добавить карту в каждую из колонок
            // eslint-disable-next-line array-callback-return
            .map((cardsColumn, index) => {
                //записать в карту данные о том в какую колонку её переместили (надо для анимации перемещения)
                const cardFromStack = cardsStack.pop();
                //если в стеке не осталось карт - вернуть
                if(!cardFromStack) return null;

                cardFromStack.columnIndex = index;
                cardFromStack.insideColumnIndex = cardsColumns[cardsColumn].length //какая по счетку карта в колонке

                lastColumnToAnim = index;

                if(isGameStart && columnsSizeForGameStart < 4) cardFromStack.hideCardValue = !this.debug;
                else cardFromStack.hideCardValue = false;

                cardsColumns[cardsColumn].push(cardFromStack);

            })
            //TODO: добавить функцию которая раздает по 1 карте в столбик, например использвать только последние карты колонок
            this.setState({
                cardsColumns: cardsColumns,
                cardsStack: cardsStack
            }, () => {
                //если начало игры - анимировать выдачу всех карт в столбиках
                if(isGameStart) this.fillColumnsToBeginGame(columnsSizeForGameStart+1);
                //иначе - анимировать только последние карты в столбиках
                else {
                    //раздача карт слева направо по строкам

                    let animDelayCounter = 0;
                    let maxColumnLength = 0;

                    Object.keys(this.state.cardsColumns).forEach(( cardColumnData ) => {
                        maxColumnLength = Math.max(maxColumnLength, cardColumnData.length)
                    })
                    
                    for (let i = 0; i < maxColumnLength; i++) {

                        Object.values(this.state.cardsColumns)
                            // eslint-disable-next-line no-loop-func
                            .map((cardsInColumn, columnIndex) => {
                                if(i !== cardsInColumn.length - 1 || columnIndex > lastColumnToAnim) return null; //если по указаному индексу в колоке нету карты - вернуть
                                //добавить нормальную раздачу карт по 1 строке за раз
                                this.moveCardFromStackToColumnAnim(cardsInColumn[i], columnIndex, i, animDelayCounter);
                                return animDelayCounter++;
                            })

                    }
                }
            });

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
                                if(cardInColumnIndex !== this.state.cardsColumns[columnName].length - 1) return; //костыль для раздачи по 1 строке
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
                                //добавить нормальную раздачу карт по 1 строке за раз
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

            const draggableColumnClassname = card.columnClassname;
            const cards = card.cardsInColumn;
            this.selectedCard=cards;

            $(`.${draggableColumnClassname}`).css({
                zIndex: 11111,
                pointerEvents: 'none',
            })

            cards.forEach(( card ) => {
               $('#' + card.cardId).css({pointerEvents: 'none'}) 
            })

    }
    //устанавливается во время отпускания пользователем карты
    defaultZIndexOnCard = (card) => {

            const draggableColumnClassname = card.columnClassname;
            const cards = card.cardsInColumn;

            $(`.${draggableColumnClassname}`).css({
                zIndex: 'auto',
                pointerEvents: 'auto',
            })

            cards.forEach(( card ) => {
                $('#' + card.cardId).css({pointerEvents: 'auto'}) 
             })

    }
    //проверка подходит ли карта для перемещения в выбранную колонку
    //selectedCard устанавливается автоматически при начале перемещения карты
    //перемещение выполняется в этой же функции
    checkIfCardApplied = (hoveredData = this.hoveredColumn || {...this.hoveredCard}, selectedCards = this.selectedCard) => {

            // if(this.hoveredColumn) console.log(hoveredData)

            if(selectedCards && hoveredData && selectedCards.length !== 0)

                if(!$.isEmptyObject(hoveredData) && !hoveredData.hideCardValue  &&
                hoveredData.priority - 1 === selectedCards[0].priority &&
                //условие - если карта наведенная является последней в колонке
               hoveredData.insideColumnIndex === this.state.cardsColumns['cardsColumn' + hoveredData.columnIndex].length - 1){
                    //колонка в которую надо переместить карту
                    const hoveredCardColumn = [...this.state.cardsColumns['cardsColumn' + hoveredData.columnIndex]];

                    selectedCards.forEach(( card, index ) => {
                    //раскрыть следующую карту в выбранной колонке
                    const selectedCardColumn = [...this.state.cardsColumns['cardsColumn' + selectedCards[0].columnIndex]]; 
                    if(!selectedCardColumn) return;
                    if(selectedCardColumn[selectedCardColumn.length - 1]) selectedCardColumn[selectedCardColumn.length - 1].hideCardValue = false;
                    //изменить данные карты в соответствии с перемещеной колонкой
                    card.insideColumnIndex = hoveredData.insideColumnIndex + 1 + index;
                    card.columnIndex = hoveredData.columnIndex;
                    //добавить выбранную карту в выбранную колонку
                    hoveredCardColumn.push(card); 
                    })
                    const cardsColumns = {...this.state.cardsColumns};
                    cardsColumns['cardsColumn' + hoveredData.columnIndex] = hoveredCardColumn;
                    //очистить данные о выбранной и наведенной карте
                    this.hoveredData = null;
                    this.selectedCards = null;
                    this.setState({
                        cardsColumns: cardsColumns,
                        cardsDraggableColumn: []
                    }, () => {
                        this.checkIfCardsSetCollected(hoveredData)
                    })
            } else if(typeof(hoveredData) === 'string'){
                //если пользователь навёл на пустую колонку
                //добавить в неё все выбранные карты
                const selectedColumnIndex = selectedCards[0].columnIndex;
                
                selectedCards.forEach(( card, index ) => {
                    card.insideColumnIndex = index;
                    card.columnIndex = parseInt(hoveredData.slice(11)); //индекс колонки находится после надписи cardsColumn
                })

                const cardsColumns = {...this.state.cardsColumns}
                const selectedColumn = cardsColumns['cardsColumn' + selectedColumnIndex];
                cardsColumns[hoveredData] = selectedCards;
                

                //раскрыть значение карты в колонке, которая находится перед выбранными
                if(selectedColumn[selectedColumn.length - 1])
                 selectedColumn[selectedColumn.length - 1].hideCardValue = false;
                this.hoveredColumn = null;
                this.setState({
                    cardsColumns: cardsColumns,
                    cardsDraggableColumn: []
                })

            } else { //если колонка не выбрана - вернуть карты из буферной колонки в изначальную
                const selectedCardsColumn = [...this.state.cardsColumns['cardsColumn' + this.state.cardsDraggableColumn[0].columnIndex]];
                const cardsDraggableColumn = [...this.state.cardsDraggableColumn];
                selectedCardsColumn.push(...cardsDraggableColumn);

                const cardsColumns = {...this.state.cardsColumns};
                cardsColumns['cardsColumn' + this.state.cardsDraggableColumn[0].columnIndex] = selectedCardsColumn;
                this.setState({
                    cardsColumns: cardsColumns,
                    cardsDraggableColumn: []
                })
            }
    }

    moveCardFromStackToColumnAnim = (card, columnIndex, cardInColumnIndex, animDelayMultiplier) => {

        //запомнить предыдущий параметр transform (возможно сдеплать по формуле через индекс карты в колонке, не в приоритете)
        /* let initialCardYTransform = $(`#${card.cardId}`).css('transform').split(',')[5];
        initialCardYTransform = initialCardYTransform.substr(0, initialCardYTransform.indexOf(')')) */
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
        $(`#${card.cardId}`).delay(animDelayMultiplier * 200).animate({
            //left: padding + ширина столбика, top: для красоты + отступ на позицию карты в колонке
            bottom: 'auto',
            right: 'auto',
            left: `${1 + 9.8 * columnIndex}vw`,
            top: `${0.5 + 3 * cardInColumnIndex}vh`,
            transform: `translate(${-5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(card.cardIndex/10))}px,${pixelToVH(-2)})`,
        }, 200,
            () => {
                $(`#${card.cardId}`).css({
                    // transform: `translate(${-1}vw,${3 * cardInColumnIndex}vh)`,
                    transform: 'none',
                    zIndex: 'auto'
                })
            })

    }
    //переместить карту из колонки в стек для собранных наборов карт
    moveCardFromcolumnTostackAnim = (card, animDelayMultiplier) => {
        // transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
        //потом запустить анимацию её передвижения на место в столбике
        if(!card) {
            console.log('[moveCardFromcolumnTostackAnim] error')
            return;
        }

        $(`#${card.cardId}`).css({
            bottom: 'auto',
            right: 'auto',
            left: `${1 + 9.8 * card.columnIndex}vw`,
            top: `${0.5 + 3 * card.insideColumnIndex}vh`,
            // transform: `translate(${-5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(card.cardIndex/10))}px,${pixelToVH(-2)})`,
        })
        .delay(animDelayMultiplier * 1000)
        .animate({zIndex: animDelayMultiplier})
        .animate({
            left: `2vw`,
            bottom: '5vh',
            top: `${95- parseFloat(pixelToVH(parseFloat(this.state.cardHeight)))}vh`,
            right: 'auto',
            transform: 'none',
        }, 1000)
        .css({transform: 'none'});
        

    }

    //добавить все карты из выбранной колонки начиная с выбранной, если выполняются услвоия
    addCardsToDraggableColumn = (initialCardData) => {
        
        if(!$.isNumeric(initialCardData.columnIndex)) return; //если в данных карты не указана колонка - прекратить работу
        //колонка в которой находится карта
        const selectedColumn = [...this.state.cardsColumns['cardsColumn' + initialCardData.columnIndex]];
        const cardsDraggableColumn = this.state.cardsDraggableColumn; //то же самое что и = [] т.к. по дефолту буферная колонка пустая и скрыта
        const cardsColumns = {...this.state.cardsColumns};

        cardsDraggableColumn.push(...selectedColumn.splice(initialCardData.insideColumnIndex,
            selectedColumn.length - initialCardData.insideColumnIndex)); //добавить в буферную колонку выбранную карту и все после неё
        /* for (let i = initialCardData.insideColumnIndex; i < selectedColumn.length; i++) {
            cardsDraggableColumn.push(...selectedColumn.splice(i,1));
        } */ //добавить только выбранную карту (возможно)

        cardsColumns['cardsColumn' + initialCardData.columnIndex] = selectedColumn;

        this.setState({
            cardsDraggableColumn: cardsDraggableColumn,
            cardsColumns: cardsColumns
        }, () => {
            //сразу после добавления карт в буферную колонку затриггерить нажатие на карту так что колонку можно сразу перетягивать
            const event = new Event('mousedown', {bubbles: true});
            event.simulated = true;

            document.getElementById(this.state.cardsDraggableColumn[0].cardId || initialCardData.cardId).dispatchEvent(event)
            // console.log($('#' + initialCardData.cardId).trigger('onMouseDown'))
        })
        
    }
    //в этом методе происходит обработка hover карт в колонках
    componentDidUpdate(){

        //получение отрендереных блоков колонок
        const columnsElements = $(`.${columnClasses.CardsColumn}`);

        columnsElements.hover((column) => {
            if(column.target.className === columnClasses.CardsColumn){
                this.hoveredColumn = column.target.id;
                columnsElements.css({
                    border: '1px solid blue'
                })
            }
        }, () => {
            this.hoveredColumn = null;
            columnsElements.css({
                border: '1px solid white'
            })
        })

        //получение данных о колонках из обьекта
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
                    cardData={card}
                    disableDrag
                    // Изначально сместить карты вправо на величину, равную 5пх*кол-во стеков по 10 карт.
                    // По мере наложения стеков смещать стеки влево на 5пх за каждый стек
                    transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/13)) - 5*(Math.floor(index/10)), y: 0}}
                    cardId={card.cardId}
                    key={card.cardId}/>
        })  
        
        const setsOfCards = this.state.cardsSetsStack.map((card, index) => {
            return <Card cardWidth={this.state.cardWidth}
            cardData={card}
            disableDrag
            // Изначально сместить карты вправо на величину, равную 5пх*кол-во стеков по 10 карт.
            // По мере наложения стеков смещать стеки влево на 5пх за каждый стек
            transformCardPosition={{x: 5*(Math.floor(this.state.cardsStack.length/10)) - 5*(Math.floor(index/10)), y: 0}}
            cardId={card.cardId}
            key={card.cardId}/>
        })

        return (

            <CardsField click={this.setsOfCardsTest}>
                <CardsColumns columnsQuantity={10}
                    addCardsToDraggableColumn = {this.addCardsToDraggableColumn}
                    cardsColumns ={this.state.cardsColumns}
                    checkIfCardApplied={this.checkIfCardApplied}
                    columnWidth={(parseInt(this.state.cardWidth) - parseInt(this.state.cardWidth)*0.05) + 'px'}/>
                    {/* перетягиваемая буферная колонка с картами для их перемещения */}
                    <DraggableCardsColumn 
                    //эти методы в дальнейшем используются в созданных картах
                    selectAndHighZIndexOnCard={this.selectAndHighZIndexOnCard}
                    defaultZIndexOnCard={this.defaultZIndexOnCard}
                    checkIfCardApplied={this.checkIfCardApplied}
                    style = {{
                        top: '-1vh',
                        left: '-1wh'
                    }}
                    cardsInColumn={this.state.cardsDraggableColumn}/>
            
                    

                    {/* Ширина стека равна ширине карты + количестве наборов по 10 карт для раздачи * 5 пикселей */}
                <CardsStack width={(parseInt(this.state.cardWidth) + 5*(Math.floor(this.state.cardsStack.length/10))) + 'px'}
                            height={this.state.cardHeight}
                            giveOutCards={this.giveOutCards}>
                    {cardsInStack}
                </CardsStack>

                <CardsSetsStack width={(parseInt(this.state.cardWidth) + 5*(Math.floor(this.state.cardsStack.length/10))) + 'px'}
                            height={this.state.cardHeight}>
                    {setsOfCards}
                </CardsSetsStack>
            </CardsField>
        );
    }
}

const inOrder = (cardsArray = []) => {
    cardsArray.sort((card1, card2) => (card1.priority - card2.priority))
}

// eslint-disable-next-line no-unused-vars
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
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
