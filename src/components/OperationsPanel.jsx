import React from 'react';

import { useState, useContext } from 'react';

import "./OperationsPanel.css";

function OperationsPanel(/* { onExpand, onClear, onAccept } */) {

  return (
    <div id="operations-panel">
      <button /* onClick={onExpand} */>
        Expand Selection
      </button>
      <button /* onClick={onClear} */>
        Clear Selection
      </button>
      <button /* onClick={onAccept} */>
        Accept Selection
      </button>
    </div>
  )
}

export default OperationsPanel
