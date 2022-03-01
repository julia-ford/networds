import React from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction
} from '@reduxjs/toolkit';

import { CompareWords, NWTData } from '../Shared';

interface FoundWordsState {
  foundWords: NWTData[][];
  chosenWord?: number;
}
const foundWordsSlice = createSlice<
  FoundWordsState,
  SliceCaseReducers<FoundWordsState>
>({
  name: 'foundWords',
  initialState: {
    foundWords: []
  },
  reducers: {
    addFoundWord: (state, action: PayloadAction<NWTData[]>) => {
      state.foundWords.push(action.payload);
      state.foundWords.sort(CompareWords);
    },
    chooseWord: (state, action: PayloadAction<number>) => {
      state.chosenWord = action.payload;
    },
    clearChosenWord: (state) => {
      state.chosenWord = undefined;
    }
  }
});

export const { addFoundWord, chooseWord, clearChosenWord } =
  foundWordsSlice.actions;

export default foundWordsSlice.reducer;
