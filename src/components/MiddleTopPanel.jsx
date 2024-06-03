import React from 'react';

import EditViewPanel from "./EditViewPanel.jsx";
import NavigationPanel from "./NavigationPanel.jsx";

function MiddleTopPanel({ template, iecs, onIecChange }) {
  return (
    <div id="middleTopPanel" className="w-full flex justify-between items-center">
        {template !== "Masker" && <NavigationPanel iecs={iecs} onIecChange={onIecChange}/>}
        {/*<EditViewPanel />*/}
      </div>
  );
}

export default MiddleTopPanel;
