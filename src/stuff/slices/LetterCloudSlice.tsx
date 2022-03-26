import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

import { getRandomLetters } from '../dictionary';
import { NWTData } from '../Shared';

export const SEED_DATE = new Date();
const tempLetters = getRandomLetters(
  `${SEED_DATE.getUTCFullYear()}${SEED_DATE.getUTCMonth()}${SEED_DATE.getUTCDate()}`
);

interface LetterCloudState {
  letters: (string | undefined)[][];
  angeredLetters: NWTData[];
  calmdownTodo: NWTData[][];
}
const letterCloudSlice = createSlice<
  LetterCloudState,
  SliceCaseReducers<LetterCloudState>
>({
  name: 'letterCloud',
  initialState: {
    letters: tempLetters,
    angeredLetters: [],
    calmdownTodo: []
  },
  reducers: {}
});

export const {} = letterCloudSlice.actions;

export default letterCloudSlice.reducer;
