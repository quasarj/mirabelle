import React, { forwardRef, useRef, useContext } from 'react';
import { Context } from './Context.js';
//import CornerstoneViewer from './CornerstoneViewer';
import ViewStackPanel from './ViewStackPanel';
import ViewVolumePanel from './ViewVolumePanel';

function ViewPanel({ details, files, volumeName, iec }) {

    const { viewport_layout } = useContext(Context);

    return (
        <div id="viewPanel" className="grid grid-rows-[1fr,auto] text-center gap-2 overflow- h-full">
            {viewport_layout == 'stack' && files && files.length > 0 &&
                <ViewStackPanel
                    files={files}
                    volumeName={volumeName}
                    iec={iec}
                />
            }
            {viewport_layout == 'volume' && files && files.length > 0 &&
                <ViewVolumePanel
                    files={files}
                    volumeName={volumeName}
                    iec={iec}
                    details={details}
                />
            }
        </div>
    );
};

export default ViewPanel;
