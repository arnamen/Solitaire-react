import React, { Component } from 'react';

import Layout from './layout/Layout'
import CardsManager from './containers/CardsManager';

import './App.css';
class App extends Component {
  render() {
    //высота карты подставляется пропорционально
    return (
      <Layout>
        <CardsManager cardWidth='126px'/>
      </Layout>
    );
  }
}

export default App;
