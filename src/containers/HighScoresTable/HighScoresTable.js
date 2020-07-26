import React, { Component } from 'react';
import FallingCardsAnim from '../../components/animations/FallingCardsAnim/FallingCardsAnim'

import classes from './HighScoreTable.module.css'

class HighScoresTable extends Component {

    render() {
        return (
            <div className={classes.HighScoreTable}>
                <FallingCardsAnim/>
                testtesttest
            </div>
        );
    }
}

export default HighScoresTable;
