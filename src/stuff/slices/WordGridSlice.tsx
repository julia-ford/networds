import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import {
  faStar,
  faBell,
  faAppleWhole
} from '@fortawesome/free-solid-svg-icons';

import { AreTilesSame, getNextCoords, NWTData, PlacedWord } from '../Shared';
import { RootState } from '../store';
import {
  COLOR_GREEN_MAIN,
  COLOR_PINK_MAIN,
  COLOR_PURPLE_MAIN
} from './StylingSlice';
import { WG_TILES_HIGH, WG_TILES_WIDE } from './StylingSlice';
import { Candy } from '../../modules/bulk/NetwordsTile';
import { selectChosenDirection, selectOppositeDirection } from './GameSlice';
import {
  selectChosenLetter,
  selectChosenLetterString,
  selectChosenWord,
  selectChosenWordLength,
  selectChosenWordTiles
} from './FoundWordsSlice';
import { selectWordInProgressLength } from './WordInProgressSlice';

interface WordGridState {
  placedWords: PlacedWord[];
  candies: NWTData[];
  chosenSpace?: NWTData;
}
const wordGridSlice = createSlice<
  WordGridState,
  SliceCaseReducers<WordGridState>
>({
  name: 'wordGrid',
  initialState: {
    placedWords: [],
    candies: [
      {
        row: 0,
        col: 0,
        candy: {
          icon: faAppleWhole,
          colorMain: COLOR_GREEN_MAIN,
          colorText: 'white',
          isValidStart: false
        }
      },
      {
        row: 8,
        col: 8,
        candy: {
          icon: faBell,
          colorMain: COLOR_PURPLE_MAIN,
          colorText: 'white',
          isValidStart: false
        }
      },
      {
        row: 4,
        col: 4,
        candy: {
          icon: faStar,
          colorMain: COLOR_PINK_MAIN,
          colorText: 'white',
          isValidStart: true
        }
      }
    ]
  },
  reducers: {
    addWord: (state, action: PayloadAction<PlacedWord>) => {
      state.placedWords.push(action.payload);
    },
    chooseWordGridSpace: (state, action: PayloadAction<NWTData>) => {
      state.chosenSpace = action.payload;
    },
    removeLastWord: (state) => {
      state.placedWords.pop();
    },
    clearChosenSpace: (state) => {
      state.chosenSpace = undefined;
    }
  }
});

export const selectWordGridChosenSpace = (state: RootState) =>
  state.wordGrid.chosenSpace;

export const selectWordGridCandies = (state: RootState) =>
  state.wordGrid.candies;

export const selectPlacedWords = (state: RootState) =>
  state.wordGrid.placedWords;

export const selectPlacedWordsIndices = createSelector(
  [selectPlacedWords],
  (placedWords) => {
    return placedWords.map((placedWord) => placedWord.foundWordIndex);
  }
);

export const selectLastPlacedWord = createSelector(
  [selectPlacedWordsIndices],
  (placedWordIndices) => placedWordIndices[placedWordIndices.length - 1]
);

export const selectPreviewFirstTileCoords = createSelector(
  [selectWordGridChosenSpace, selectOppositeDirection, selectChosenLetter],
  (startCoords, oppDir, distance) => {
    // If the player hasn't chosen a space on the word grid, a tile in the
    // word in progress, and a direction to point the word yet, we don't need
    // a preview yet.
    if (!startCoords || !oppDir || distance === undefined) {
      return undefined;
    }

    // Find coords of the first tile in the preview by facing the opposite
    // direction and backing up until we reach the start of the word.
    let result = { ...startCoords };
    for (let i = distance; i > 0; i--) {
      result = getNextCoords(result, oppDir);
    }

    return result;
  }
);

export const selectPreviewLastTileCoords = createSelector(
  [
    selectWordGridChosenSpace,
    selectChosenDirection,
    selectChosenLetter,
    selectWordInProgressLength
  ],
  (startCoords, dir, startIndex, wipLength) => {
    // If the player hasn't chosen a space on the word grid, a tile in the
    // word in progress, and a direction to point the word yet, we don't need
    // a preview yet.
    if (!startCoords || !dir || startIndex === undefined) {
      return undefined;
    }

    // Find coords of the first tile in the preview by facing the opposite
    // direction and backing up until we reach the start of the word.
    let result = { ...startCoords };
    for (let i = startIndex; i < wipLength; i++) {
      result = getNextCoords(result, dir);
    }

    return result;
  }
);

