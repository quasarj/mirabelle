import React, { useState, useEffect, useRef } from 'react';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { RenderingEngine, Enums } from "@cornerstonejs/core"

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  StackScrollMouseWheelTool,
  ZoomTool,
  PlanarRotateTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

function CSToolsPanel({ toolGroup }) {

  // setup the global tools situation

  useEffect(() => {
    const setup = async () => {
      try {
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.addTool(WindowLevelTool);
        // cornerstoneTools.addTool(StackScrollTool);
        cornerstoneTools.addTool(StackScrollMouseWheelTool);
        cornerstoneTools.addTool(ZoomTool);
        cornerstoneTools.addTool(PlanarRotateTool);
      } catch (error) {
        // just ignore any errors loading the tools, so they
        // can be loaded multiple times
        // console.log("Error calling addTool:", error);
      }


      toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: false });
      // toolGroup.addTool(PlanarRotateTool.toolName);

      toolGroup.setToolActive(StackScrollMouseWheelTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Wheel, // Wheel Mouse
          },
        ],
      });
    };

    setup();
  }, []); // no watch variable, will run ONLY ONCE on mount

  return (
    <div id="filesPanel" className=" p-6 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900">
      This panel handles tool setup (presumably buttons could be here to change things)
    </div>
  );
}

export default CSToolsPanel;
