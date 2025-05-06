import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import * as cornerstoneTools from '@cornerstonejs/tools';

import MaterialButtonSet from '@/components/MaterialButtonSet';

import useToolsManager from './toolsManager';
import useToolsConfigs from './toolsConfig';

import './ToolsPanel.css';

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
  const globalStateValues = useSelector(state => state.presentation.stateValues);

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
    <div id="tools-panel" className="side-panel">
      {
        globalToolsConfig.viewToolGroup.visible &&
        <div>
          <p>View</p>
          <MaterialButtonSet
            buttonConfig={toolsConfigs.viewGroupButtonConfig}
            initialActiveButton={toTitleCase(globalStateValues.view)}
          />
        </div>
      }
      {
        globalToolsConfig.functionToolGroup.visible &&
        <MaterialButtonSet
          buttonConfig={toolsConfigs.functionGroupButtonConfig}
          initialActiveButton={toTitleCase(globalStateValues.function)}
        />
      }
      {
        globalToolsConfig.formToolGroup.visible &&
        <MaterialButtonSet
          buttonConfig={toolsConfigs.formGroupButtonConfig}
          initialActiveButton={toTitleCase(globalStateValues.form)}
        />
      }
      {
        globalToolsConfig.leftClickToolGroup.visible &&
        <MaterialButtonSet
          buttonConfig={toolsConfigs.leftClickGroupButtonConfig}
          initialActiveButton={toTitleCase(globalStateValues.leftClick)}
        />
      }
      {
        globalToolsConfig.rightClickToolGroup.visible &&
        <MaterialButtonSet
          buttonConfig={toolsConfigs.rightClickGroupButtonConfig}
          initialActiveButton={toTitleCase(globalStateValues.rightClick)}
        />
      }
      {
        globalToolsConfig.presetToolGroup.visible &&
        <div className="preset-dropdown-container">
          <label htmlFor="preset-select">Preset:</label>
          <select
            id="preset-select"
            value={globalStateValues.preset}
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
      }
    </div>
  );
}

export default ToolsPanel;
