import React, { useState } from 'react';
import { Context } from './Context';

export default function ContextProvider({ children, initialLayout = '' }) {
    const [layout, setlayout] = useState(initialLayout);
    const [zoom, setZoom] = useState(250);
    const [opacity, setOpacity] = useState(0.3);
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState('CT-MIP');
    const [windowLevel, setWindowLevel] = useState(true);
    const [crosshairs, setCrosshairs] = useState(false);
    const [rectangleScissors, setRectangleScissors] = useState(false);
    const [resetViewports, setResetViewports] = useState(false);

    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);

    return (
        <Context.Provider value={{ layout, setlayout, zoom, setZoom, opacity, setOpacity, presets, setPresets, selectedPreset, setSelectedPreset, windowLevel, setWindowLevel, crosshairs, setCrosshairs, rectangleScissors, setRectangleScissors, resetViewports, setResetViewports, leftPanelVisible, setLeftPanelVisible, rightPanelVisible, setRightPanelVisible }}>
            {children}
        </Context.Provider>
    );
}
