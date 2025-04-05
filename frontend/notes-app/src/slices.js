import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      { sender: "Team Member 1", text: "Welcome to the team chat!" },
      { sender: "Team Member 2", text: "Let’s win this competition!" },
    ],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
