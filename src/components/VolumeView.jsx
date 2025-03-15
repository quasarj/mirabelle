import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstone from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import VolumeViewport from './VolumeViewport';
import VolumeViewport3d from './VolumeViewport3d';
import ToolsPanel from './ToolsPanel2';

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


function VolumeView({ volumeId, segmentationId }) {
  const [renderingEngine, setRenderingEngine] = useState();
  const [toolGroup, setToolGroup] = useState();
  const [toolGroup3d, setToolGroup3d] = useState();

  useEffect(() => {
    cornerstoneTools.addTool(TrackballRotateTool);
    cornerstoneTools.addTool(BrushTool);
    cornerstoneTools.addTool(RectangleScissorsTool);
    cornerstoneTools.addTool(StackScrollTool);

    // Create a renderingEngine for each volume expected to be on the screen
    // at the same time; so here, only one.

    // if a renderingEngine already exsits, destroy it and make another
    if (renderingEngine != null) {
      renderingEngine.destroy()
    }
    let renderingEngine = new RenderingEngine("re1");
    
    // Create a toolGroup for each disticnt set of groups expected to be used.
    // Probably need two for 2d + 3d
    if (toolGroup == null) {
      ToolGroupManager.destroyToolGroup("toolGroup2d")
    }
    let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");

    if (toolGroup3d == null) {
      ToolGroupManager.destroyToolGroup("toolGroup3d")
    }
    let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");


    toolGroup3d.addTool(TrackballRotateTool.toolName);

    toolGroup3d.setToolActive(TrackballRotateTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary,
        },
      ],
    });

    window.ToolGroupManager = ToolGroupManager;
    window.renderingEngine = renderingEngine;
    setRenderingEngine(renderingEngine);
    setToolGroup(toolGroup);
    setToolGroup3d(toolGroup3d);
  }, []);

  if (renderingEngine == null) {
    return <div>Loading...</div>;
  }

  let coronal3d_viewport_id = `coronal3d_${volumeId}`;
  let axial2d_viewport_id = `axial2d_${volumeId}`;
  let sagittal2d_viewport_id = `sagittal2d_${volumeId}`;
  let coronal2d_viewport_id = `coronal2d_${volumeId}`;

  return (
    <div id="VolumeView">
	  <div id="main">
	  	<div id="leftPanel">
			<ToolsPanel toolGroup={toolGroup}/>
	  	</div>
	  </div>
		<table>
		<tbody>
		<tr>
			<td>
			<VolumeViewport3d
			viewportId={coronal3d_viewport_id}
			volumeId={volumeId}
			renderingEngine={renderingEngine}
			toolGroup={toolGroup3d}
			segmentationId={segmentationId}
			orientation="CORONAL"
			/>
			</td>
			<td>
			<VolumeViewport 
				viewportId={axial2d_viewport_id}
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
				viewportId={sagittal2d_viewport_id}
				volumeId={volumeId}
				renderingEngine={renderingEngine}
				toolGroup={toolGroup}
				segmentationId={segmentationId}
				orientation="SAGITTAL"
			/>
			</td>
			<td>
			<VolumeViewport 
				viewportId={coronal2d_viewport_id}
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
