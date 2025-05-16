import React, { useContext } from "react";
import { Context } from "./Context.js";

function ReviewPanel({
  onMarkGood,
  onMarkBad,
  onMarkBlank,
  onMarkScout,
  onMarkOther,
  onMarkFlag,
}) {
  const {
    visualReviewPanelGoodVisible,
    visualReviewPanelBadVisible,
    visualReviewPanelBlankVisible,
    visualReviewPanelScoutVisible,
    visualReviewPanelOtherVisible,
    visualReviewPanelFlagVisible,
  } = useContext(Context);

  // The review buttons
  return (
    <div id="reviewPanel" className="h-12 flex justify-center gap-2">
      {visualReviewPanelGoodVisible && (
        <button
          id="markGood"
          onClick={onMarkGood}
          className="text-white bg-green-700 hover:bg-green-800"
        >
          Good
        </button>
      )}
      {visualReviewPanelBadVisible && (
        <button
          id="markBad"
          onClick={onMarkBad}
          className="text-white bg-red-700 hover:bg-red-800"
        >
          Bad
        </button>
      )}
      {visualReviewPanelBlankVisible && (
        <button
          id="markBlank"
          onClick={onMarkBlank}
          className="text-white bg-yellow-700 hover:bg-yellow-800"
        >
          Blank
        </button>
      )}
      {visualReviewPanelScoutVisible && (
        <button
          id="markScout"
          onClick={onMarkScout}
          className="text-white bg-yellow-700 hover:bg-yellow-800"
        >
          Scout
        </button>
      )}
      {visualReviewPanelOtherVisible && (
        <button
          id="markOther"
          onClick={onMarkOther}
          className="text-white bg-yellow-700 hover:bg-yellow-800"
        >
          Other
        </button>
      )}
      {visualReviewPanelFlagVisible && (
        <button
          id="markFlag"
          onClick={onMarkFlag}
          className="text-white bg-blue-700 hover:bg-blue-800"
        >
          Flag for Masking
        </button>
      )}
    </div>
  );
}

export default ReviewPanel;
