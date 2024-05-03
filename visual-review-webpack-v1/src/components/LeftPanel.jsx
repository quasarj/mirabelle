import React from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

function LeftPanel() {
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full overflow-hidden gap-2">
      <FilesPanel />
      <ToolsPanel />
    </div>
  );
}

export default LeftPanel;