import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';

import { AreTilesSame, NWTData, TilesToString } from '../Shared';
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

export const selectWipTiles = (state: RootState) => {
  return state.wordInProgress.tilesFromLetterCloud;
};

export const selectDoesWipContain = (state: RootState, tileData: NWTData) => {
  return !!state.wordInProgress.tilesFromLetterCloud.find((possibleMatch) => {
    return AreTilesSame(possibleMatch, tileData);
  });
};

export const selectLastWipTile = createSelector(
  [selectWipTiles],
  (wipTiles) => {
    if (wipTiles.length < 1) {
      return undefined;
    }

    return wipTiles[wipTiles.length - 1];
  }
);

export const selectSecondToLastWipTile = createSelector(
  [selectWipTiles],
  (wipTiles) => {
    if (wipTiles.length < 2) {
      return undefined;
    }

    return wipTiles[wipTiles.length - 2];
  }
);

export const selectWordInProgressLength = createSelector(
  [selectWipTiles],
  (wipTiles) => {
    return wipTiles.length;
  }
);

export const selectWordInProgressAsString = createSelector(
  [selectWipTiles],
  (wipTiles) => {
    return TilesToString(wipTiles);
  }
);

export const {
  addTileToWordInProgress,
  removeLastTile,
  clearWordInProgress,
  chooseWIPTile
} = wordInProgressSlice.actions;

export default wordInProgressSlice.reducer;
