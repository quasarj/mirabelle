import React from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

function LeftPanel({ setZoom, setOpacity }) {
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full overflow-hidden gap-2">
      <FilesPanel />
      <ToolsPanel setZoom={setZoom} setOpacity={setOpacity} />
    </div>
  );
}

export default LeftPanel;