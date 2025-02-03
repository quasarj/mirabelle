import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import VolumeViewport from './VolumeViewport';
// import CSToolsPanel from './CSToolsPanel';
// import CSVolumeFiles from './CSVolumeFiles';
// import CSStackFiles from './CSStackFiles';

const {
  ToolGroupManager,
} = cornerstoneTools;

const toolGroupId = 'STACK_TOOL_GROUP_ID';


function VolumeView({ volumeId }) {

  // These should probably both be stored in a State. As they are here,
  // they would get re-generated anytime this component is redrawn

  // Create a renderingEngine for each volume expected to be on the screen
  // at the same time; so here, only one.
  let renderingEngine = new RenderingEngine("re1");
  
  // Create a toolGroup for each disticnt set of groups expected to be used.
  // Probably need two for 2d + 3d
  let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");
  let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");

  return (
    <>
      <VolumeViewport 
        viewportId="axial2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        orientation="AXIAL"
      />
      <VolumeViewport 
        viewportId="sagittal2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        orientation="SAGITTAL"
      />
      <VolumeViewport 
        viewportId="coronal2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        orientation="CORONAL"
      />
    </>
  );

}

export default VolumeView;
