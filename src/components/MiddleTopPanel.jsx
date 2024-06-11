import React from 'react';
import { useContext } from 'react';
import { TemplateContext } from './TemplateContext.js';


import EditViewPanel from "./EditViewPanel.jsx";
import NavigationPanel from "./NavigationPanel.jsx";

function MiddleTopPanel({ iecs, onIecChange }) {
  const template = useContext(TemplateContext);
  return (
    <div id="middleTopPanel" className="w-full flex justify-between items-center">
        {template === "MaskerVR" && <NavigationPanel iecs={iecs} onIecChange={onIecChange}/>}
        {/*<EditViewPanel />*/}
      </div>
  );
}

export default MiddleTopPanel;
