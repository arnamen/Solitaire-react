import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import classes from './ScoresTable.module.css'

const ScoresTable = ( props ) => {

    //алгоритм построения таблицы
    let rowsWithCells = null;
    if(props.data){
    rowsWithCells = Object.keys(props.data)
    .map(( userName ) => {
        return <tr className={classes.row} key={uuidv4()}>
            <td className={classes.cell}>{userName}</td>
            <td className={classes.cell}>{props.data[userName]}</td>
        </tr>
    })
    //

    if(Object.keys(props.data).length < 15){
        for (let i = 0; i < 15 - Object.keys(props.data).length; i++) {
            rowsWithCells.push(<tr className={classes.row} key={uuidv4()}>
            <td className={classes.cell}>Empty</td>
            <td className={classes.cell}>Empty</td>
        </tr>)
            
            }
        }
    }

    return (
        <div className={classes.ScoresTable}>
            <table className={classes.table}>
                <thead>
                    <tr className={classes.row + ' ' + classes.green}>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                {rowsWithCells}
                </tbody>
            </table>
        </div>
    );
}

export default ScoresTable;
