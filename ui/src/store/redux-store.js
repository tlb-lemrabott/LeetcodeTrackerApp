import { configureStore } from "@reduxjs/toolkit";
import problemReducer from "./problemSlice";

const store = configureStore({
  reducer: {
    problems: problemReducer,
  },
});

export default store;