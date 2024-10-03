import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import Masker from '../../components/Masker.jsx';


import { getDetails, getIECsForVR } from '../../masking.js';

import { Context } from '../../components/Context';

export async function loader({ params }) {

    const iecs = await getIECsForVR(params.visual_review_instance_id);

    return { iecs };

}

export default function MaskVR() {
    const { iecs } = useLoaderData();

    // default values for this route/mode

    const defaults = {
        layout: 'MaskerVR',

        // panels
        // ----------------------------------

        leftPanelVisible: true,
        toolsPanelVisible: true,
        filesPanelVisible: false,
        rightPanelVisible: false,
        descriptionPanelVisible: true,
        navigationPanelVisible: true,
        searchPanelVisible: false,
        maskerPanelVisible: true,
        reviewPanelVisible: false,

        // tools
        // ----------------------------------

        // view
        viewToolGroupVisible: true,
        viewToolGroupValue: 'volume',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        // function
        functionToolGroupVisible: true,
        functionToolGroupValue: 'mask',
        functionToolMaskVisible: true,
        functionToolBlackoutVisible: true,
        functionToolSliceRemoveVisible: true,

        // form
        formToolGroupVisible: true,
        formToolGroupValue: 'cylinder',
        formToolCuboidVisible: true,
        formToolCylinderVisible: true,

        // left click
        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'selection', // windowlevel, crosshairs, or selection
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,
        leftClickToolRectangleScissorsVisible: true,

        // right click
        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        // opacity
        opacityToolVisible: true,
        opacityToolMin: 0,
        opacityToolMax: 1,
        opacityToolStep: 0.01,
        opacityToolValue: 0.3,

        // presets
        presetToolVisible: true,
        presetToolList: [],
        presetToolValue: 'CT-MIP',

        // reset viewports
        resetViewportsVisible: true,
        resetViewportsValue: false,
    };

    const [layout, setLayout] = useState(defaults.layout);
    const [zoom, setZoom] = useState(defaults.zoom);
    const [leftPanelVisible, setLeftPanelVisible] = useState(defaults.leftPanelVisible);
    const [toolsPanelVisible, setToolsPanelVisible] = useState(defaults.toolsPanelVisible);
    const [filesPanelVisible, setFilesPanelVisible] = useState(defaults.filesPanelVisible);
    const [rightPanelVisible, setRightPanelVisible] = useState(defaults.rightPanelVisible);
    const [descriptionPanelVisible, setDescriptionPanelVisible] = useState(defaults.descriptionPanelVisible);
    const [navigationPanelVisible, setNavigationPanelVisible] = useState(defaults.navigationPanelVisible);
    const [searchPanelVisible, setSearchPanelVisible] = useState(defaults.searchPanelVisible);
    const [maskerPanelVisible, setMaskerPanelVisible] = useState(defaults.maskerPanelVisible);
    const [reviewPanelVisible, setReviewPanelVisible] = useState(defaults.reviewPanelVisible);
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
            descriptionPanelVisible, setDescriptionPanelVisible,

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

        }}>
            <Masker iecs={iecs} />
        </Context.Provider>
    );
}
