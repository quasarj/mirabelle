import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstone from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import VolumeViewport from '@/components/VolumeViewport';
import VolumeViewport3d from '@/components/VolumeViewport3d';
// import ToolsPanel from '@/features/tools/ToolsPanel';
import { ToolsPanel } from '@/features/tools';

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

const toolGroupId = 'STACK_TOOL_GROUP_ID';


function VolumeView({ volumeId, segmentationId, defaultPreset3d }) {
  const [renderingEngine, setRenderingEngine] = useState();
  const [toolGroup, setToolGroup] = useState();
  const [toolGroup3d, setToolGroup3d] = useState();
  const [preset3d, setPreset3d] = useState(defaultPreset3d);

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
    
    let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");
    let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");

    toolGroup3d.addTool(TrackballRotateTool.toolName);

    toolGroup3d.setToolActive(TrackballRotateTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary,
        },
      ],
    });

    // TODO: this is for debu use only
    window.ToolGroupManager = ToolGroupManager;
    window.renderingEngine = renderingEngine;
    window.toolGroup2d = toolGroup;

    setRenderingEngine(renderingEngine);
    setToolGroup(toolGroup);
    setToolGroup3d(toolGroup3d);

    // Teardown function
    return () => {
      ToolGroupManager.destroyToolGroup("toolGroup2d")
      ToolGroupManager.destroyToolGroup("toolGroup3d")
      // Do not delete the RenderingEngine here, it needs
      // to stay, for now
    };
  }, []);

  if (renderingEngine == null) {
    return <div>Loading...</div>;
  }

  return (
    <div id="VolumeView">
      <div id="main">
        <div id="leftPanel">
          <ToolsPanel 
            toolGroup={toolGroup} 
            defaultPreset={defaultPreset3d}
            onPresetChange={(val) => setPreset3d(val)}
          />
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <td>
              <VolumeViewport3d
                viewportId="coronal3d"
                volumeId={volumeId}
                renderingEngine={renderingEngine}
                toolGroup={toolGroup3d}
                segmentationId={segmentationId}
                orientation="CORONAL"
                preset3d={preset3d}
              />
            </td>
            <td>
              <VolumeViewport 
                viewportId="axial2d"
                volumeId={volumeId}
                renderingEngine={renderingEngine}
                toolGroup={toolGroup}
                segmentationId={segmentationId}
                orientation="AXIAL"
              />
            </td>
          </tr>
          <tr>
            <td>
              <VolumeViewport 
                viewportId="sagittal2d"
                volumeId={volumeId}
                renderingEngine={renderingEngine}
                toolGroup={toolGroup}
                segmentationId={segmentationId}
                orientation="SAGITTAL"
              />
            </td>
            <td>
              <VolumeViewport 
                viewportId="coronal2d"
                volumeId={volumeId}
                renderingEngine={renderingEngine}
                toolGroup={toolGroup}
                segmentationId={segmentationId}
                orientation="CORONAL"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VolumeView;
