import React from 'react';

import './RouteLayout.css';

function RouteLayout({ header, leftPanel, middlePanel, rightPanel }) {

    let colsClass;

    if (leftPanel) {
        colsClass = rightPanel ? 'main--3col' : 'main--2col-left';
    } else {
        colsClass = rightPanel ? 'main--2col-right' : 'main--1col';
    }

    return (
        <div id="main" className={colsClass}>
            {leftPanel && <div id="left-panel">{leftPanel}</div>}
            <div id="middle-panel">{middlePanel}</div>
            {rightPanel && <div id="right-panel">{rightPanel}</div>}
        </div>
    );
}

export default RouteLayout;