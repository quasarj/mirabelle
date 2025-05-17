import React, { useState, useEffect, useRef } from 'react';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { useSelector, useDispatch } from 'react-redux'
import { setFunction, setForm } from '@/features/maskingSlice'
import { setStateValue, Enums } from '@/features/presentationSlice'

// Use this global to track when the tools have been added globally
let toolsLoaded = false;

const {
  ToolGroupManager,
  TrackballRotateTool,
  BrushTool,
  RectangleScissorsTool,
  StackScrollTool,
  WindowLevelTool,
  CrosshairsTool,
  PanTool,
  ZoomTool,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { MouseBindings } = csToolsEnums;

export default function useToolsManager({
  toolGroup,
  defaultLeftClickMode,
  defaultRightClickMode,
}) {
  console.log("defaultLeftClickMode: ", defaultLeftClickMode);
  const _maskingOperation = useSelector((state) => state.masking.operation);
  const dispatch = useDispatch();

  let currentLeftClickTool;
  let currentRightClickTool;

  if (!toolsLoaded) {
    // add tools globally to cornerstone, but only once ever
    cornerstoneTools.addTool(RectangleScissorsTool);
    cornerstoneTools.addTool(StackScrollTool);
    cornerstoneTools.addTool(WindowLevelTool);
    cornerstoneTools.addTool(CrosshairsTool);
    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(ZoomTool);
    toolsLoaded = true;
  }

  const switchLeftClickMode = (new_mode) => {
    // Always make sure we setToolPassive on the current
    // tool, otherwise it will still be trying to work
    if (currentLeftClickTool) {
      toolGroup.setToolDisabled(currentLeftClickTool.toolName);
    }
    let newTool;

    switch (new_mode) {
      case "winlev":
        newTool = WindowLevelTool;
        break;

      case "crosshair":
        newTool = CrosshairsTool;
        break;

      case "selection":
        newTool = RectangleScissorsTool;
        break;
    }

    if (newTool === undefined) {
      // nothing to do, not sure what is going on
      console.log("Left Click mode was invalid: ", new_mode);
      return;
    }

    console.log("Setting left click to: ", newTool.toolName);

    toolGroup.setToolActive(newTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
    });
    currentLeftClickTool = newTool;
  };

  const switchRightClickMode = (new_mode) => {
    // Always make sure we setToolPassive on the current
    // tool, otherwise it will still be trying to work
    if (currentRightClickTool) {
      toolGroup.setToolDisabled(currentRightClickTool.toolName);
    }
    let newTool;

    switch (new_mode) {
      case "pan":
        newTool = PanTool;
        break;

      case "zoom":
        newTool = ZoomTool;
        break;
    }

    toolGroup.setToolActive(newTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }],
    });
    currentRightClickTool = newTool;
  };

  useEffect(() => {
    // add tools and setup default toolGroup actions
    toolGroup.addTool(RectangleScissorsTool.toolName);
    toolGroup.addTool(StackScrollTool.toolName);
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(CrosshairsTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);

    toolGroup.setToolActive(StackScrollTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
    });

    switchLeftClickMode(defaultLeftClickMode);

  }, [toolGroup]);

  return {
    switchRightClickMode,
    switchLeftClickMode,
    switchFunctionMode: (mode) => {
      dispatch(
        setStateValue({
          path: "function",
          value: mode,
        }),
      );
      dispatch(setFunction(mode));
    },
    switchFormMode: (mode) => {
      dispatch(
        setStateValue({
          path: "form",
          value: mode,
        }),
      );
      dispatch(setForm(mode));
    },
  };
}
