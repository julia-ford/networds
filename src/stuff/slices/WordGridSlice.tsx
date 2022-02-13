import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { AreTilesSame, Directions, GameModes, NWTData } from '../Shared';
import { RootState } from '../store';
import { WG_HEIGHT, WG_WIDTH } from '../../modules/WordGrid';
import { Candy } from '../../modules/bulk/NetwordsTile';
import { selectWipChosen, selectWipTiles } from './WordInProgressSlice';
import { selectChosenDirection, selectGameMode } from './GameSlice';

interface WordGridState {
  words: NWTData[][];
  candies: NWTData[];
  chosenSpace?: NWTData;
}
const wordGridSlice = createSlice<
  WordGridState,
  SliceCaseReducers<WordGridState>
>({
  name: 'wordGrid',
  initialState: {
    words: [],
    candies: [
      {
        row: 4,
        col: 9,
        candy: {
          icon: faStar,
          color: '#ec407a',
          isValidStart: true
        }
      }
    ]
  },
  reducers: {
    addWord: (state, action: PayloadAction<NWTData[]>) => {
      state.words.push(action.payload);
    },
    chooseWordGridSpace: (state, action: PayloadAction<NWTData>) => {
      state.chosenSpace = action.payload;
    },
    removeLastWord: (state) => {
      state.words.pop();
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

export const selectWordGridWords = (state: RootState) => state.wordGrid.words;

export const selectPlacedWordsAsStrings = (state: RootState) => {
  return state.wordGrid.words.map((wordAsTiles) => {
    return wordAsTiles.reduce((prev, curr) => {
      return { letter: prev.letter! + curr.letter!, row: -1, col: -1 };
    }).letter!;
  });
};

interface WGTileProps {
  letter?: string;
  candy?: Candy;
  isJunction: boolean;
  isChosen: boolean;
  isValidChoice: boolean;

  isInPreview: boolean;
  previewLetter?: string;
  hasPreviewError: boolean;
}

export const selectPreviewWordTiles = (state: RootState) => {
  if (state.game.gameMode !== GameModes.ConfirmingChoices) {
    return [];
  } else {
    const wordLength = state.wordInProgress.tilesFromLetterCloud.length;
    const pivotIndex = state.wordInProgress.chosenIndex!;
    const numLettersFwd = wordLength - pivotIndex - 1;
    const numLettersBck = pivotIndex;
    const chosenDir = state.game.chosenDirection!;

    const tiles: NWTData[] = [];

    const pivotTile: NWTData = {
      row: state.wordGrid.chosenSpace!.row,
      col: state.wordGrid.chosenSpace!.col,
      letter: state.wordInProgress.tilesFromLetterCloud[pivotIndex].letter,
      candy: state.wordGrid.chosenSpace?.candy
    };

    let coordsFwd: NWTData = {
      row: state.wordGrid.chosenSpace!.row,
      col: state.wordGrid.chosenSpace!.col
    };
    for (let i = 1; i <= numLettersFwd; i++) {
      coordsFwd = getNextCoords(coordsFwd, chosenDir);

      if (
        coordsFwd.row >= 0 &&
        coordsFwd.col >= 0 &&
        coordsFwd.row < WG_HEIGHT &&
        coordsFwd.col < WG_WIDTH
      ) {
        tiles.push({
          row: coordsFwd.row,
          col: coordsFwd.col,
          letter:
            state.wordInProgress.tilesFromLetterCloud[pivotIndex + i].letter
        });
      }
    }

    tiles.push(pivotTile);

    let coordsBck: NWTData = {
      row: state.wordGrid.chosenSpace!.row,
      col: state.wordGrid.chosenSpace!.col
    };
    for (let i = 1; i <= numLettersBck; i++) {
      coordsBck = getPrevCoords(coordsBck, chosenDir);

      if (
        coordsBck.row >= 0 &&
        coordsBck.col >= 0 &&
        coordsBck.row < WG_HEIGHT &&
        coordsBck.col < WG_WIDTH
      ) {
        tiles.push({
          row: coordsBck.row,
          col: coordsBck.col,
          letter:
            state.wordInProgress.tilesFromLetterCloud[pivotIndex - i].letter
        });
      }
    }
    return tiles;
  }
};

export const selectWordGridTilesState = createSelector(
  [
    selectGameMode,
    selectWordGridChosenSpace,
    selectWordGridCandies,
    selectWordGridWords,
    selectWipChosen,
    selectWipTiles,
    selectChosenDirection
  ],
  (
    gameMode,
    chosenSpace,
    candies,
    words,
    wipChosenIndex,
    wipTiles,
    chosenDir
  ) => {
    // Make blank grid of correct dimensions.
    const wordGrid: WGTileProps[][] & { hasErrors?: boolean } = [];
    for (let row = 0; row < WG_HEIGHT; row++) {
      const rowArray: WGTileProps[] = [];
      for (let col = 0; col < WG_WIDTH; col++) {
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
      word.forEach((tileData) => {
        const wgTile = wordGrid[tileData.row][tileData.col];

        wgTile.letter = tileData.letter;
        if (
          wipChosenIndex !== undefined &&
          wipTiles[wipChosenIndex].letter &&
          wgTile.letter === wipTiles[wipChosenIndex].letter
        ) {
          wgTile.isValidChoice = true;
        } else if (wipChosenIndex) {
          wgTile.isValidChoice = false;
        }
      });
    });

    // Add preview letters and deal with errors.
    if (gameMode === GameModes.ConfirmingChoices) {
      wordGrid.hasErrors = false;

      const wordLength = wipTiles.length;
      const pivotIndex = wipChosenIndex!;
      const numLettersFwd = wordLength - pivotIndex - 1;
      const numLettersBck = pivotIndex;

      const pivotTile = wordGrid[chosenSpace!.row][chosenSpace!.col];
      pivotTile.previewLetter = wipTiles[pivotIndex].letter;
      pivotTile.isInPreview = true;

      let coordsFwd: NWTData = {
        row: chosenSpace!.row,
        col: chosenSpace!.col
      };
      for (let i = 1; i <= numLettersFwd; i++) {
        coordsFwd = getNextCoords(coordsFwd, chosenDir!);

        if (
          coordsFwd.row >= 0 &&
          coordsFwd.col >= 0 &&
          coordsFwd.row < WG_HEIGHT &&
          coordsFwd.col < WG_WIDTH
        ) {
          const tile = wordGrid[coordsFwd.row][coordsFwd.col];
          tile.isInPreview = true;
          tile.previewLetter = wipTiles[pivotIndex + i].letter;
          tile.hasPreviewError =
            !!tile.letter && tile.previewLetter !== tile.letter;
          wordGrid.hasErrors = wordGrid.hasErrors || tile.hasPreviewError;
        } else {
          wordGrid.hasErrors = true;
        }
      }

      let coordsBck: NWTData = {
        row: chosenSpace!.row,
        col: chosenSpace!.col
      };
      for (let i = 1; i <= numLettersBck; i++) {
        coordsBck = getPrevCoords(coordsBck, chosenDir!);

        if (
          coordsBck.row >= 0 &&
          coordsBck.col >= 0 &&
          coordsBck.row < WG_HEIGHT &&
          coordsBck.col < WG_WIDTH
        ) {
          const tile = wordGrid[coordsBck.row][coordsBck.col];
          tile.isInPreview = true;
          tile.previewLetter = wipTiles[pivotIndex - i].letter;
          tile.hasPreviewError =
            !!tile.letter && tile.previewLetter !== tile.letter;
          wordGrid.hasErrors = wordGrid.hasErrors || tile.hasPreviewError;
        } else {
          wordGrid.hasErrors = true;
        }
      }
    }

    return wordGrid;
  }
);

const getNextCoords = (tileData: NWTData, direction: Directions) => {
  const coords: NWTData = {
    row: tileData.row,
    col: tileData.col
  };
  if (direction === Directions.East) {
    coords.col += 1;
  } else if (direction === Directions.West) {
    coords.col -= 1;
  } else if (direction === Directions.Northeast) {
    if (coords.row % 2 === 1) {
      coords.col += 1;
    }
    coords.row -= 1;
  } else if (direction === Directions.Northwest) {
    if (coords.row % 2 === 0) {
      coords.col -= 1;
    }
    coords.row -= 1;
  } else if (direction === Directions.Southeast) {
    if (coords.row % 2 === 1) {
      coords.col += 1;
    }
    coords.row += 1;
  } else if (direction === Directions.Southwest) {
    if (coords.row % 2 === 0) {
      coords.col -= 1;
    }
    coords.row += 1;
  }
  return coords;
};

const getPrevCoords = (tileData: NWTData, direction: Directions) => {
  const coords: NWTData = {
    row: tileData.row,
    col: tileData.col
  };
  if (direction === Directions.West) {
    coords.col += 1;
  } else if (direction === Directions.East) {
    coords.col -= 1;
  } else if (direction === Directions.Southwest) {
    if (coords.row % 2 === 1) {
      coords.col += 1;
    }
    coords.row -= 1;
  } else if (direction === Directions.Southeast) {
    if (coords.row % 2 === 0) {
      coords.col -= 1;
    }
    coords.row -= 1;
  } else if (direction === Directions.Northwest) {
    if (coords.row % 2 === 1) {
      coords.col += 1;
    }
    coords.row += 1;
  } else if (direction === Directions.Northeast) {
    if (coords.row % 2 === 0) {
      coords.col -= 1;
    }
    coords.row += 1;
  }
  return coords;
};

export const {
  addWord,
  chooseWordGridSpace,
  removeLastWord,
  clearChosenSpace
} = wordGridSlice.actions;

export default wordGridSlice.reducer;
