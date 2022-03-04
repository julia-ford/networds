import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

import { getRandomLetters } from '../dictionary';
import { NWTData } from '../Shared';

const date = new Date();
const tempLetters = getRandomLetters(
  `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}`
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
