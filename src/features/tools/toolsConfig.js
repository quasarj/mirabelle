import { useSelector, useDispatch } from 'react-redux';
import { setStateValue, Enums } from '@/features/presentationSlice'

const maybe = (condition, item) => condition ? [item]: [];

export default function useToolsConfigs({ manager }) {
  const dispatch = useDispatch();
  const globalToolsConfig = useSelector(state => state.presentation.toolsConfig);

  const viewGroupButtonConfig = [
    ...maybe(globalToolsConfig.viewToolGroup.visibility.volume, {
      name: "Volume",
      icon: "deployed_code",
      action: () => dispatch(setStateValue(
        {
          path: "view",
          value: Enums.ViewOptions.VOLUME,
        }
      )),
    }),
    ...maybe(globalToolsConfig.viewToolGroup.visibility.projection, {
      name: "Maximum Intensity Projection",
      icon: "light_mode",
      action: () => dispatch(setStateValue(
        {
          path: "view",
          value: Enums.ViewOptions.PROJECTION,
        }
      )),
    }),
    ...maybe(globalToolsConfig.viewToolGroup.visibility.stack, {
      name: "Stack",
      icon: "stacks",
      action: () => dispatch(setStateValue(
        {
          path: "view",
          value: Enums.ViewOptions.STACK,
        }
      )),
    }),
  ];


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

  const formGroupButtonConfig = [
    {
      name: "Cylinder",
      icon: "circle",
      action: () => manager.switchFormMode("cylinder"),
    },
    {
      name: "Cuboid",
      icon: "square",
      action: () => manager.switchFormMode("cuboid"),
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
    formGroupButtonConfig,
    leftClickGroupButtonConfig,
    rightClickGroupButtonConfig,
    viewGroupButtonConfig,
  };
}
