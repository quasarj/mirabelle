import React from 'react';
import {useState} from 'react';

function ToolsPanel({ setZoom, setOpacity }) {
  const [zoom, setLocalZoom] = useState(1);

  const handleZoomChange = (event) => {
    const newZoom = event.target.value;
    setLocalZoom(newZoom);
    setZoom(newZoom);
  };

  const [opacity, setLocalOpacity] = useState(0.2); // Default opacity value

  const handleOpacityChange = (event) => {
      const newOpacity = parseFloat(event.target.value);
      setLocalOpacity(newOpacity);
      setOpacity(newOpacity);
  };

  return (
    <div id="toolsPanel" className="  p-4 rounded-lg overflow-hidden dark:bg-opacity-5 bg-gray-100">
        <div className="mb-2 font-semibold">Tools</div>
        <ul className="h-full overflow-y-scroll">
          {/*<li className="mb-2 p-2 dark:bg-opacity-5 bg-white cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg"> 
            Zoom:
            <input type="number" value={zoom} onChange={handleZoomChange} />
          </li>*/}
          <li className="mb-2 p-2 dark:bg-opacity-5 bg-white cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg">
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
        </ul>
      </div>
  );
}

export default ToolsPanel;