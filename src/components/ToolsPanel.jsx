import React, { useState, useContext } from 'react';
import { Context } from './Context.js';
import NavigationPanel from './NavigationPanel';

function ToolsPanel() {
    const {
        defaults,
        layout, setLayout,
        leftPanelVisible, setLeftPanelVisible,
        toolsPanelVisible, setToolsPanelVisible,
        filesPanelVisible, setFilesPanelVisible,
        rightPanelVisible, setRightPanelVisible,
        navigationPanelVisible, setNavigationPanelVisible,
        searchPanelVisible, setSearchPanelVisible,
        maskerPanelVisible, setMaskerPanelVisible,
        reviewPanelVisible, setReviewPanelVisible,
        viewToolGroupVisible, setViewToolGroupVisible,
        viewToolGroupValue, setViewToolGroupValue,
        viewToolVolumeVisible, setViewToolVolumeVisible,
        viewToolProjectionVisible, setViewToolProjectionVisible,
        functionToolGroupVisible, setFunctionToolGroupVisible,
        functionToolGroupValue, setFunctionToolGroupValue,
        functionToolMaskVisible, setFunctionToolMaskVisible,
        functionToolBlackoutVisible, setFunctionToolBlackoutVisible,
        functionToolSliceRemoveVisible, setFunctionToolSliceRemoveVisible,
        formToolGroupVisible, setFormToolGroupVisible,
        formToolGroupValue, setFormToolGroupValue,
        formToolCuboidVisible, setFormToolCuboidVisible,
        formToolCylinderVisible, setFormToolCylinderVisible,
        leftClickToolGroupVisible, setLeftClickToolGroupVisible,
        leftClickToolGroupValue, setLeftClickToolGroupValue,
        leftClickToolWindowLevelVisible, setLeftClickToolWindowLevelVisible,
        leftClickToolCrossHairsVisible, setLeftClickToolCrossHairsVisible,
        leftClickToolRectangleScissorsVisible, setLeftClickToolRectangleScissorsVisible,
        rightClickToolGroupVisible, setRightClickToolGroupVisible,
        rightClickToolGroupValue, setRightClickToolGroupValue,
        rightClickToolZoomVisible, setRightClickToolZoomVisible,
        rightClickToolPanVisible, setRightClickToolPanVisible,
        opacityToolVisible, setOpacityToolVisible,
        opacityToolMin, setOpacityToolMin,
        opacityToolMax, setOpacityToolMax,
        opacityToolStep, setOpacityToolStep,
        opacityToolValue, setOpacityToolValue,
        presetToolVisible, setPresetToolVisible,
        presetToolList, setPresetToolList,
        presetToolValue, setPresetToolValue,
        resetViewportsVisible, setResetViewportsVisible,
        resetViewportsValue, setResetViewportsValue,
    } = useContext(Context);

    
    const handleOpacityChange = (event) => {
        const newOpacity = parseFloat(event.target.value);
        setOpacityToolValue(newOpacity);
    };

    const handlePresetChange = (event) => {
        const newPreset = event.target.value;
        setPresetToolValue(newPreset);
    };

    function handleOnNext() {
        alert("Not yet implemented :(");
    }
    function handleOnPrevious() {
        alert("Not yet implemented :(");
    }

    return (
        <div id="toolsPanel" className="overflow-y-auto no-scrollbars p-6 rounded-lg bg-blue-100 dark:bg-blue-900">
            {/*<div className="mb-2 font-semib  old">Tools</div>*/}
            <ul className=" h-full pb-4">

                {/*Navigation Panel*/}
                {
                    navigationPanelVisible &&
                    <NavigationPanel
                        onNext={handleOnNext}
                        onPrevious={handleOnPrevious}
                    />
                }

                {/*View Group*/}
                {
                    viewToolGroupVisible && (
                        <>
                            <label>View:</label>
                            {
                                viewToolVolumeVisible &&
                                <li className="pt-1 dark:bg-opacity-5  rounded-lg">
                                    <button 
                                        title="Volume"
                                        onClick={() => setViewToolGroupValue("volume")}
                                        className={`w-full ${viewToolGroupValue === "volume" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        Volume
                                    </button>
                                </li>
                            }
                            {
                                viewToolProjectionVisible &&
                                <li className=" pt-2 mb-4 dark:bg-opacity-5  rounded-lg">
                                    <button 
                                        title="Projection"
                                        onClick={() => setViewToolGroupValue("projection")} 
                                        className={`w-full ${viewToolGroupValue === "projection" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        Projection
                                    </button>
                                </li>
                            }
                        </>
                    )
                }

                {/*Function Group*/}
                {
                    functionToolGroupVisible && (
                        <>
                            <label>Function:</label>
                            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
                                {
                                    functionToolMaskVisible &&
                                    <button
                                        title="Mask"
                                        onClick={() => setFunctionToolGroupValue("mask")} 
                                        className={`w-full ${functionToolGroupValue === "mask" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>domino_mask</span>
                                    </button>
                                }
                                {
                                    functionToolBlackoutVisible &&
                                    <button
                                        title="Blackout"
                                        onClick={() => setFunctionToolGroupValue("blackout")} 
                                        className={`w-full ${functionToolGroupValue === "blackout" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>imagesearch_roller</span>
                                    </button>
                                }
                                {
                                    functionToolSliceRemoveVisible &&
                                    <button
                                        title="Slice Removal"
                                        onClick={() => setFunctionToolGroupValue("sliceremove")} 
                                        className={`w-full ${functionToolGroupValue === "sliceremove" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>content_cut</span>
                                    </button>
                                }
                            </li>
                        </>
                    )
                }

                {/*Form Group*/}
                {
                    formToolGroupVisible && (
                        <>
                            <label>Form:</label>
                            <li className="pt-1 pb-4 dark:bg-opacity-5 rounded-lg flex space-x-2">
                                {
                                    formToolCuboidVisible &&
                                    <button
                                        title="Cuboid"
                                        onClick={() => setFormToolGroupValue("cuboid")}
                                        className={`w-full ${formToolGroupValue === "cuboid" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>square</span>
                                    </button>
                                }
                                {
                                    formToolCylinderVisible &&
                                    <button
                                        title="Cylinder"
                                        onClick={() => setFormToolGroupValue("cylinder")}
                                        className={`w-full ${formToolGroupValue === "cylinder" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        <span className='material-symbols-rounded'>circle</span>
                                    </button>
                                }
                            </li>
                        </>
                    )
                }

                {/*Left-Click Group*/}
                {
                    leftClickToolGroupVisible && (
                        <>
                            <label>Left-Click:</label>
                            {
                                leftClickToolWindowLevelVisible &&
                                <li className="pb-1 pt-1 rounded-lg">
                                    <button 
                                        title="Window Level"
                                        onClick={() => setLeftClickToolGroupValue("windowlevel")} 
                                        className={`w-full ${leftClickToolGroupValue === "windowlevel" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        Window Level
                                    </button>
                                </li>
                            }
                            {
                                leftClickToolCrossHairsVisible &&
                                <li className="pb-1 pt-1 rounded-lg">
                                    <button 
                                        title="CrossHairs"
                                        onClick={() => setLeftClickToolGroupValue("crosshairs")} 
                                        className={`w-full ${leftClickToolGroupValue === "crosshairs" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        Crosshairs
                                    </button>
                                </li>
                            }
                            {
                                leftClickToolRectangleScissorsVisible &&
                                <li className="mb-1 pt-1 rounded-lg">
                                    <button 
                                        title="Selection"
                                        onClick={() => setLeftClickToolGroupValue("selection")} 
                                        className={`w-full ${leftClickToolGroupValue === "selection" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}>
                                        Selection
                                    </button>
                                </li>
                            }
                        </>
                    )
                }

                {/*Right-Click Group*/}
                {
                    rightClickToolGroupVisible && (
                        <>
                            <div className="h-2"></div>
                            <label>Right-Click:</label>
                            {
                                rightClickToolZoomVisible &&
                                <li className="pb-1 pt-1 rounded-lg">
                                    <button
                                        onClick={() => setRightClickToolGroupValue("zoom")} 
                                        className={`w-full ${rightClickToolGroupValue === "zoom" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}
                                        title='Zoom'>
                                        <span className="material-symbols-rounded">
                                            search
                                        </span>
                                    </button>
                                </li>
                            }
                            {
                                rightClickToolPanVisible &&
                                <li className="pb-1 pt-1 rounded-lg">
                                    <button
                                        onClick={() => setRightClickToolGroupValue("pan")} 
                                        className={`w-full ${rightClickToolGroupValue === "pan" ? 'text-white bg-blue-500' : 'bg-white dark:bg-slate-900'}`}
                                        title='Pan'>
                                        <span className="material-symbols-rounded">
                                            pan_tool
                                        </span>
                                    </button>
                                </li>
                            }
                        </>
                    )
                }

                {/*Opacity*/}
                {
                    opacityToolVisible &&
                    <li className="pt-2 dark:bg-opacity-5 rounded-lg">
                        <label>Opacity:</label>
                        <input
                            className='w-full cursor-pointer'
                            type="range"
                            min={opacityToolMin}
                            max={opacityToolMax}
                            step={opacityToolStep}
                            value={opacityToolValue}
                            onChange={handleOpacityChange}
                        />
                        <span>{opacityToolValue}</span>
                    </li>
                }

                {/*Preset*/}
                {
                    presetToolVisible &&
                    <li className="pb-2 pt-2 rounded-lg">
                        <label>Preset:</label>
                        <select
                            value={presetToolValue} 
                            onChange={handlePresetChange} 
                            className="w-full cursor-pointer text-black dark:text-white border border-gray-300 dark:bg-slate-800 rounded-lg p-2 mt-1">
                            {presetToolList.map((preset) => (<option key={preset} value={preset}>{preset}</option>))}
                        </select>
                    </li>
                }

                {/*Reset Viewports*/}
                {
                    resetViewportsVisible &&
                    <li className="mb-2 pb-2 pt-4 rounded-lg">
                        <button 
                            onClick={() => setResetViewportsValue(true)}
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
