import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import * as cornerstoneTools from '@cornerstonejs/tools';

import MaterialButtonSet from '@/components/MaterialButtonSet';

import './ToolsPanel.css';
import useToolsManager from './toolsManager';
import useToolsConfigs from './toolsConfig';

function toTitleCase(some_string) {
    return some_string.replace("_", " ").replace(
      /\w\S*/g, 
      (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
};

function ToolsPanel({ toolGroup, onPresetChange, defaultPreset = 'CT-MIP' }) {
  const presets = useSelector(state => state.presentation.presets);
  // const toolsConfig = useSelector(state => state.presentation.presets);
  //
  const globalToolsConfig = useSelector(state => state.presentation.toolsConfig);

  const maskingFunction = useSelector(state => state.masking.function);
  const maskingForm = useSelector(state => state.masking.form);

  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);

  const manager = useToolsManager({ toolGroup });
  const toolsConfigs = useToolsConfigs({ manager });

  const handlePresetChange = (event) => {
    const newPreset = event.target.value;
    setSelectedPreset(newPreset);
    onPresetChange(newPreset);
  };

  // activate the default tool selection for left and right click
  manager.switchLeftClickMode("selection");
  manager.switchRightClickMode("zoom");

  return (
    <div id="tools-panel">
      { 
        globalToolsConfig.viewToolGroup.visible && 
        <MaterialButtonSet
          buttonConfig={toolsConfigs.viewGroupButtonConfig}
          initialActiveButton={toTitleCase("volume")}
        />
      }
      <MaterialButtonSet
        buttonConfig={toolsConfigs.functionGroupButtonConfig}
        initialActiveButton={toTitleCase(maskingFunction)}
      />
      <MaterialButtonSet
        buttonConfig={toolsConfigs.formGroupButtonConfig}
        initialActiveButton={toTitleCase(maskingForm)}
      />
      <MaterialButtonSet
        buttonConfig={toolsConfigs.leftClickGroupButtonConfig}
        initialActiveButton="Selection"
      />
      <MaterialButtonSet
        buttonConfig={toolsConfigs.rightClickGroupButtonConfig}
        initialActiveButton="Zoom"
      />
      <div className="preset-dropdown-container">
        <label htmlFor="preset-select">Preset:</label>
        <select
          id="preset-select"
          value={selectedPreset}
          onChange={handlePresetChange}
          className="preset-select"
        >
          {presets.map(preset => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ToolsPanel;
