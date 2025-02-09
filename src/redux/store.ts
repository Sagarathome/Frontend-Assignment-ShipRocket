import { configureStore } from '@reduxjs/toolkit'
import fileExplorerReducer from "./fileExplorerSlice"

const store = configureStore({
  reducer: {
    fileExplorer: fileExplorerReducer
  }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;