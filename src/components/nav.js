import React from 'react';
import ReactDOM from 'react-dom/client';

import './nav.css';


const NavBar = ({
    appName : AppName
}) => {
    return (
        <div className='navbar'>
            
            <div className='logo'>
                {/* <img src="logo.svg" alt="App Logo" /> */}
                <span className='appName'> { AppName } </span>
            </div>

        </div>
    );
}

export default NavBar;