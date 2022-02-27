import { ReactNode } from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { getRandomLetters } from '../dictionary';

const date = new Date();
const tempLetters = getRandomLetters(
  `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}`
);

interface LetterCloudState {
  letters: (string | undefined)[][];
  fadingConnectors: ReactNode[];
}
const letterCloudSlice = createSlice<
  LetterCloudState,
  SliceCaseReducers<LetterCloudState>
>({
  name: 'letterCloud',
  initialState: {
    letters: tempLetters,
    fadingConnectors: []
  },
  reducers: {
    enqueueConnector: (state, action: PayloadAction<ReactNode>) => {
      state.fadingConnectors.push(action.payload);
    },
    dequeueConnector: (state) => {
      state.fadingConnectors.shift();
    }
  }
});

export const selectCloudLetters = (state: RootState) => {
  return state.letterCloud.letters;
};

export const { enqueueConnector, dequeueConnector } = letterCloudSlice.actions;

export default letterCloudSlice.reducer;
