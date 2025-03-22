import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import presentationReducer from './features/presentationSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    presentation: presentationReducer,
  },
})

export default store;
