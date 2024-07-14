import React, { useState, useContext } from 'react';
import { Context } from './Context.js';


function ToolsPanel() {
  const { zoom, setZoom, opacity, setOpacity, presets, selectedPreset, setSelectedPreset, windowLevel, setWindowLevel, crosshairs, setCrosshairs, rectangleScissors, setRectangleScissors, resetViewports, setResetViewports} = useContext(Context);

  const handleZoomChange = (event) => {
    const newZoom = event.target.value;
    setZoom(newZoom);
  };

  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
  };

  const handlePresetChange = (event) => {
    const newPreset = event.target.value;
    setSelectedPreset(newPreset);
  };

  const handleWindowLevelButtonClick = () => {
    setWindowLevel(true);
    setCrosshairs(false);
    setRectangleScissors(false);
  };

  const handleCrosshairsButtonClick = () => {
    setWindowLevel(false);
    setCrosshairs(true);
    setRectangleScissors(false);
  };

  const handleRectangleScissorsButtonClick = () => {
    setWindowLevel(false);
    setCrosshairs(false);
    setRectangleScissors(true);
  };

  const handleResetViewportsButtonClick = () => {
    setZoom(250);
    setOpacity(0.3);
    setSelectedPreset('CT-Bone');
    setWindowLevel(true);
    setCrosshairs(false);
    setRectangleScissors(false);
    setResetViewports(true);
  };

  return (
    <div id="toolsPanel" className="overflow-hidden p-6 rounded-lg bg-blue-100 dark:bg-blue-900">
      <div className="mb-2 font-semibold">Tools</div>
      <ul className="overflow-y-scroll h-full pb-4">
        <li className="mb-2 pb-2 pt-2 dark:bg-opacity-5  rounded-lg">
          <label>Zoom:</label>
          <input
            className='w-full cursor-pointer'
            type="range"
            min="1"
            max="250"
            step="1"
            value={zoom}
            onChange={handleZoomChange}
          />
          <span>{zoom}</span>
        </li>
        <li className="mb-2 pb-2 pt-2 dark:bg-opacity-5 rounded-lg">
          <label>Opacity:</label>
          <input
            className='w-full cursor-pointer'
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
          />
          <span>{opacity}</span>
        </li>
        <li className="mb-2 pb-2 pt-2 rounded-lg">
          <label>3D Volume Preset:</label>
          <select value={selectedPreset} onChange={handlePresetChange} className="w-full cursor-pointer text-black dark:text-white border border-gray-300 dark:bg-slate-800 rounded-lg p-2">
            {presets.map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </li>

        <label>Set mode:</label>
        <li className="pb-1 pt-1 rounded-lg">
          <button onClick={handleWindowLevelButtonClick} className={`w-full ${ windowLevel ? 'bg-blue-500' : 'bg-slate-900'}`}>
            Window Level
          </button>
        </li>
        <li className="pb-1 pt-1 rounded-lg">
          <button onClick={handleCrosshairsButtonClick} className={`w-full ${ crosshairs ? 'bg-blue-500' : 'bg-slate-900'}`}>
            Crosshairs
          </button>
        </li>
        <li className="pb-1 pt-1 rounded-lg">
          <button onClick={handleRectangleScissorsButtonClick} className={`w-full ${ rectangleScissors ? 'bg-blue-500' : 'bg-slate-900'}`}>
            Scissors
          </button>
        </li>
        
        <li className="mb-2 pb-2 pt-4 rounded-lg">
          
          <button onClick={handleResetViewportsButtonClick}className="w-full bg-red-600">
            Reset Viewports
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ToolsPanel;
