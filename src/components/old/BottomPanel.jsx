import React, { useContext } from 'react';
import { Context } from './Context.js';

function BottomPanel() {
    const { searchPanelVisible } = useContext(Context);

    return (
        <div id="bottomPanel" className="flex rounded-lg dark:bg-opacity-5 bg-gray-100 p-2">
            
        </div>
    );
}

export default BottomPanel;