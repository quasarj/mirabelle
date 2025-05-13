import React from 'react';

import { useState, useContext } from 'react';

import "./OperationsPanel.css";

function OperationsPanel({ onAction }) {

  return (
    <div id="operations-panel">
      <button onClick={() => onAction("expand")} >
        Expand Selection
      </button>
      <button onClick={() => onAction("clear")} >
        Clear Selection
      </button>
      <button onClick={() => onAction("accept")} >
        Accept Selection
      </button>
    </div>
  )
}

export default OperationsPanel
