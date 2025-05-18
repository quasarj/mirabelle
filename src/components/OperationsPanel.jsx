import React from 'react';

import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import "./OperationsPanel.css";

function OperationsPanel({ onAction }) {
  const buttonConfig = useSelector(state => state.presentation.buttonConfig);

  return (
    <div id="operations-panel">
      {buttonConfig.maskerReview.visibility.accepted && (
        <button onClick={() => onAction("accept mask")} >
          Accept Mask
        </button>
      )}
      {buttonConfig.maskerReview.visibility.rejected && (
        <button onClick={() => onAction("reject mask")} >
          Reject Mask
        </button>
      )}
      {buttonConfig.maskerReview.visibility.skip && (
        <button onClick={() => onAction("skip mask")} >
          Skip
        </button>
      )}
      {buttonConfig.maskerReview.visibility.nonMaskable && (
        <button onClick={() => onAction("nonmaskable mask")} >
          Non-Maskable
        </button>
      )}

      {buttonConfig.masker.visibility.expand && (
        <button onClick={() => onAction("expand")} >
          Expand Selection
        </button>
      )}
      {buttonConfig.masker.visibility.clear && (
        <button onClick={() => onAction("clear")} >
          Clear Selection
        </button>
      )}
      {buttonConfig.masker.visibility.accept && (
        <button onClick={() => onAction("accept")} >
          Accept Selection
        </button>
      )}

      {buttonConfig.visualReview.visibility.good && (
        <button onClick={() => onAction("good")} >
          Good
        </button>
      )}
      {buttonConfig.visualReview.visibility.bad && (
        <button onClick={() => onAction("bad")} >
          Bad
        </button>
      )}
      {buttonConfig.visualReview.visibility.blank && (
        <button onClick={() => onAction("blank")} >
          Blank
        </button>
      )}
      {buttonConfig.visualReview.visibility.scout && (
        <button onClick={() => onAction("scout")} >
          Scout
        </button>
      )}
      {buttonConfig.visualReview.visibility.other && (
        <button onClick={() => onAction("other")} >
          Other
        </button>
      )}
      {buttonConfig.visualReview.visibility.flag && (
        <button onClick={() => onAction("flag")} >
          Flag for Masking
        </button>
      )}
    </div>
  )
}

export default OperationsPanel
