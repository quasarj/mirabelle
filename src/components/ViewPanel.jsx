import React, { useState, useEffect } from 'react';
import TestPanel from './TestPanel';
import TestToolsPanel from './TestToolsPanel';

import { RenderingEngine, Enums, volumeLoader, cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/core"
import {init as csRenderInit} from "@cornerstonejs/core"
import {init as csToolsInit} from "@cornerstonejs/tools"
import * as cornerstoneTools from '@cornerstonejs/tools';
import {init as dicomImageLoaderInit} from "@cornerstonejs/dicom-image-loader"

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

const toolGroupId = 'STACK_TOOL_GROUP_ID';

volumeLoader.registerUnknownVolumeLoader(
  cornerstoneStreamingImageVolumeLoader 
)

function ViewPanel({ files, volumeName, iec }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const renderingEngineId = "myRenderingEngine"
  let renderingEngine;
  let toolGroup;

  useEffect(() => {
    const initialize = async () => {
      // new 2.0 init routines
      await csRenderInit()
      await csToolsInit()
      dicomImageLoaderInit({maxWebWorkers:1})


      setIsInitialized(true);
    };

    initialize();
  }, []); // passing no value causes this to run ONLY ONCE during mount

  // short-circuit if Cornerstone hasn't loaded yet
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  renderingEngine = new RenderingEngine(renderingEngineId);

  return (
    <div>
      <TestToolsPanel toolGroup={toolGroup} />
      <TestPanel 
        renderingEngine={renderingEngine}
        viewportId='CT1'
        toolGroup={toolGroup}
      />
      <TestPanel 
        renderingEngine={renderingEngine}
        viewportId='CT2'
        toolGroup={toolGroup}
      />
      Loaded!!
    </div>
  );

};

export default ViewPanel;
