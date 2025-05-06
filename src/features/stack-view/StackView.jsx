import React, { useState, useEffect } from 'react';

import { RenderingEngine } from "@cornerstonejs/core"
import * as cornerstone from "@cornerstonejs/core"
import * as cornerstoneTools from '@cornerstonejs/tools';

import StackViewport from '@/components/StackViewport';
import { ToolsPanel } from '@/features/tools';

import './StackView.css';

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


function StackView({ frames }) {
  const [renderingEngine, setRenderingEngine] = useState();
  const [toolGroup, setToolGroup] = useState();

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

    let toolGroup = ToolGroupManager.createToolGroup("toolGroup2d");



    // TODO: this is for debu use only
    window.ToolGroupManager = ToolGroupManager;
    window.renderingEngine = renderingEngine;
    window.toolGroup2d = toolGroup;

    setRenderingEngine(renderingEngine);
    setToolGroup(toolGroup);

    // Teardown function
    return () => {
      ToolGroupManager.destroyToolGroup("toolGroup2d")
      // Do not delete the RenderingEngine here, it needs
      // to stay, for now
    };
  }, []);

  if (renderingEngine == null) {
    return <div>Loading...</div>;
  }

  return (
    <div id="stack-view">
      <StackViewport
        frames={frames}
        toolGroup={toolGroup}
        renderingEngine={renderingEngine}
        viewportId="myviewport"
      />
    </div>
  );
}

export default StackView;
