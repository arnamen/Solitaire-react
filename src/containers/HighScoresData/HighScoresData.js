import React, { Component } from 'react';

import FallingCardsAnim from '../../components/animations/FallingCardsAnim/FallingCardsAnim'
import ScoresTable from '../../components/scoreboard/ScoresTable/ScoresTable'
import axios from '../../axios-scores'

import classes from './HighScoreTable.module.css'

class HighScoresData extends Component {

    state = {
        scoresData: null
    }

    componentDidMount(){
        axios.get('scores.json')
        .then((response) => {
            this.setState({
                scoresData: response.data
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {

        return (
            <div className={classes.HighScoreTable}>
                <FallingCardsAnim/>
                <ScoresTable data={this.state.scoresData}/>
            </div>
        );
    }
}

export default HighScoresData;
