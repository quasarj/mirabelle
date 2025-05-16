import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstone from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import VolumeViewport from '@/components/VolumeViewport';
import VolumeViewport3d from '@/components/VolumeViewport3d';
// import ToolsPanel from '@/features/tools/ToolsPanel';
import { ToolsPanel } from '@/features/tools';

import OperationsPanel from '@/components/OperationsPanel';

import './VolumeView.css';

const {
  ToolGroupManager,
  TrackballRotateTool,
  BrushTool,
  RectangleScissorsTool,
  StackScrollTool,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { MouseBindings } = csToolsEnums;

async function handleExpand() {
  coords = expandSegTo3D(segmentationId);

  //flag data as updated so it will redraw
  cornerstoneTools.segmentation
    .triggerSegmentationEvents
    .triggerSegmentationDataModified(segmentationId);


  // TODO I don't like this being here, perhaps put it inside VolumeView
  // and expose a callback that can be called from here? 
  const renderingEngine = cornerstone.getRenderingEngines()[0];
  const viewports = renderingEngine.getViewports();
  viewports.forEach(async (item) => {
    let viewportId = item.id;
    if (viewportId.startsWith("coronal3d")) {
      await segmentation.addSegmentationRepresentations(
        viewportId, [
        {
          segmentationId,
          type: csToolsEnums.SegmentationRepresentations.Surface,
        }
      ],
      );
    }
  });

}
function handleClear() {
  const segmentationVolume = cornerstone.cache.getVolume(segmentationId);
  const { dimensions, voxelManager } = segmentationVolume;

  let scalarData = voxelManager.getCompleteScalarDataArray();
  scalarData.fill(0);
  voxelManager.setCompleteScalarDataArray(scalarData);

  //flag data as updated so it will redraw
  cornerstoneTools.segmentation
    .triggerSegmentationEvents
    .triggerSegmentationDataModified(segmentationId);
}
async function handleAccept() {
  console.log(coords, volumeId, iec);
  await finalCalc(coords, volumeId, iec, "cuboid", "mask");
}

function VolumeView({ volumeId, segmentationId, defaultPreset3d, toolGroup, toolGroup3d }) {
  const [renderingEngine, setRenderingEngine] = useState();
  const [preset3d, setPreset3d] = useState(defaultPreset3d);

  const [mip, setMip] = useState(false);

  useEffect(() => {
    cornerstoneTools.addTool(TrackballRotateTool);
    cornerstoneTools.addTool(BrushTool);
    cornerstoneTools.addTool(RectangleScissorsTool);
    cornerstoneTools.addTool(StackScrollTool);

    // Only create a new rendering engine if one doesn't already exist
    let renderingEngine = cornerstone.getRenderingEngine("re1");
    if (renderingEngine === undefined) {
      renderingEngine = new RenderingEngine("re1");
    }

    toolGroup3d.addTool(TrackballRotateTool.toolName);

    toolGroup3d.setToolActive(TrackballRotateTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary,
        },
      ],
    });

    // TODO: this is for debug use only
    window.ToolGroupManager = ToolGroupManager;
    window.renderingEngine = renderingEngine;
    window.toolGroup2d = toolGroup;

    setRenderingEngine(renderingEngine);

    // Teardown function
    return () => {
    };
  }, []);

  if (renderingEngine == null) {
    return <div>Loading...</div>;
  }

  return (
    <div id="volume-view"
      className="viewer">
      <VolumeViewport3d
        viewportId="coronal3d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup3d}
        segmentationId={segmentationId}
        orientation="CORONAL"
        preset3d={preset3d}
      />
      <VolumeViewport
        viewportId="axial2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        segmentationId={segmentationId}
        orientation="AXIAL"
      />
      <VolumeViewport
        viewportId="sagittal2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        segmentationId={segmentationId}
        orientation="SAGITTAL"
      />
      <VolumeViewport
        viewportId="coronal2d"
        volumeId={volumeId}
        renderingEngine={renderingEngine}
        toolGroup={toolGroup}
        segmentationId={segmentationId}
        orientation="CORONAL"
      />
    </div >
  );
}

export default VolumeView;
