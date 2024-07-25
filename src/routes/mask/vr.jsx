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
  const [layout, setLayout] = useState('MaskerVR');
  const [zoom, setZoom] = useState(250);
  const [opacity, setOpacity] = useState(0.3);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('CT-MIP');
  const [windowLevel, setWindowLevel] = useState(true);
  const [crosshairs, setCrosshairs] = useState(false);
  const [rectangleScissors, setRectangleScissors] = useState(false);
  const [viewportNavigation, setViewportNavigation] = useState("Zoom");
  const [resetViewports, setResetViewports] = useState(false);
  const [leftPanelVisibility, setLeftPanelVisibility] = useState(true);
  const [rightPanelVisibility, setRightPanelVisibility] = useState(true);
  const [view, setView] = useState("Volume");

  // Here we just assemble the various panels that we need for this mode
  return (
    <Context.Provider value={{
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
