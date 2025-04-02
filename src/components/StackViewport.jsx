/**
 * Simple stack display panel. 
 **/
import React, { useState, useEffect, useRef } from 'react';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { RenderingEngine, Enums, volumeLoader } from "@cornerstonejs/core"

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums,
  segmentation,
  utilities: cstUtils,
} = cornerstoneTools;

const { segmentation: segmentationUtils } = cstUtils;

const { ViewportType } = Enums;

function StackViewport({ frames, mip, viewportId, renderingEngine, toolGroup }) {
  console.log("[StackViewport] rendering")
  const elementRef = useRef(null);

  window.re = renderingEngine;

  useEffect(() => {
    const setup = async () => {
      if (frames === undefined) {
        return;
      }
      console.log("[VolumeViewport] setup running");

      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.STACK,
        element: elementRef.current,
      }

      renderingEngine.enableElement(viewportInput)

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

		  toolGroup.addViewport(viewportId, renderingEngine.id);

      await viewport.setStack(frames);

      // Render the image
      viewport.render()
    }

    setup()
  }, [elementRef, frames])


  return (
	  <>
    <div
      ref={elementRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
	</>
  )
}

export default StackViewport;
