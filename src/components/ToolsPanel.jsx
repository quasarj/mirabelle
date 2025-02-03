import React, { useState, useContext } from 'react';
import { Context } from './Context.js';
// import NavigationPanel from './NavigationPanel';
import MaterialButtonSet from './MaterialButtonSet';

function ToolsPanel() {

    const context = useContext(Context);
    
    const handleOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        context.setOpacityToolValue(newOpacity);
    };

    const handlePresetChange = (event) => {
        const newPreset = event.target.value;
        context.setPresetToolValue(newPreset);
    };

    function handleOnNext() {
        alert("Not yet implemented :(");
    }
    function handleOnPrevious() {
        alert("Not yet implemented :(");
    }

    // --------------------------------------------------------------------- //
    //  View group button config and handlers
    // --------------------------------------------------------------------- //
    function switchViewMode(mode) {
        // TODO actually update the tool group settings or make other
        // calls as necessary (may actually need to update context here)
        console.log("switch to view mode: ", mode);
    }

    // TODO somehow work these in, might have to build the config
    // item-by-item, not sure of a clever way to do it
    //
    // context.viewToolVolumeVisible &&
    // context.viewToolProjectionVisible &&
    // context.viewToolStackVisible &&

    const viewGroupButtonConfig = [
		{
			name: "Volume",
			icon: "deployed_code",
			action: () => switchViewMode("volume"),
		},
		{
			name: "Maximum Intensity Projection (MIP)",
			icon: "light_mode",
			action: () => switchViewMode("mip"),
		},
		{
			name: "Stack",
			icon: "stacks",
			action: () => switchViewMode("stack"),
		},

    ];

    // --------------------------------------------------------------------- //
    //  Function group button config and handlers
    // --------------------------------------------------------------------- //
    function switchFunctionMode(mode) {
        // TODO actually update the tool group settings or make other
        // calls as necessary (may actually need to update context here)
        console.log("switch to function mode: ", mode);
    }

    // TODO somehow work these in, might have to build the config
    // item-by-item, not sure of a clever way to do it
    //
        // context.functionToolMaskVisible &&
        // context.functionToolBlackoutVisible &&
        // context.functionToolSliceRemoveVisible &&

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

    return (
      <div id="toolsPanel" className="overflow-y-auto no-scrollbars p-6 rounded-lg bg-blue-100 dark:bg-blue-900">
        <ul className=" h-full pb-4">

      {/*View Group*/}
      {
        context.viewToolGroupVisible && (
          <>
            View:
            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
              <MaterialButtonSet buttonConfig={viewGroupButtonConfig} initialActiveButton="Volume" />
            </li>
          </>
        )
      }

      {/*Function Group*/}
      {
        context.functionToolGroupVisible && (
          <>
            Function:
            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
              <MaterialButtonSet buttonConfig={functionGroupButtonConfig} initialActiveButton="Mask" />
            </li>
          </>
        )
      }

                {/*Form Group*/}
                {
                    context.formToolGroupVisible && (
                        <>
                            Form:
                            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
                                {
                                    context.formToolCuboidVisible &&
                                    <button
                                        title="Cuboid"
                                        onClick={() => context.setFormToolGroupValue("cuboid")}
                                        className={`w-full ${context.formToolGroupValue === "cuboid" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>square</span>
                                    </button>
                                }
                                {
                                    context.formToolCylinderVisible &&
                                    <button
                                        title="Cylinder"
                                        onClick={() => context.setFormToolGroupValue("cylinder")}
                                        className={`w-full ${context.formToolGroupValue === "cylinder" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>circle</span>
                                    </button>
                                }
                            </li>
                        </>
                    )
                }

                {/*Left-Click Group*/}
                {
                    context.leftClickToolGroupVisible && (
                        <>
                            Left-Click:
                            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
                            {
                                context.leftClickToolWindowLevelVisible &&
                                <button 
                                    title="Window Level"
                                    onClick={() => context.setLeftClickToolGroupValue("windowlevel")} 
                                    className={`w-full ${context.leftClickToolGroupValue === "windowlevel" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                    <span className="material-symbols-rounded">exposure</span>
                                </button>
                            }
                            {
                                context.leftClickToolCrossHairsVisible &&
                                <button 
                                    title="Crosshairs"
                                    onClick={() => context.setLeftClickToolGroupValue("crosshairs")} 
                                    className={`w-full ${context.leftClickToolGroupValue === "crosshairs" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                    <span className="material-symbols-rounded">point_scan</span>
                                </button>
                            }
                            {
                                context.leftClickToolRectangleScissorsVisible &&
                                <button 
                                    title="Selection"
                                    onClick={() => context.setLeftClickToolGroupValue("selection")} 
                                    className={`w-full ${context.leftClickToolGroupValue === "selection" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                    <span className="material-symbols-rounded">gesture_select</span>
                                </button>
                            }
                            </li>
                        </>
                    )
                }

                {/*Right-Click Group*/}
                {
                    context.rightClickToolGroupVisible && (
                        <>                            
                            Right-Click:
                            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
                                {
                                    context.rightClickToolZoomVisible &&
                                    <button
                                        onClick={() => context.setRightClickToolGroupValue("zoom")} 
                                        className={`w-full ${context.rightClickToolGroupValue === "zoom" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}
                                        title='Zoom'>
                                        <span className="material-symbols-rounded">search</span>
                                    </button>
                                }
                                {
                                    context.rightClickToolPanVisible &&
                                    <button
                                        onClick={() => context.setRightClickToolGroupValue("pan")} 
                                        className={`w-full ${context.rightClickToolGroupValue === "pan" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}
                                        title='Pan'>
                                        <span className="material-symbols-rounded">pan_tool</span>
                                    </button>
                                }
                            </li>
                        </>
                    )
                }

                {/*Opacity*/}
                {
                    context.opacityToolVisible &&
                    <li className="pt-2 dark:bg-opacity-5 rounded-lg">
                        Opacity:
                        <input
                            className='w-full cursor-pointer'
                            type="range"
                            min={context.opacityToolMin}
                            max={context.opacityToolMax}
                            step={context.opacityToolStep}
                            value={context.opacityToolValue}
                            onChange={handleOpacityChange}
                        />
                        <span>{context.opacityToolValue}</span>
                    </li>
                }

                {/*Preset*/}
                {
                    context.presetToolVisible &&
                    <li className="pb-2 pt-2 rounded-lg">
                        Preset:
                            <select
                            name="preset"
                            value={context.presetToolValue} 
                            onChange={handlePresetChange} 
                            className="w-full cursor-pointer text-black dark:text-white border border-gray-300 dark:bg-slate-800 rounded-lg p-2 mt-1">
                            {context.presetToolList.map((preset) => (<option key={preset} value={preset}>{preset}</option>))}
                        </select>
                    </li>
                }

                {/*Reset Viewports*/}
                {
                    context.resetViewportsVisible &&
                    <li className="mb-2 pb-2 pt-4 rounded-lg">
                        <button 
                            onClick={() => context.setResetViewportsValue(true)}
                            className="w-full text-white bg-red-600"
                            title='Reset Viewports'>
                            <span className="material-symbols-rounded">
                                refresh
                            </span>
                        </button>
                    </li>
                }
            </ul>
        </div>
    );
}

export default ToolsPanel;
