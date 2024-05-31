import React from 'react';

function MaskerPanel() {
  return (
    <div id="maskerPanel" className="w-full flex justify-center gap-2">
        <button id="expandSelection">Expand Selection</button>
        <button id="clearSelection">Clear Selection</button>
        <button id="acceptSelection">Accept Selection</button>
      </div>
  );
}

export default MaskerPanel;