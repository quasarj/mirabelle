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

function VolumeViewport3d({ viewportId, renderingEngine, toolGroup, volumeId, orientation, preset3d }) {
  const elementRef = useRef(null);

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
          // preset: 'CT-MIP',
          // preset: 'MR-T2-Brain',
          // preset: 'MR-Default',
          preset: preset3d,
        });
        viewport.render();
      });


      // Render the image
      // viewport.render()

    }

    setup()
  }, [elementRef, volumeId])

  useEffect(() => {
    const viewport = renderingEngine.getViewport(viewportId);
    viewport.setProperties({
      preset: preset3d,
    });
    viewport.render();
  }, [preset3d]);


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
