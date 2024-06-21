import React, { useState } from 'react';
import { Context } from './Context';

export default function ContextProvider({ children }) {
  const [template, setTemplate] = useState('MaskerVR');
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('CT-Bone');
  
  return (
    <Context.Provider value={{ template, setTemplate, presets, setPresets, selectedPreset, setSelectedPreset }}>
      {children}
    </Context.Provider>
  );
}