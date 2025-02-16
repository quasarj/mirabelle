import React from 'react';

import { useState, useContext } from 'react';

function OperationsPanel({ onExpand, onClear, onAccept }) {

  return (
    <>
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
    </>
  )
}

export default OperationsPanel
