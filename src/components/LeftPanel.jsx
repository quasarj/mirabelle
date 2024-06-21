import React, { useContext } from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

import { Context } from './Context.js';

function LeftPanel({ setZoom, setOpacity }) {
  const { template } = useContext(Context);
  
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full overflow-hidden gap-2">
      {template !== 'Masker' && template !== 'MaskerVR' ? <FilesPanel /> : null }
      <ToolsPanel setZoom={setZoom} setOpacity={setOpacity} />
    </div>
  );
}

export default LeftPanel;