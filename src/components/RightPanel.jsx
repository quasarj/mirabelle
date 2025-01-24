import React, { useContext } from 'react';
import DescriptionPanel from "./DescriptionPanel.jsx";
import { Context } from './Context.js';

function RightPanel({ details }) {
    const { descriptionPanelVisible } = useContext(Context);

    return (
        <div id="rightPanelWrapper" className="h-full w-72">
            {descriptionPanelVisible ? <DescriptionPanel details={details} /> : null}
        </div>
    );
}

export default RightPanel;