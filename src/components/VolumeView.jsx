import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
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

  // These should probably both be stored in a State. As they are here,
  // they would get re-generated anytime this component is redrawn

  // Create a renderingEngine for each volume expected to be on the screen
  // at the same time; so here, only one.
  let renderingEngine = new RenderingEngine("re1");
  
  // Create a toolGroup for each disticnt set of groups expected to be used.
  // Probably need two for 2d + 3d
  let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");
  let toolGroup3d = ToolGroupManager.createToolGroup("toolGroup3d");

  cornerstoneTools.addTool(TrackballRotateTool);
  cornerstoneTools.addTool(BrushTool);
  cornerstoneTools.addTool(RectangleScissorsTool);
  cornerstoneTools.addTool(StackScrollTool);

  toolGroup3d.addTool(TrackballRotateTool.toolName);

  toolGroup3d.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary,
      },
    ],
  });



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
			viewportId="coronal3d"
			volumeId={volumeId}
			renderingEngine={renderingEngine}
			toolGroup={toolGroup3d}
			segmentationId={segmentationId}
			orientation="CORONAL"
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
