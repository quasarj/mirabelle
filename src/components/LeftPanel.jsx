import React, { useContext } from 'react';
import FilesPanel from './FilesPanel.jsx';
import ToolsPanel from './ToolsPanel.jsx';

import { Context } from './Context.js';

function LeftPanel() {
    const { toolsPanelVisible, filesPanelVisible, layout } = useContext(Context);

    return (
        <div id="leftPanelWrapper" className="grid grid-rows-[1fr] h-full w-72 gap-2">
            {filesPanelVisible ? <FilesPanel /> : null}
            {toolsPanelVisible ? <ToolsPanel /> : null}
        </div>
    );
}

export default LeftPanel;
