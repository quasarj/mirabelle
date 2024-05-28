import React from 'react';
import CornerstoneViewer from './CornerstoneViewer';

function ViewPanel({ zoom, opacity }) {
  return (
    <div id="viewPanel" className="flex text-center gap-2 h-my-2 flex-grow overflow-hidden">
        <CornerstoneViewer zoom={zoom} opacity={opacity} />
    </div>
  );
}

export default ViewPanel;