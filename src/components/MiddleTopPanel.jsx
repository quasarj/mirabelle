import React from 'react';

import EditViewPanel from "./EditViewPanel.jsx";
import NavigationPanel from "./NavigationPanel.jsx";

function MiddleTopPanel() {
  return (
    <div id="middleTopPanel" className="w-full flex justify-between items-center">
        <NavigationPanel />
        <EditViewPanel />
      </div>
  );
}

export default MiddleTopPanel;