import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { dictContains } from '../dictionary';

import { AreTilesSame, NWTData, TilesToString } from '../Shared';
import { RootState } from '../store';
import {
  selectFoundWords,
  selectFoundWordsAsStrings,
  selectSortedFoundWords
} from './FoundWordsSlice';

interface WordInProgressState {
  tilesFromLetterCloud: NWTData[];
  rejectedWord?: NWTData[];
  acceptedWord?: NWTData[];
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
      state.rejectedWord = undefined;
      state.acceptedWord = undefined;
    },
    removeLastTile: (state) => {
      state.tilesFromLetterCloud.pop();
    },
    clearWordInProgress: (state) => {
      state.tilesFromLetterCloud = [];
    },
    clearAnimations: (state) => {
      state.rejectedWord = undefined;
      state.acceptedWord = undefined;
    },
    acceptWord: (state) => {
      state.acceptedWord = [...state.tilesFromLetterCloud];
      state.tilesFromLetterCloud = [];
      state.rejectedWord = undefined;
    },
    rejectWord: (state) => {
      state.rejectedWord = [...state.tilesFromLetterCloud];
      state.tilesFromLetterCloud = [];
      state.acceptedWord = undefined;
    }
  }
});

export const selectWipTiles = (state: RootState) => {
  return state.wordInProgress.tilesFromLetterCloud;
};

export const selectRejectedTiles = (state: RootState) => {
  return state.wordInProgress.rejectedWord;
};

export const selectAcceptedTiles = (state: RootState) => {
  return state.wordInProgress.acceptedWord;
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

export const selectWipAsString = createSelector(
  [selectWipTiles],
  (wipTiles) => {
    return TilesToString(wipTiles);
  }
);

export const selectWipAsStringCaps = createSelector(
  [selectWipAsString],
  (wipString) => {
    return wipString.toUpperCase();
  }
);

export const selectRejectedAsStringCaps = createSelector(
  [selectRejectedTiles],
  (rejectedTiles) => {
    if (rejectedTiles === undefined) {
      return undefined;
    }

    return TilesToString(rejectedTiles).toUpperCase();
  }
);

export const selectAcceptedAsString = createSelector(
  [selectAcceptedTiles],
  (accepted) => {
    if (accepted === undefined) {
      return undefined;
    }
    return TilesToString(accepted);
  }
);

export const selectAcceptedAsStringCaps = createSelector(
  [selectAcceptedAsString],
  (accepted) => {
    if (accepted === undefined) {
      return undefined;
    }
    return accepted.toUpperCase();
  }
);

export const selectAcceptedIndex = createSelector(
  [selectAcceptedAsString, selectFoundWordsAsStrings],
  (accepted, strings) => {
    if (accepted === undefined) {
      return undefined;
    }
    const acceptedIndex = strings.indexOf(accepted);
    if (acceptedIndex === -1) {
      return undefined;
    }
    return acceptedIndex;
  }
);

export const selectAcceptedWordSortedIndex = createSelector(
  [selectAcceptedIndex, selectSortedFoundWords],
  (index, sortedWords) => {
    return sortedWords.findIndex(
      (placedWord) => placedWord.foundWordIndex === index
    );
  }
);

export const selectWipLength = createSelector([selectWipTiles], (wipTiles) => {
  return wipTiles.length;
});

/** Helper for selectTileData. Just returns unmodified tileData. */
const selectTileData = (_state: RootState, tileData: NWTData) => tileData;
export const selectDoesWipContain = createSelector(
  [selectWipTiles, selectTileData],
  (wipTiles, tileData) => {
    return !!wipTiles.find((possibleMatch) => {
      return AreTilesSame(possibleMatch, tileData);
    });
  }
);

export const selectWipErrorMessage = createSelector(
  [selectWipAsString, selectFoundWordsAsStrings],
  (wip, foundWords) => {
    console.log(`Checking wip err msg. Current wip: ${wip}`);
    if (wip.length === 0) {
      return undefined;
    }

    if (wip.length < 3) {
      return 'Minimum word length is 3 characters.';
    }

    if (foundWords.includes(wip)) {
      return 'Word already found.';
    }

    if (!dictContains(wip)) {
      return 'Word not in dictionary.';
    }

    return undefined;
  }
);

export const selectIsWipValid = createSelector(
  [selectWipAsString, selectFoundWordsAsStrings],
  (wip, foundWords) => {
    if (foundWords.includes(wip)) {
      return false;
    }

    if (!dictContains(wip)) {
      return false;
    }

    return true;
  }
);

export const {
  addTileToWordInProgress,
  removeLastTile,
  clearWordInProgress,
  clearAnimations,
  acceptWord,
  rejectWord
} = wordInProgressSlice.actions;

export default wordInProgressSlice.reducer;
