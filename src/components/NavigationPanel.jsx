import React, { useState, useEffect } from 'react';

function NavigationPanel({ iecs, onIecChange }) {
  const [ iecOffset, setIecOffset ] = useState(0);

  function clickForward() {
    const newOffset = iecOffset + 1;
    // console.log("### Forward clicked, new offset is", newOffset);
    onIecChange(newOffset);
    setIecOffset(newOffset);
  }

  function onClickBack() {
    const newOffset = iecOffset - 1;
    onIecChange(newOffset);
    setIecOffset(newOffset);
  }

  return (
    <div id="navigationPanel" className="flex gap-2">
      <button id="goBack" onClick={onClickBack} className="bg-gray-200 dark:bg-slate-900">Backward</button>
      <button id="skipForward" onClick={clickForward} className="bg-gray-200 dark:bg-slate-900">Forward</button>
    </div>
  );
}

export default NavigationPanel;
