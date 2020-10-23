import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Layout from './layout/Layout'
import HighScoresTable from './containers/HighScoresData/HighScoresData'
import CardsManager from './containers/CardsManager/CardsManager';

import './App.css';
class App extends Component {
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  render() {
    //высота карты подставляется пропорционально (9vw)
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            { this.isMobile ? <Route exact path='/' render={() => <h1 style={{textAlign: 'center'}}>Mobile devices is not supported</h1>}/> :
            <Route exact path='/' render={() => <CardsManager cardWidth={vwTOpx(9) + 'px'}/>}/>}
            <Route exact path='/scoreboard' component={HighScoresTable} />
            <Route render={() => <h1 style={{textAlign: 'center'}}>Route not found</h1>}/>
          </Switch>
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
