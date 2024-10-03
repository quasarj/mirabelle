import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import VisualReview from '../../components/VisualReview.jsx';
import { Context } from '../../components/Context';

import { getUsername, getDetails } from '../../nifti.js';

export async function loader({ params }) {
    // console.log("loader params=", params);
    const details = await getDetails(params.fileId);
    const user = await getUsername();
    const files = [params.fileId];
    return { details, files };
}

export default function ReviewNIFTI() {

    const { details, files } = useLoaderData();

    // console.log("nifti files=", files);

    // default values for this route/mode
    const defaults = {
        layout: 'NiftiReview',
        zoom: 250,
        title: 'Review NIFTI',
        fileData: details,

        // panels
        // ----------------------------------

        leftPanelVisible: true,
        toolsPanelVisible: true,
        filesPanelVisible: false,
        rightPanelVisible: true,
        descriptionPanelVisible: true,
        navigationPanelVisible: false,
        searchPanelVisible: false,
        maskerPanelVisible: false,
        reviewPanelVisible: true,

        // tools
        // ----------------------------------

        // view
        viewToolGroupVisible: true,
        viewToolGroupValue: 'projection',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        // function
        functionToolGroupVisible: false,
        functionToolGroupValue: 'mask',
        functionToolMaskVisible: false,
        functionToolBlackoutVisible: false,
        functionToolSliceRemoveVisible: false,

        // form
        formToolGroupVisible: false,
        formToolGroupValue: 'cylinder',
        formToolCuboidVisible: false,
        formToolCylinderVisible: false,

        // left click
        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel', // windowlevel, crosshairs, or selection
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,
        leftClickToolRectangleScissorsVisible: false,

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
        presetToolValue: 'MR-Default',

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

            title: defaults.title,
            fileData: defaults.fileData,

        }}>
            <VisualReview files={files} />
        </Context.Provider>
    );
}
