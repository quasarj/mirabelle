import React from 'react';

import EditViewPanel from "./EditViewPanel.jsx";
import NavigationPanel from "./NavigationPanel.jsx";

function MiddleTopPanel({template}) {
  return (
    <div id="middleTopPanel" className="w-full flex justify-between items-center">
        {template !== "Masker" && <NavigationPanel />}
        {/*<EditViewPanel />*/}
      </div>
  );
}

export default MiddleTopPanel;