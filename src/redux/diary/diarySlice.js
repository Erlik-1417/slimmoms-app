import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eatenProducts: [],
  date: new Date().toISOString().split('T')[0],
  daySummary: {
    kcalLeft: 0,
    kcalConsumed: 0,
    dailyRate: 0,
    percentsOfDailyRate: 0,
  },
  error: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('diary/getDayInfo/fulfilled', (state, action) => {
        state.eatenProducts = action.payload.eatenProducts || [];
        state.daySummary = action.payload.daySummary || initialState.daySummary;
        state.error = null;
      })
      .addCase('diary/addProduct/fulfilled', (state, action) => {
        state.eatenProducts.push(action.payload.eatenProduct);
        state.daySummary = action.payload.daySummary;
        state.error = null;
      })
      .addCase('diary/deleteProduct/fulfilled', (state, action) => {
        
        const deletedId = action.meta?.arg?.productId;
        if (deletedId) {
          state.eatenProducts = state.eatenProducts.filter(
            p => String(p._id || p.id) !== String(deletedId)
          );
        }
        if (action.payload?.daySummary) {
          state.daySummary = action.payload.daySummary;
        }
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.includes('diary/'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { setDate } = diarySlice.actions;
export const diaryReducer = diarySlice.reducer;
