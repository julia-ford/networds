import React from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';

import { AreTilesSame, NWTData } from '../Shared';
import { RootState } from '../store';

interface WordInProgressState {
  tilesFromLetterCloud: NWTData[];
  chosenIndex?: number;
}
const wordInProgressSlice = createSlice<
  WordInProgressState,
  SliceCaseReducers<WordInProgressState>
>({
  name: 'wordInProgress',
  initialState: {
    tilesFromLetterCloud: []
  },
  reducers: {
    addTileToWordInProgress: (state, action: PayloadAction<NWTData>) => {
      state.tilesFromLetterCloud.push(action.payload);
    },
    removeLastTile: (state) => {
      state.tilesFromLetterCloud.pop();
    },
    clearWordInProgress: (state) => {
      state.tilesFromLetterCloud = [];
      state.chosenIndex = undefined;
    },
    chooseWIPTile: (state, action: PayloadAction<number>) => {
      state.chosenIndex = action.payload;
    }
  }
});

export const selectWipChosen = (state: RootState) => {
  return state.wordInProgress.chosenIndex;
};

export const selectWipTiles = (state: RootState) => {
  return state.wordInProgress.tilesFromLetterCloud;
};

export const wipContains = (state: RootState, tileData: NWTData) => {
  return !!state.wordInProgress.tilesFromLetterCloud.find((possibleMatch) => {
    return AreTilesSame(possibleMatch, tileData);
  });
};

export const selectIsLastTileInWip = (state: RootState, tileData: NWTData) => {
  return (
    state.wordInProgress.tilesFromLetterCloud.length &&
    state.wordInProgress.tilesFromLetterCloud.findIndex((possibleMatch) => {
      return AreTilesSame(possibleMatch, tileData);
    }) ===
      state.wordInProgress.tilesFromLetterCloud.length - 1
  );
};

export const selectWordInProgressLength = (state: RootState) => {
  return state.wordInProgress.tilesFromLetterCloud.length;
};

export const selectWordInProgressAsString = (state: RootState) => {
  return state.wordInProgress.tilesFromLetterCloud
    .map((tileData) => tileData.letter!)
    .join()
    .toLowerCase();
};

export const selectWipChosenLetter = createSelector(
  [selectWipTiles, selectWipChosen],
  (wipTiles, wipChosen) => {
    if (wipChosen === undefined) {
      return undefined;
    }
    return wipTiles[wipChosen].letter;
  }
);

export const {
  addTileToWordInProgress,
  removeLastTile,
  clearWordInProgress,
  chooseWIPTile
} = wordInProgressSlice.actions;

export default wordInProgressSlice.reducer;
