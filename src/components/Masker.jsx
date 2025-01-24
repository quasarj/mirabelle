import React from 'react';

import { useState, useContext } from 'react';

import Header from './Header.jsx';
import LeftPanel from './LeftPanel.jsx';
import MiddlePanel from './MiddlePanel.jsx';
import RightPanel from './RightPanel.jsx';
import TopPanel from './TopPanel.jsx';

import { Context } from './Context.js';

function Masker({ details, files, iecs, iec }) {

    const {
        leftPanelVisible,
        setLeftPanelVisible,
        rightPanelVisible,
        setRightPanelVisible,
        layout,

    } = useContext(Context);

    const gridTemplate = leftPanelVisible && rightPanelVisible
        ? 'grid-cols-[18rem,1fr,18rem]'
        : leftPanelVisible
            ? 'grid-cols-[18rem,1fr,0rem]'
            : rightPanelVisible
                ? 'grid-cols-[0rem,1fr,18rem]'
                : 'grid-cols-[0rem,1fr,0rem]';

    return (
        <div id="app" className={`relative grid grid-rows-[auto,1fr] gap-2 w-screen min-w-[1300px] h-screen p-2 dark:bg-blue-950 overflow-hidden`}>
            <Header />
            {/*{topPanelVisibility && <TopPanel />}*/}
            <div id="main" className={`h-full w-full grid ${gridTemplate} rounded-lg gap-2 transition-all duration-200 overflow-hidden`}>
                <div id="leftPanel" className={`w-full h-full rounded-lg overflow-hidden`}>
                    <LeftPanel />
                </div>
                {/*{leftPanelVisible && (
                  <div id="leftPanel" className={`w-72 h-full rounded-lg overflow-y-hidden ${leftPanelVisible ? 'slide-in' : 'slide-out'}`} >
                    <LeftPanel />
                  </div>
                )}*/}
                <MiddlePanel
                    files={files}
                    iecs={iecs}
                    iec={iec}
                />
                <div id="rightPanel" className="w-full h-full rounded-lg overflow-hidden">
                    <RightPanel />
                </div>
                {/*{rightPanelVisible && (
                  <div id="rightPanel" className="w-72 h-full rounded-lg overflow-hidden">
                    <RightPanel />
                  </div>
                )}*/}
            </div>
            <button
                id="leftPanelButton"
                onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                className={`z-[100] box-content flex items-center justify-center absolute w-5 h-5 leading-5 top-1/2 left-[18.2rem] transform translate-y-[36%] bg-blue-500 rounded-full p-1 transition-transform ${leftPanelVisible ? 'translate-x-0' : 'rotate-180 -translate-x-72'}`}

            >
                <span className="material-symbols-rounded rounded-full leading-5 text-white">chevron_left</span>
            </button>
            <button
                id="rightPanelButton"
                onClick={() => setRightPanelVisible(!rightPanelVisible)}
                className={`z-[100] box-content flex items-center justify-center absolute w-5 h-5 leading-5 top-1/2 right-[18.2rem] transform translate-y-[36%] bg-blue-500 rounded-full p-1 transition-transform ${rightPanelVisible ? 'translate-x-0' : 'rotate-180 translate-x-72'}`}

            >
                <span className="material-symbols-rounded rounded-full leading-5 text-white">chevron_right</span>
            </button>
        </div>
    )
}

export default Masker
