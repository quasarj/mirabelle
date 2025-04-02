import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import presentationReducer from './features/presentationSlice'
import maskingReducer from './features/maskingSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    presentation: presentationReducer,
    masking: maskingReducer,
  },
})

export default store;
