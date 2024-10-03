import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';
import { Context } from '../../components/Context';

import { getDetails, getFiles } from '../../masking.js';

// function to load data for this component
// will be called by the Router before rendering
export async function loader({ params }) {

    const details = await getDetails(params.iec);
    const files = await getFiles(params.iec);

    return { details, files, iec: params.iec };
}

export default function MaskIEC() {
    const { details, files, iec } = useLoaderData();

    // default values for this route/mode
    const defaults = {
        layout: 'Masker',
        zoom: 250,

        // panels
        // ----------------------------------

        leftPanelVisible: true,
        toolsPanelVisible: true,
        filesPanelVisible: false,
        rightPanelVisible: false,
        navigationPanelVisible: false,
        searchPanelVisible: false,
        maskerPanelVisible: true,
        markPanelVisible: false,

        // tools
        // ----------------------------------

        // view
        //view: 'Volume',
        viewToolGroupVisible: true,
        viewToolGroupValue: 'Volume',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        // function
        //function: 'mask',
        functionToolGroupVisible: true,
        functionToolGroupValue: 'mask',
        functionToolMaskVisible: true,
        functionToolBlackoutVisible: true,
        functionToolSliceRemoveVisible: true,

        // form
        //form: 'cylinder',
        formToolGroupVisible: true,
        formToolGroupValue: 'cylinder',
        formToolCuboidVisible: true,
        formToolCylinderVisible: true,

        // left click
        //windowLevel: false,
        //crosshairs: false,
        //rectangleScissors: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'Selection',
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,
        leftClickToolRectangleScissorsVisible: true,

        // right click
        //viewportNavigation: 'Zoom',
        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'Zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        // opacity
        //opacity: 0.3,
        opacityToolVisible: true,
        opacityToolMin:0,
        opacityToolMax:1,
        opacityToolStep:0.01,
        opacityToolValue: 0.3,

        // presets
        //presets: [],
        //selectedPreset: 'CT-MIP',
        presetToolVisible: true,
        presetToolList: [],
        presetToolValue: 'CT-MIP',


        //resetViewports: false,
        resetViewportsVisible: true,
        resetViewportsValue: false,

        // viewports
        //stackv
    };

    const [layout, setLayout] = useState(defaults.layout);
    const [zoom, setZoom] = useState(defaults.zoom);
    const [leftPanelVisible, setLeftPanelVisible] = useState(defaults.leftPanelVisible);
    const [toolsPanelVisible, setToolsPanelVisible] = useState(defaults.toolsPanelVisible);
    const [filesPanelVisible, setFilesPanelVisible] = useState(defaults.filesPanelVisible);
    const [rightPanelVisible, setRightPanelVisible] = useState(defaults.rightPanelVisible);
    const [navigationPanelVisible, setNavigationPanelVisible] = useState(defaults.navigationPanelVisible);
    const [searchPanelVisible, setSearchPanelVisible] = useState(defaults.searchPanelVisible);
    const [maskerPanelVisible, setMaskerPanelVisible] = useState(defaults.maskerPanelVisible);
    const [markPanelVisible, setMarkPanelVisible] = useState(defaults.markPanelVisible);
    const [viewToolGroupVisible, setViewToolGroupVisible] = useState(defaults.viewToolGroupVisible);
    const [viewToolGroupValue, setViewToolGroupValue] = useState(defaults.viewToolGroupValue);
    const [viewToolVolumeVisible, setViewToolVolumeVisible] = useState(defaults.viewToolVolumeVisible);
    const [viewToolProjectionVisible, setViewToolProjectionVisible] = useState(defaults.viewToolProjectionVisible);
    const [functionToolGroupVisible, setFunctionToolGroupVisible] = useState(defaults.functionToolGroupVisible);
    const [functionToolGroupValue, setFunctionToolGroupValue] = useState(defaults.functionToolGroupValue);
    const [functionToolMaskVisible, setFunctionToolMaskVisible] = useState(defaults.functionToolMaskVisible);
    const [functionToolBlackoutVisible, setFunctionToolBlackoutVisible] = useState(defaults.functionToolBlackoutVisible);
    const [functionToolSliceRemoveVisible, setFunctionToolSliceRemoveVisible] = useState(defaults.functionToolSliceRemoveVisible);
    const [formToolGroupVisible, setFormToolGroupVisible] = useState(defaults.formToolGroupVisible);
    const [formToolGroupValue, setFormToolGroupValue] = useState(defaults.formToolGroupValue);
    const [formToolCuboidVisible, setFormToolCuboidVisible] = useState(defaults.formToolCuboidVisible);
    const [formToolCylinderVisible, setFormToolCylinderVisible] = useState(defaults.formToolCylinderVisible);
    const [leftClickToolGroupVisible, setLeftClickToolGroupVisible] = useState(defaults.leftClickToolGroupVisible);
    const [leftClickToolGroupValue, setLeftClickToolGroupValue] = useState(defaults.leftClickToolGroupValue);
    const [leftClickToolWindowLevelVisible, setLeftClickToolWindowLevelVisible] = useState(defaults.leftClickToolWindowLevelVisible);
    const [leftClickToolCrossHairsVisible, setLeftClickToolCrossHairsVisible] = useState(defaults.leftClickToolCrossHairsVisible);
    const [leftClickToolRectangleScissorsVisible, setLeftClickToolRectangleScissorsVisible] = useState(defaults.leftClickToolRectangleScissorsVisible);
    const [rightClickToolGroupVisible, setRightClickToolGroupVisible] = useState(defaults.rightClickToolGroupVisible);
    const [rightClickToolGroupValue, setRightClickToolGroupValue] = useState(defaults.rightClickToolGroupValue);
    const [rightClickToolZoomVisible, setRightClickToolZoomVisible] = useState(defaults.rightClickToolZoomVisible);
    const [rightClickToolPanVisible, setRightClickToolPanVisible] = useState(defaults.rightClickToolPanVisible);
    const [opacityToolVisible, setOpacityToolVisible] = useState(defaults.opacityToolVisible);
    const [opacityToolValue, setOpacityToolValue] = useState(defaults.opacityToolValue);
    const [opacityToolMin, setOpacityToolMin] = useState(defaults.opacityToolMin);
    const [opacityToolMax, setOpacityToolMax] = useState(defaults.opacityToolMax);
    const [opacityToolStep, setOpacityToolStep] = useState(defaults.opacityToolStep);
    const [presetToolVisible, setPresetToolVisible] = useState(defaults.presetToolVisible);
    const [presetToolList, setPresetToolList] = useState(defaults.presetToolList);
    const [presetToolValue, setPresetToolValue] = useState(defaults.presetToolValue);
    const [resetViewportsVisible, setResetViewportsVisible] = useState(defaults.resetViewportsVisible);
    const [resetViewportsValue, setResetViewportsValue] = useState(defaults.resetViewportsValue);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{

            defaults,

            layout, setLayout,
            zoom, setZoom,

            leftPanelVisible, setLeftPanelVisible,
            toolsPanelVisible, setToolsPanelVisible,
            filesPanelVisible, setFilesPanelVisible,

            rightPanelVisible, setRightPanelVisible,

            navigationPanelVisible, setNavigationPanelVisible,
            searchPanelVisible, setSearchPanelVisible,
            maskerPanelVisible, setMaskerPanelVisible,
            markPanelVisible, setMarkPanelVisible,

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

        }}>
            <Masker files={files} iec={iec} />
        </Context.Provider>
    );
}
