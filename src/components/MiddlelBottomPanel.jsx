import React from 'react';

import MaskerPanel from './MaskerPanel.jsx';
import NavigationPanel from './NavigationPanel.jsx';

function MiddlelBottomPanel() {
  return (
    <div id="middleBottomPanel" className="w-full h-12 flex justify-between gap-2">
        <MaskerPanel />
        <NavigationPanel />
      </div>
  );
}

export default MiddlelBottomPanel;

// function MaskerPanel({ onExpand, onClear, onAccept }) {
//   return (
//     <div id="maskerPanel" className="w-full flex justify-center gap-2">
//         <button onClick={onExpand} id="expandSelection">Expand Selection</button>
//         <button onClick={onClear} id="clearSelection">Clear Selection</button>
//         <button onClick={onAccept} id="acceptSelection">Accept Selection</button>
//       </div>
//   );
// }