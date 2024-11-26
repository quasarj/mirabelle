/**
 * This component exists only to initialize Cornerstone
 * It then delegates tool setup to a sub-component
 * And it delegates viewport display to another sub-component
 *
 */
import React, { useState, useEffect } from 'react';
import TestToolsPanel from './TestToolsPanel';
import TestFilesPanel from './TestFilesPanel';

import { RenderingEngine, Enums, volumeLoader, cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/core"
import {init as csRenderInit} from "@cornerstonejs/core"
import {init as csToolsInit} from "@cornerstonejs/tools"
import * as cornerstoneTools from '@cornerstonejs/tools';
import {init as dicomImageLoaderInit} from "@cornerstonejs/dicom-image-loader"

const {
  ToolGroupManager,
} = cornerstoneTools;

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

  // These should probably both be stored in a State. As they are here,
  // they would get re-generated anytime this component is redrawn
  toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  renderingEngine = new RenderingEngine(renderingEngineId);

  return (
    <div>
      <TestToolsPanel toolGroup={toolGroup} />
      <TestFilesPanel
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
      />
    </div>
  );

};

export default ViewPanel;
