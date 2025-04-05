import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices";

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export default store;
