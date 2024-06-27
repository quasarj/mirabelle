import React from 'react';

function MaskerPanel() {
  return (
    <div id="maskerPanel" className="h-12 flex justify-center gap-2">
        <button id="expandSelection" className="bg-gray-200 dark:bg-slate-900">Expand Selection</button>
        <button id="clearSelection" className="bg-gray-200 dark:bg-slate-900">Clear Selection</button>
        <button id="acceptSelection" className="bg-gray-200 dark:bg-slate-900">Accept Selection</button>
      </div>
  );
}

export default MaskerPanel;

// function MaskerPanel({ onExpand, onClear, onAccept }) {
//   return (
//     <div id="maskerPanel" className="w-full flex justify-center gap-2">
//         <button onClick={onExpand} id="expandSelection">Expand Selection</button>
//         <button onClick={onClear} id="clearSelection">Clear Selection</button>
//         <button onClick={onAccept} id="acceptSelection">Accept Selection</button>
//       </div>
//   );
// }