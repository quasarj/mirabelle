import React, { useContext } from 'react';
import { Context } from './Context.js';

function MaskerPanel({
    onExpand, onClear, onAccept, // masker functions
    onMarkAccepted, onMarkRejected, onMarkSkip, onMarkNonMaskable, // masker review functions
}) {
    const {
        maskerPanelVisible,
        maskerPanelExpandSelectionVisible,
        maskerPanelClearSelectionVisible,
        maskerPanelAcceptSelectionVisible,

        maskerReviewPanelVisible,
        maskerReviewPanelAcceptedVisible,
        maskerReviewPanelRejectedVisible,
        maskerReviewPanelSkipVisible,
        maskerReviewPanelNonMaskableVisible,
    } = useContext(Context);

    if (maskerReviewPanelVisible) {
        // The review buttons
        return (
            <div id="maskerPanel" className="h-12 flex justify-center gap-2">
                {maskerReviewPanelAcceptedVisible &&
                    <button
                        id="markAccepted"
                        onClick={onMarkAccepted}
                        className="text-white bg-blue-700 hover:bg-blue-800">
                        Accept Mask
                    </button>}
                {maskerReviewPanelRejectedVisible &&
                    <button
                        id="markRejected"
                        onClick={onMarkRejected}
                        className="text-white bg-red-700 hover:bg-red-800">
                        Reject Mask
                    </button>}
                {maskerReviewPanelSkipVisible &&
                    <button
                        onClick={onMarkSkip}
                        className="text-white bg-slate-500 hover:bg-red-800">
                        Skip Mask
                    </button>}
                {maskerReviewPanelNonMaskableVisible &&
                    <button
                        onClick={onMarkNonMaskable}
                        className="text-white bg-slate-500 hover:bg-red-800">
                        Non Maskable
                    </button>}
            </div>
        );
    } else if (maskerPanelVisible) {
        // the normal masking buttons
        return (
            <div id="maskerPanel" className="h-12 flex justify-center gap-2">
                {maskerPanelExpandSelectionVisible &&
                    <button
                        onClick={onExpand}
                        id="expandSelection"
                        className="bg-blue-100 dark:bg-slate-900">
                        Expand Selection
                    </button>}
                {maskerPanelClearSelectionVisible &&
                    <button
                        onClick={onClear}
                        id="clearSelection"
                        className="bg-blue-100 dark:bg-slate-900">
                        Clear Selection
                    </button>}
                {maskerPanelAcceptSelectionVisible &&
                    <button
                        onClick={onAccept}
                        id="acceptSelection"
                        className="bg-blue-100 dark:bg-slate-900">
                        Accept Selection
                    </button>}
            </div>
        );
    }
}

export default MaskerPanel;
