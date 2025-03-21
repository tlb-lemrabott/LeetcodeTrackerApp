import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/problems";

export const fetchProblems = createAsyncThunk("problems/fetchProblems", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addProblem = createAsyncThunk("problems/addProblem", async (problem) => {
  const response = await axios.post(API_URL, problem);
  return response.data;
});

export const updateProblem = createAsyncThunk("problems/updateProblem", async (problem) => {
  const response = await axios.put(`${API_URL}/${problem.problemId}`, problem);
  return response.data;
});

export const deleteProblem = createAsyncThunk("problems/deleteProblem", async (problemId) => {
  await axios.delete(`${API_URL}/${problemId}`);
  return problemId;
});

const problemSlice = createSlice({
  name: "problems",
  initialState: { problems: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.problems = action.payload;
      })
      .addCase(addProblem.fulfilled, (state, action) => {
        state.problems.push(action.payload);
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        const index = state.problems.findIndex((t) => t.problemId === action.payload.problemId);
        if (index !== -1) state.problems[index] = action.payload;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.problems = state.problems.filter((problem) => problem.problemId !== action.payload);
      });
  },
});

export default problemSlice.reducer;