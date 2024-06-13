import React from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

function LeftPanel({ setPreset, setZoom, setOpacity, template }) {
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full overflow-hidden gap-2">
      {template !== 'Masker' && template !== 'MaskerVR' ? <FilesPanel /> : null }
      <ToolsPanel setZoom={setZoom} setOpacity={setOpacity} setPreset={setPreset}/>
    </div>
  );
}

export default LeftPanel;
