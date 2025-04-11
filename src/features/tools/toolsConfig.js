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
    ...maybe(globalToolsConfig.functionToolGroup.visibility.mask, {
      name: "Mask",
      icon: "domino_mask",
      action: () => manager.switchFunctionMode("mask"),
    }),
    ...maybe(globalToolsConfig.functionToolGroup.visibility.blackout, {
      name: "Blackout",
      icon: "imagesearch_roller",
      action: () => manager.switchFunctionMode("blackout"),
    }),
    ...maybe(globalToolsConfig.functionToolGroup.visibility.mask, {
      name: "Slice Removal",
      icon: "content_cut",
      action: () => manager.switchFunctionMode("slice_removal"),
    }),
  ];

  const formGroupButtonConfig = [
    ...maybe(globalToolsConfig.formToolGroup.visibility.cylinder, {
      name: "Cylinder",
      icon: "circle",
      action: () => manager.switchFormMode("cylinder"),
    }),
    ...maybe(globalToolsConfig.formToolGroup.visibility.cuboid, {
      name: "Cuboid",
      icon: "square",
      action: () => manager.switchFormMode("cuboid"),
    }),
  ];

  const leftClickGroupButtonConfig = [
    ...maybe(globalToolsConfig.leftClickToolGroup.visibility.windowLevel, {
      name: "Window Level",
      icon: "exposure",
      action: () => manager.switchLeftClickMode("winlev"),
    }),
    ...maybe(globalToolsConfig.leftClickToolGroup.visibility.crossHairs, {
      name: "Crosshairs",
      icon: "point_scan",
      action: () => manager.switchLeftClickMode("crosshair"),
    }),
    ...maybe(globalToolsConfig.leftClickToolGroup.visibility.rectangleScissors, {
      name: "Selection",
      icon: "gesture_select",
      action: () => manager.switchLeftClickMode("selection"),
    }),
  ];

  const rightClickGroupButtonConfig = [
    ...maybe(globalToolsConfig.rightClickToolGroup.visibility.zoom, {
      name: "Zoom",
      icon: "search",
      action: () => manager.switchRightClickMode("zoom"),
    }),
    ...maybe(globalToolsConfig.rightClickToolGroup.visibility.pan, {
      name: "Pan",
      icon: "pan_tool",
      action: () => manager.switchRightClickMode("pan"),
    }),
  ];

  return {
    functionGroupButtonConfig,
    formGroupButtonConfig,
    leftClickGroupButtonConfig,
    rightClickGroupButtonConfig,
    viewGroupButtonConfig,
  };
}
