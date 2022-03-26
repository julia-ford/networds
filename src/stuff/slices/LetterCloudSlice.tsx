import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

import { getRandomLetters, getRandomWords } from '../dictionary';
import { NWTData } from '../Shared';

const wordsOfTheDay = getRandomWords();
const tempLetters = getRandomLetters();

interface LetterCloudState {
  words: string[];
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
    words: wordsOfTheDay,
    letters: tempLetters,
    angeredLetters: [],
    calmdownTodo: []
  },
  reducers: {}
});

export const {} = letterCloudSlice.actions;

export default letterCloudSlice.reducer;
