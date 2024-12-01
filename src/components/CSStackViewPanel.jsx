import React, { useState, useEffect, useRef } from 'react';

import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { RenderingEngine, Enums } from "@cornerstonejs/core"

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

const toolGroupId = 'STACK_TOOL_GROUP_ID';

function CSStackViewPanel({ viewportId, renderingEngine, toolGroup, imageIds }) {
  const elementRef = useRef(null)
  // This came from an example, I am not sure why it's using
  // a ref and not a State?? Maybe to avoid a redraw?
  const running = useRef(false)

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return
      }
      running.current = true

      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.STACK,
        element: elementRef.current,
      }

      renderingEngine.enableElement(viewportInput)

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

		  toolGroup.addViewport(viewportId, renderingEngine.id);

		viewport.setStack(imageIds);

		cornerstoneTools.utilities.stackPrefetch.enable(viewport.element);

      // Render the image
      viewport.render()
    }

    setup()

    // Create a stack viewport
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

export default CSStackViewPanel;
