import React, { useState } from 'react';
import { Context } from './Context';

export default function ContextProvider({ children, initialLayout = ''}) {
  const [layout, setlayout] = useState(initialLayout);
  const [zoom, setZoom] = useState(250);
  const [opacity, setOpacity] = useState(0.3);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('CT-Bone');
  const [crosshairs, setCrosshairs] = useState(true);
  const [rectangleScissors, setRectangleScissors] = useState(false);

  const [leftPanelVisibility, setLeftPanelVisibility] = useState(true);
  const [rightPanelVisibility, setRightPanelVisibility] = useState(true);
  
  return (
    <Context.Provider value={{ layout, setlayout, zoom, setZoom, opacity, setOpacity, presets, setPresets, selectedPreset, setSelectedPreset, crosshairs, setCrosshairs, rectangleScissors, setRectangleScissors, leftPanelVisibility, setLeftPanelVisibility, rightPanelVisibility, setRightPanelVisibility }}>
      {children}
    </Context.Provider>
  );
}