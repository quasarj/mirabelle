import { createSlice } from '@reduxjs/toolkit'

const presentationSlice = createSlice({
  name: 'presentation',
  initialState: {
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
    }
  }
})

export const { setPresets, addPreset, removePreset } = presentationSlice.actions

export default presentationSlice.reducer 