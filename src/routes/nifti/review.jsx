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
        opacity: 0.3,
        presets: [],
        selectedPreset: 'MR-Default',
        windowLevel: true,
        crosshairs: false,
        rectangleScissors: false,
        viewportNavigation: "Zoom",
        resetViewports: false,
        leftPanelVisible: true,
        rightPanelVisible: true,
        view: 'Projection',
        //function: 'mask',
        //form: 'cylinder',
        title: 'Review NIFTI',
        fileData: details,
    };

    const [layout, setLayout] = useState(defaults.layout);
    const [zoom, setZoom] = useState(defaults.zoom);
    const [opacity, setOpacity] = useState(defaults.opacity);
    const [presets, setPresets] = useState(defaults.presets);
    const [selectedPreset, setSelectedPreset] = useState(defaults.selectedPreset);
    const [windowLevel, setWindowLevel] = useState(defaults.windowLevel);
    const [crosshairs, setCrosshairs] = useState(defaults.crosshairs);
    const [rectangleScissors, setRectangleScissors] = useState(defaults.rectangleScissors);
    const [viewportNavigation, setViewportNavigation] = useState(defaults.viewportNavigation);
    const [resetViewports, setResetViewports] = useState(defaults.resetViewports);
    const [leftPanelVisibility, setLeftPanelVisibility] = useState(defaults.leftPanelVisible);
    const [rightPanelVisibility, setRightPanelVisibility] = useState(defaults.rightPanelVisible);
    const [view, setView] = useState(defaults.view);
    const [maskFunction, setMaskFunction] = useState(defaults.function);
    const [maskForm, setMaskForm] = useState(defaults.form);

    // Here we just assemble the various panels that we need for this mode
    return (
        <Context.Provider value={{

            defaults,
            layout, setLayout,
            zoom, setZoom,
            opacity, setOpacity,
            presets, setPresets,
            selectedPreset, setSelectedPreset,
            leftPanelVisibility, setLeftPanelVisibility,
            rightPanelVisibility, setRightPanelVisibility,
            windowLevel, setWindowLevel,
            crosshairs, setCrosshairs,
            rectangleScissors, setRectangleScissors,
            viewportNavigation, setViewportNavigation,
            resetViewports, setResetViewports,
            view, setView,
            maskFunction, setMaskFunction,
            maskForm, setMaskForm,
            title: defaults.title,
            fileData: defaults.fileData,

        }}>
            <VisualReview files={files} />
        </Context.Provider>
    );
}
