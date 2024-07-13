import React, { useState, useContext } from 'react';
import { Context } from './Context.js';


function ToolsPanel() {
  const { zoom, setZoom, opacity, setOpacity, presets, selectedPreset, setSelectedPreset, crosshairs, setCrosshairs, rectangleScissors, setRectangleScissors} = useContext(Context);

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

  const handleToggleCrosshairsButtonClick = () => {
    setCrosshairs(!crosshairs);
  };

  const handleToggleRectangleScissorsButtonClick = () => {
    setRectangleScissors(!rectangleScissors);
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
        <li className="mb-2 pb-2 pt-2 rounded-lg">
          <label>Crosshairs:</label>
          <button onClick={handleToggleCrosshairsButtonClick} className="w-full">
            Toggle Crosshairs
          </button>
        </li>
        <li className="mb-2 pb-2 pt-2 rounded-lg">
          <label>Selection:</label>
          <button onClick={handleToggleRectangleScissorsButtonClick} className="w-full">
            Toggle Selection
          </button>
        </li>
        {/*<hr className='mb-2'/>*/}
        <li className="mb-2 pb-2 pt-2 rounded-lg">
          
          <button className="w-full bg-red-600">
            Reset Everything
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ToolsPanel;
