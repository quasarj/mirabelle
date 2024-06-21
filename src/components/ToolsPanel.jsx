import React, { useState, useContext } from 'react';
import { Context } from './Context.js';


function ToolsPanel({ setZoom, setOpacity }) {
  const { presets, selectedPreset, setSelectedPreset } = useContext(Context);
  
  const [zoom, setLocalZoom] = useState(1);
  const [opacity, setLocalOpacity] = useState(0.2); // Default opacity value

  const handleZoomChange = (event) => {
    const newZoom = event.target.value;
    setLocalZoom(newZoom);
    setZoom(newZoom);
  };

  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setLocalOpacity(newOpacity);
    setOpacity(newOpacity);
  };

  const handlePresetChange = (event) => {
    const newPreset = event.target.value;
    setSelectedPreset(newPreset);
  };

  return (
    <div id="toolsPanel" className="p-4 rounded-lg overflow-hidden dark:bg-blue-900">
      <div className="mb-2 font-semibold">Tools</div>
      <ul className="h-full overflow-y-scroll">
        <li className="mb-2 p-2 dark:bg-opacity-5 cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg">
          <label>Opacity at 500 intensity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
          />
          <span>{opacity}</span>
        </li>
        <li className="mb-2 p-2 cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg">
          <label>3D Volume Preset:</label>
          <select value={selectedPreset} onChange={handlePresetChange} className="w-full border border-gray-300 rounded-lg p-2">
            {presets.map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
}

export default ToolsPanel;
