import React, { useState } from 'react';
import { Context } from './Context';

export default function ContextProvider({ children }) {
  const [template, setTemplate] = useState('MaskerVR');
  const [zoom, setZoom] = useState(250);
  const [opacity, setOpacity] = useState(0.3);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('CT-Bone');
  const [leftPanelVisibility, setLeftPanelVisibility] = useState(true);
  const [rightPanelVisibility, setRightPanelVisibility] = useState(true);
  
  return (
    <Context.Provider value={{ template, setTemplate, zoom, setZoom, opacity, setOpacity, presets, setPresets, selectedPreset, setSelectedPreset, leftPanelVisibility, setLeftPanelVisibility, rightPanelVisibility, setRightPanelVisibility }}>
      {children}
    </Context.Provider>
  );
}