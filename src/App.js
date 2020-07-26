import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Layout from './layout/Layout'
import HighScoresTable from './containers/HighScoresTable/HighScoresTable'
import CardsManager from './containers/CardsManager/CardsManager';

import './App.css';
class App extends Component {
  render() {
    //высота карты подставляется пропорционально (9vw)
    return (
      <BrowserRouter>
        <Layout>
          <Route exact path='/' render={() => <CardsManager cardWidth={vwTOpx(9) + 'px'}/>}/>
          <Route exact path='/scoreboard' component={HighScoresTable} />
        </Layout>
      </BrowserRouter>
    );
  }
}

const vwTOpx = (value) => {
  let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth;
      // y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  let result = (x*value)/100; // значение viewpoint width->pixels
  return result;
}

export default App;