export const selectPreviewWord = createSelector(
  [
    selectPreviewFirstTileCoords,
    selectChosenWord,
    selectChosenWordTiles,
    selectChosenDirection
  ],
  (firstTileCoords, foundWordIndex, foundWordTiles, direction) => {
    // If we couldn't get the coords for the first tile, or if the direction
    // hasn't been chosen yet, or if a word hasn't been chosen yet, give up.
    if (
      !firstTileCoords ||
      foundWordIndex === undefined ||
      !foundWordTiles ||
      !direction
    ) {
      return undefined;
    }

    // We already got the first tile coords from that other selector,
    // so just slap a letter on it.
    const previewTiles: NWTData[] = [
      { ...firstTileCoords, letter: foundWordTiles[0].letter }
    ];

    // For all the other tiles, get coords one space forward from the previous
    // tile, and slap on the letter.
    foundWordTiles.slice(1).forEach((wipTile, index) => {
      previewTiles.push({
        ...getNextCoords(previewTiles[index], direction),
        letter: wipTile.letter
      });
    });

    const previewPlacedWord: PlacedWord = {
      tiles: previewTiles,
      foundWordIndex
    };

    return previewPlacedWord;
  }
);

export const selectRotateRightButtonCoords = createSelector(
  [
    selectWordGridChosenSpace,
    selectChosenDirection,
    selectChosenLetter,
    selectChosenWordLength
  ],
  (startCoords, oppDir, chosenLetterIndex, chosenWordLength) => {
    // If the player hasn't chosen a space on the word grid, a tile in the
    // word in progress, and a direction to point the word yet, we don't need
    // a preview yet.
    if (
      !startCoords ||
      !oppDir ||
      chosenLetterIndex === undefined ||
      chosenWordLength === undefined
    ) {
      return undefined;
    }

    // Find coords of the last tile in the preview by facing the chosen
    // direction stepping forward until we reach the end of the word.
    // Then go one step further, and you've reaced the correct coords.
    let result = { ...startCoords };
    for (let i = chosenLetterIndex; i <= chosenWordLength; i++) {
      result = getNextCoords(result, oppDir);
    }

    return result;
  }
);

export interface WGTileData {
  letter?: string;
  candy?: Candy;

  isChosen: boolean;

  isJunction: boolean;
  isValidChoice: boolean;

  isInPreview: boolean;
  previewLetter?: string;
  hasPreviewError: boolean;
}
export const selectWordGridTilesState = createSelector(
  [
    selectWordGridChosenSpace,
    selectWordGridCandies,
    selectPlacedWords,
    selectChosenLetterString,
    selectPreviewWord
  ],
  (chosenSpace, candies, words, foundWordChosenLetter, previewWord) => {
    // Make blank grid of correct dimensions.
    const wordGrid: WGTileData[][] & { hasErrors?: boolean } = [];
    for (let row = 0; row < WG_TILES_HIGH; row++) {
      const rowArray: WGTileData[] = [];
      for (let col = 0; col < WG_TILES_WIDE; col++) {
        rowArray.push({
          isJunction: false,
          isChosen: !!chosenSpace && AreTilesSame({ row, col }, chosenSpace),
          isValidChoice: false,
          isInPreview: false,
          hasPreviewError: false
        });
      }
      wordGrid.push(rowArray);
    }

    // Add candies.
    candies.forEach((tileData) => {
      wordGrid[tileData.row][tileData.col].candy = tileData.candy;
      if (
        !wordGrid[tileData.row][tileData.col].isChosen &&
        tileData.candy?.isValidStart
      ) {
        wordGrid[tileData.row][tileData.col].isValidChoice = true;
      }
    });

    // Add letters and figure out if each tile is a valid choice for word placing
    words.forEach((word) => {
      word.tiles.forEach((tileData) => {
        const wgTile = wordGrid[tileData.row][tileData.col];
        if (wgTile.letter) {
          wgTile.isJunction = true;
        }
        wgTile.letter = tileData.letter;
        if (foundWordChosenLetter && wgTile.letter === foundWordChosenLetter) {
          wgTile.isValidChoice = true;
        } else {
          wgTile.isValidChoice = false;
        }
      });
    });

    // Add preview letters and deal with errors.
    if (previewWord) {
      const legalPreviewTiles = previewWord.tiles.filter((previewTile) => {
        return (
          previewTile.row >= 0 &&
          previewTile.col >= 0 &&
          previewTile.row < WG_TILES_HIGH &&
          previewTile.col < WG_TILES_WIDE
        );
      });

      wordGrid.hasErrors =
        legalPreviewTiles.length !== previewWord.tiles.length;
      legalPreviewTiles.forEach((previewTile) => {
        const oldeTile = wordGrid[previewTile.row][previewTile.col];
        oldeTile.isInPreview = true;
        oldeTile.previewLetter = previewTile.letter;
        if (oldeTile.letter && oldeTile.letter !== previewTile.letter) {
          oldeTile.hasPreviewError = true;
          wordGrid.hasErrors = true;
        }
      });
    }

    return wordGrid;
  }
);

export const selectPreviewHasErrors = createSelector(
  [selectWordGridTilesState],
  (wgTiles) => {
    return wgTiles.hasErrors ?? false;
  }
);

export const {
  addWord,
  chooseWordGridSpace,
  removeLastWord,
  clearChosenSpace
} = wordGridSlice.actions;

export default wordGridSlice.reducer;
