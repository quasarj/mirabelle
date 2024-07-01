import React, { useContext } from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

import { Context } from './Context.js';

function LeftPanel({ setZoom, setOpacity }) {
  const { layout } = useContext(Context);
  
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full w-72 overflow-hidden gap-2">
      {layout !== 'Masker' && layout !== 'MaskerVR' ? <FilesPanel /> : null }
      <FilesPanel />
      <ToolsPanel setZoom={setZoom} setOpacity={setOpacity} />
    </div>
  );
}

export default LeftPanel;