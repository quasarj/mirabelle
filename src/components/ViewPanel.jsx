import React, { forwardRef, useRef } from 'react';
import CornerstoneViewer from './CornerstoneViewer';

const ViewPanel = forwardRef(function ViewPanel({ files, volumeName, iec }, ref) {
  // fowrading a ref on down to the CornerstoneViewer component

  return (
    <div id="viewPanel" className="grid grid-rows-[1fr,auto] text-center gap-2 overflow- h-full">
	  {files && files.length > 0 &&
        <CornerstoneViewer ref={ref} files={files} volumeName={volumeName} iec={iec} />
	  }
    </div>
  );
});

export default ViewPanel;
