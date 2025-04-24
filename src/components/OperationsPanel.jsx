import React from 'react';

import { useState, useContext } from 'react';

import "./OperationsPanel.css";

function OperationsPanel({ onExpand, onClear, onAccept }) {

  return (
    <div id="OperationsPanel">
      <ol>
        <button onClick={onExpand}>
          Expand Selection
        </button>
        <button onClick={onClear}>
          Clear Selection
        </button>
        <button onClick={onAccept}>
          Accept Selection
        </button>
      </ol>
    </div>
  )
}

export default OperationsPanel
