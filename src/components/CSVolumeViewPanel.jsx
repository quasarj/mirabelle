/**
 * Simple volume display panel. Assumes the volume has already
 * been created and loaded into the cache. Accepts volumeId as a prop
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

function CSVolumeViewPanel({ viewportId, renderingEngine, toolGroup, volumeId, orientation }) {
  const elementRef = useRef(null);
  // This came from an example, I am not sure why it's using
  // a ref and not a State?? Maybe to avoid a redraw?
  const running = useRef(false);

  let realOrientation = Enums.OrientationAxis.ACQUISITION;
  if (orientation == 'SAGITTAL') {
    realOrientation = Enums.OrientationAxis.SAGITTAL;
  }
  if (orientation == 'AXIAL') {
    realOrientation = Enums.OrientationAxis.AXIAL;
  }
  if (orientation == 'CORONAL') {
    realOrientation = Enums.OrientationAxis.CORONAL;
  }


  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return
      }
      running.current = true

      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: elementRef.current,
        defaultOptions: {
          orientation: realOrientation,
        },
      }

      renderingEngine.enableElement(viewportInput)

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

		  toolGroup.addViewport(viewportId, renderingEngine.id);

      // Set the volume on the viewport and it's default properties
      viewport.setVolumes([{ volumeId }])

      // Render the image
      viewport.render()
    }

    setup()
  }, [elementRef, running])

  return (
	  <>
    <div
      ref={elementRef}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
	</>
  )
}

export default CSVolumeViewPanel;
