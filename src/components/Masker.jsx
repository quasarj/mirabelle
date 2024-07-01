import React from 'react';

import { useState, useContext } from 'react';

import Header from './Header.jsx';
import LeftPanel from './LeftPanel.jsx';
import MiddlePanel from './MiddlePanel.jsx';
import RightPanel from './RightPanel.jsx';
import TopPanel from './TopPanel.jsx';

import { Context } from './Context.js';
import { log } from 'dcmjs';

function Masker({ files, iecs, iec }) {

  const { layout, leftPanelVisibility, setLeftPanelVisibility,rightPanelVisibility, setRightPanelVisibility } = useContext(Context);
  console.log('layout', layout);

  const gridTemplate = leftPanelVisibility && rightPanelVisibility
    ? 'grid-cols-[18rem,1fr,18rem]'
    : leftPanelVisibility 
    ? 'grid-cols-[18rem,1fr,0rem]'
    : rightPanelVisibility 
    ? 'grid-cols-[0rem,1fr,18rem]'
    : 'grid-cols-[0rem,1fr,0rem]';
  
  return (
    <div id="app" className={`grid grid-rows-[auto,1fr] gap-2 w-screen h-screen p-2 dark:bg-blue-950`}>
      <Header />
      {/*{topPanelVisibility && <TopPanel />}*/}
      <div id="main" className={`h-full w-full grid ${ gridTemplate } rounded-lg gap-2 overflow-hidden transition-all duration-300`}>
        <div id="leftPanel" className={`w-full h-full rounded-lg overflow-hidden`}>
          <LeftPanel />
        </div>
        {/*{leftPanelVisibility && (
          <div id="leftPanel" className={`w-72 h-full rounded-lg overflow-y-hidden ${leftPanelVisibility ? 'slide-in' : 'slide-out'}`} >
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
        {/*{rightPanelVisibility && (
          <div id="rightPanel" className="w-72 h-full rounded-lg overflow-hidden">
            <RightPanel />
          </div>
        )}*/}
      </div>
    </div>
  )
}

export default Masker
