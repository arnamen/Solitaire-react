import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import classes from './Header.module.css';

const Header = () => {
    const location = useLocation().pathname;
    return (
        <div className={classes.Header}>
            <NavLink activeClassName={classes.Active} 
                     isActive={() => location === '/'}
                     className={classes.Nav}
                     to='/'>GAME</NavLink>
            <NavLink  activeClassName={classes.Active}
                      isActive={() => location === '/scoreboard'}
                      className={classes.Nav}
                      to='/scoreboard'>SCOREBOARD</NavLink>
        </div>
    );
}

export default Header;
