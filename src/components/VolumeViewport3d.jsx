/**
 **/
import React, { useState, useEffect, useRef } from 'react';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { RenderingEngine, Enums, volumeLoader } from "@cornerstonejs/core"

const {
  CONSTANTS,
  setVolumesForViewports,
} = cornerstone;

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

function VolumeViewport3d({ viewportId, renderingEngine, toolGroup, volumeId, orientation }) {
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

      const viewportInputArray = [{
        viewportId,
        type: Enums.ViewportType.VOLUME_3D,
        element: elementRef.current,
        defaultOptions: {
          orientation: realOrientation,
          background: CONSTANTS.BACKGROUND_COLORS.slicer3D,
        },
      }];

      // renderingEngine.enableElement(viewportInput)
      renderingEngine.setViewports(viewportInputArray);

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

		  toolGroup.addViewport(viewportId, renderingEngine.id);

      // Set the volume on the viewport and it's default properties
      // viewport.setVolumes([{ volumeId }])
      await setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        [viewportId]
      ).then(() => {
        viewport.setProperties({
          preset: 'CT-MIP',
        });
        viewport.render();
      });


      // Render the image
      // viewport.render()

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

export default VolumeViewport3d;
