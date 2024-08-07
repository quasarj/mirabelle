import React, { forwardRef, useRef } from 'react';
import CornerstoneViewer from './CornerstoneViewer';

function ViewPanel({ files, volumeName, iec }) {
  return (
    <div id="viewPanel" className="grid grid-rows-[1fr,auto] text-center gap-2 overflow- h-full">
	  {files && files.length > 0 &&
        <CornerstoneViewer 
          files={files}
          volumeName={volumeName}
          iec={iec}
        />
	  }
    </div>
  );
};

export default ViewPanel;
