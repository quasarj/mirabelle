import React, { forwardRef, useRef } from 'react';
import CornerstoneViewer from './CornerstoneViewer';

const ViewPanel = forwardRef(function ViewPanel({ files, zoom, opacity, layout, volumeName }, ref) {
  // fowrading a ref on down to the CornerstoneViewer component

  return (
    <div id="viewPanel" className="flex text-center gap-2 h-my-2 flex-grow overflow-hidden">
	  {files && files.length > 0 &&
        <CornerstoneViewer ref={ref} zoom={zoom} opacity={opacity} layout={layout} files={files} volumeName={volumeName}/>
	  }
    </div>
  );
});

export default ViewPanel;
