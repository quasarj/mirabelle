import React, { useState, useContext } from 'react';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { useSelector } from 'react-redux';
import MaterialButtonSet from '@/components/MaterialButtonSet';
import './ToolsPanel.css';

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

function ToolsPanel({ toolGroup, onPresetChange, defaultPreset = 'CT-MIP' }) {
  const presets = useSelector(state => state.presentation.presets);
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);

  let currentLeftClickTool;
  let currentRightClickTool;

  const handlePresetChange = (event) => {
    const newPreset = event.target.value;
    setSelectedPreset(newPreset);
    onPresetChange(newPreset);
  };

    const presetGroupButtonConfig = [
		{
			name: "MR-Default",
			icon: "domino_mask",
			action: () => onPresetChange("MR-Default"),
		},
		{
			name: "CT-MIP",
			icon: "domino_mask",
			action: () => onPresetChange("CT-MIP"),
		},
    ]

    // --------------------------------------------------------------------- //
    //  Function group button config and handlers
    // --------------------------------------------------------------------- //
    function switchFunctionMode(mode) {
      // TODO this should probably be a prop that bubbles up
        console.log("switch to function mode: ", mode);
    }

    const functionGroupButtonConfig = [
		{
			name: "Mask",
			icon: "domino_mask",
			action: () => switchFunctionMode("mask"),
		},
		{
			name: "Blackout",
			icon: "imagesearch_roller",
			action: () => switchFunctionMode("blackout"),
		},
		{
			name: "Slice Removal",
			icon: "content_cut",
			action: () => switchFunctionMode("slice_removal"),
		},

    ];

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

    toolGroup.setToolActive(newTool.toolName, {
      bindings: [
        { mouseButton: csToolsEnums.MouseBindings.Primary },
      ],
    });
    currentLeftClickTool = newTool;
  }

    const leftClickGroupButtonConfig = [
		{
			name: "Window Level",
			icon: "exposure",
			action: () => switchLeftClickMode("winlev"),
		},
		{
			name: "Crosshairs",
			icon: "point_scan",
			action: () => switchLeftClickMode("crosshair"),
		},
		{
			name: "Selection",
			icon: "gesture_select",
			action: () => switchLeftClickMode("selection"),
		},

    ];


  const switchRightClickMode = (new_mode) => {
    console.log("Switching right click to: ", new_mode);
    window.toolGroup = toolGroup;
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

    console.log("new tool:", newTool);
    toolGroup.setToolActive(newTool.toolName, {
      bindings: [
        { mouseButton: csToolsEnums.MouseBindings.Secondary },
      ],
    });
    currentRightClickTool = newTool;
  }

  const rightClickGroupButtonConfig = [
    {
      name: "Zoom",
      icon: "search",
      action: () => switchRightClickMode("zoom"),
    },
    {
      name: "Pan",
      icon: "pan_tool",
      action: () => switchRightClickMode("pan"),
    },
  ];




  // add tools globally to cornerstone
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(CrosshairsTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);

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

  switchLeftClickMode("selection"); //default
  switchRightClickMode("zoom");

  return (
    <div id="tools-panel">
      <MaterialButtonSet buttonConfig={functionGroupButtonConfig} initialActiveButton="Mask" />
      <MaterialButtonSet buttonConfig={leftClickGroupButtonConfig} initialActiveButton="Selection" />
      <MaterialButtonSet buttonConfig={rightClickGroupButtonConfig} initialActiveButton="Pan" />
      <div className="preset-dropdown-container">
        <label htmlFor="preset-select">Preset:</label>
        <select
          id="preset-select"
          value={selectedPreset}
          onChange={handlePresetChange}
          className="preset-select"
        >
          {presets.map(preset => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ToolsPanel;
