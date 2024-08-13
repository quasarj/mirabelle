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
  const defaultLayout = 'MaskerVR';
  const defaultZoom = 250;
  const defaultOpacity = 0.3;
  const defaultPresets = [];
  const defaultSelectedPreset = 'CT-MIP';
  const defaultWindowLevel = true;
  const defaultCrosshairs = false;
  const defaultRectangleScissors = false;
  const defaultViewportNavigation = "Zoom";
  const defaultResetViewports = false;
  const defaultLeftPanelVisibility = true;
  const defaultRightPanelVisibility = true;
  const defaultView = 'All';

  const [layout, setLayout] = useState(defaultLayout);
  const [zoom, setZoom] = useState(defaultZoom);
  const [opacity, setOpacity] = useState(defaultOpacity);
  const [presets, setPresets] = useState(defaultPresets);
  const [selectedPreset, setSelectedPreset] = useState(defaultSelectedPreset);
  const [windowLevel, setWindowLevel] = useState(defaultWindowLevel);
  const [crosshairs, setCrosshairs] = useState(defaultCrosshairs);
  const [rectangleScissors, setRectangleScissors] = useState(defaultRectangleScissors);
  const [viewportNavigation, setViewportNavigation] = useState(defaultViewportNavigation);
  const [resetViewports, setResetViewports] = useState(defaultResetViewports);
  const [leftPanelVisibility, setLeftPanelVisibility] = useState(defaultLeftPanelVisibility);
  const [rightPanelVisibility, setRightPanelVisibility] = useState(defaultRightPanelVisibility);
  const [view, setView] = useState(defaultView);

  // Here we just assemble the various panels that we need for this mode
  return (
    <Context.Provider value={{

        defaultLayout,
        defaultZoom,
        defaultOpacity,
        defaultPresets,
        defaultSelectedPreset,
        defaultWindowLevel,
        defaultCrosshairs,
        defaultRectangleScissors,
        defaultViewportNavigation,
        defaultResetViewports,
        defaultLeftPanelVisibility,
        defaultRightPanelVisibility,
        defaultView,

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
        
    }}>
        <Masker iecs={iecs} />
    </Context.Provider>
  );
}
