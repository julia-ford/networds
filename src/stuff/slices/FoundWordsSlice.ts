import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';

import {
  ComparePlacedWords,
  NWTData,
  PlacedWord,
  TilesToString
} from '../Shared';
import { RootState } from '../store';
import {
  selectAcceptedAsString,
  selectAcceptedTiles
} from './WordInProgressSlice';

interface FoundWordsState {
  foundWords: NWTData[][];
  chosenWord?: number;
  chosenLetter?: number;
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
    },
    chooseLetter: (
      state,
      action: PayloadAction<{ wordIndex: number; letterIndex: number }>
    ) => {
      state.chosenWord = action.payload.wordIndex;
      state.chosenLetter = action.payload.letterIndex;
    },
    clearChosen: (state) => {
      state.chosenWord = undefined;
      state.chosenLetter = undefined;
    }
  }
});

export const selectFoundWords = (state: RootState) =>
  state.foundWords.foundWords;

export const selectChosenWord = (state: RootState) =>
  state.foundWords.chosenWord;

export const selectChosenLetter = (state: RootState) =>
  state.foundWords.chosenLetter;

export const selectSortedFoundWords = createSelector(
  [selectFoundWords],
  (foundWords) => {
    return foundWords
      .map((tiles, foundWordIndex) => {
        const wordWithIndex: PlacedWord = {
          tiles,
          foundWordIndex
        };
        return wordWithIndex;
      })
      .sort(ComparePlacedWords);
  }
);

export const selectChosenWordTiles = createSelector(
  [selectFoundWords, selectChosenWord],
  (foundWords, chosenWord) => {
    if (chosenWord === undefined) {
      return undefined;
    }
    return foundWords[chosenWord];
  }
);

export const selectChosenWordLength = createSelector(
  [selectChosenWordTiles],
  (chosenWord) => {
    return chosenWord?.length;
  }
);

export const selectFoundWordsAsStrings = createSelector(
  [selectFoundWords],
  (foundWords) => {
    return foundWords.map((word) => {
      return TilesToString(word);
    });
  }
);

export const selectChosenLetterString = createSelector(
  [selectFoundWords, selectChosenWord, selectChosenLetter],
  (foundWords, chosenWord, chosenLetter) => {
    if (chosenWord === undefined || chosenLetter === undefined) {
      return undefined;
    }
    return foundWords[chosenWord][chosenLetter].letter;
  }
);

export const selectNumFoundWords = createSelector(
  [selectFoundWords],
  (foundWords) => foundWords.length
);

export const { addFoundWord, chooseLetter, clearChosen } =
  foundWordsSlice.actions;

export default foundWordsSlice.reducer;
