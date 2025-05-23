import React, { useState, useEffect, useRef } from 'react';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { useSelector, useDispatch } from 'react-redux'
import { setFunction, setForm } from '@/features/maskingSlice'
import { Enums } from '@/features/presentationSlice'
import { setOption } from '@/features/optionSlice'

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



/**
 * Get the active tools for a given tool group and mouse button
 * @param {object} toolGroup - The tool group to check
 * @param {number} mouseButton - The mouse button to check (1 for left, 2 for right)
 * @return {array} - An array of active tool names for the given mouse button
 */
function getActiveTools(toolGroup, mouseButton) {
  let bindings = Object.keys(toolGroup.toolOptions)
    .map((key) => [
      key,
      toolGroup.toolOptions[key].bindings
        .map((binding) => binding.mouseButton)
        .filter((binding) => binding === mouseButton),
    ])
    .filter(([key, binding]) => binding.length > 0)
    .map(([key]) => key);

  return bindings;
}

export default function useToolsManager({
  toolGroup,
  toolGroup3d,
  defaultLeftClickMode,
  defaultRightClickMode,
}) {
  const _maskingOperation = useSelector((state) => state.masking.operation);
  const dispatch = useDispatch();

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
    getActiveTools(toolGroup, MouseBindings.Primary).forEach((tool) => {
      toolGroup.setToolDisabled(tool);
    });
    let newTool;

    switch (new_mode) {
      case Enums.LeftClickOptions.WINDOW_LEVEL:
        newTool = WindowLevelTool;
        break;

      case Enums.LeftClickOptions.CROSSHAIRS:
        newTool = CrosshairsTool;
        break;

      case Enums.LeftClickOptions.SELECTION:
        newTool = RectangleScissorsTool;
        break;
    }

    if (newTool === undefined) {
      // nothing to do, not sure what is going on
      console.error("Left Click mode was invalid: ", new_mode);
      return;
    }

    toolGroup.setToolActive(newTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
    });
  };

  const switchRightClickMode = (new_mode) => {
    getActiveTools(toolGroup, MouseBindings.Secondary).forEach((tool) => {
      toolGroup.setToolDisabled(tool);
    });
    if (toolGroup3d) {
      getActiveTools(toolGroup3d, MouseBindings.Secondary).forEach((tool) => {
        toolGroup3d.setToolDisabled(tool);
      });
    }

    let newTool;

    switch (new_mode) {
      case Enums.RightClickOptions.PAN:
        newTool = PanTool;
        break;

      case Enums.RightClickOptions.ZOOM:
        newTool = ZoomTool;
        break;
    }

    toolGroup.setToolActive(newTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }],
    });
    if (toolGroup3d) {
      toolGroup3d.setToolActive(newTool.toolName, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }],
      });
    }
  };

  useEffect(() => {
    // add tools and setup default toolGroup actions
    toolGroup.addTool(RectangleScissorsTool.toolName);
    toolGroup.addTool(StackScrollTool.toolName);
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(CrosshairsTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);

    if (toolGroup3d) {
      toolGroup3d.addTool(ZoomTool.toolName);
      toolGroup3d.addTool(PanTool.toolName);
    }

    toolGroup.setToolActive(StackScrollTool.toolName, {
      bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
    });
    if (toolGroup3d) {
      toolGroup3d.setToolActive(ZoomTool.toolName, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Wheel }],
      });
    }

    switchLeftClickMode(defaultLeftClickMode);
    switchRightClickMode(defaultRightClickMode);

  }, [toolGroup]);

  return {
    switchRightClickMode,
    switchLeftClickMode,
    switchFunctionMode: (mode) => {
      dispatch(
        setOption({
          key: "function",
          value: mode,
        }),
      );
      dispatch(setFunction(mode));
    },
    switchFormMode: (mode) => {
      dispatch(
        setOption({
          key: "form",
          value: mode,
        }),
      );
      dispatch(setForm(mode));
    },
  };
}
