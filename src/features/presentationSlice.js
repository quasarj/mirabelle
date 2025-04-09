import { createSlice } from '@reduxjs/toolkit'

const presentationSlice = createSlice({
  name: 'presentation',
  initialState: {

    panelConfig: {
      visibility: {
        left: false,
        right: false,
        top: false,
        bottom: false,
        tools: false,
        files: false,
        description: false,
        navigation: false,
        search: false,
      },
      open: {
        left: false,
        right: false,
      },
    },
    toolsConfig: {
      viewToolGroup: {
        visible: false,
        defaultValue: 'volume',
        visibility: {
          volume: false,
          projection: false,
          stack: false,
        },
      },
      functionToolGroup: {
        visible: false,
        defaultValue: 'mask',
        visibility: {
          mask: false,
          blackout: false,
          sliceRemove: false,
        },
      },
      formToolGroup: {
        visible: false,
        defaultValue: 'cylinder',
        visibility: {
          cuboid: false,
          cylinder: false,
        },
      },
      leftClickToolGroup: {
        visible: false,
        defaultValue: 'selection',
        visibility: {
          windowLevel: false,
          rectangleScissors: false,
          crossHairs: false,
        }
      },
      rightClickToolGroup: {
        visible: false,
        defaultValue: 'zoom',
        visibility: {
          zoom: false,
          pan: false,
        }
      },
      opacityTool: {
        visible: false,
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.3,
      },
      presetTool: {
        visible: false,
        defaultValue: 'CT-MIP',
      },
    },



    maximumIntensityProjection: false,

    presets: [
        "CT-AAA",
        "CT-AAA2",
        "CT-Bone",
        "CT-Bones",
        "CT-Cardiac",
        "CT-Cardiac2",
        "CT-Cardiac3",
        "CT-Chest-Contrast-Enhanced",
        "CT-Chest-Vessels",
        "CT-Coronary-Arteries",
        "CT-Coronary-Arteries-2",
        "CT-Coronary-Arteries-3",
        "CT-Cropped-Volume-Bone",
        "CT-Fat",
        "CT-Liver-Vasculature",
        "CT-Lung",
        "CT-MIP",
        "CT-Muscle",
        "CT-Pulmonary-Arteries",
        "CT-Soft-Tissue",
        "CT-Air",
        "MR-Angio",
        "MR-Default",
        "MR-MIP",
        "MR-T2-Brain",
        "DTI-FA-Brain",
    ] // Initial presets matching those in ToolsPanel
  },
  reducers: {
    setMip: (state, action) => {
      state.maximumIntensityProjection = action.payload
    },
    // Set the entire toolsConfig
    setToolsConfig: (state, action) => {
      state.toolsConfig = { ...state.toolsConfig, ...action.payload }
    },
    setPresets: (state, action) => {
      state.presets = action.payload
    },
    addPreset: (state, action) => {
      if (!state.presets.includes(action.payload)) {
        state.presets.push(action.payload)
      }
    },
    removePreset: (state, action) => {
      state.presets = state.presets.filter(preset => preset !== action.payload)
    },
    // Sets the default configuration for the Masker Route
    setMaskerConfig: (state, action) => {
      state.panelConfig.visibility.left = true;
      state.panelConfig.visibility.tools = true;
      state.panelConfig.open.left = true;
      state.toolsConfig.functionToolGroup.visible = true;
      return state;
    },

  }
})

export const { setPresets, addPreset, removePreset, setToolsConfig, setMip, setMaskerConfig } = presentationSlice.actions

export default presentationSlice.reducer 
