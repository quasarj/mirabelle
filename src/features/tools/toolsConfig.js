export default function useToolsConfigs({ manager }) {
  const functionGroupButtonConfig = [
    {
      name: "Mask",
      icon: "domino_mask",
      action: () => manager.switchFunctionMode("mask"),
    },
    {
      name: "Blackout",
      icon: "imagesearch_roller",
      action: () => manager.switchFunctionMode("blackout"),
    },
    {
      name: "Slice Removal",
      icon: "content_cut",
      action: () => manager.switchFunctionMode("slice_removal"),
    },
  ];

  const leftClickGroupButtonConfig = [
    {
      name: "Window Level",
      icon: "exposure",
      action: () => manager.switchLeftClickMode("winlev"),
    },
    {
      name: "Crosshairs",
      icon: "point_scan",
      action: () => manager.switchLeftClickMode("crosshair"),
    },
    {
      name: "Selection",
      icon: "gesture_select",
      action: () => manager.switchLeftClickMode("selection"),
    },
  ];

  const rightClickGroupButtonConfig = [
    {
      name: "Zoom",
      icon: "search",
      action: () => manager.switchRightClickMode("zoom"),
    },
    {
      name: "Pan",
      icon: "pan_tool",
      action: () => manager.switchRightClickMode("pan"),
    },
  ];

  return {
    functionGroupButtonConfig,
    leftClickGroupButtonConfig,
    rightClickGroupButtonConfig,
  };
}
