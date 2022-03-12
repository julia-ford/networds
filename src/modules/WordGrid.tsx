import React, { CSSProperties, ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { Directions, GameModes, NWTData } from '../stuff/Shared';
import {
  COLOR_BLUE_TRANS,
  COLOR_RED_MAIN,
  COLOR_YELLOW_MAIN,
  selectUnitSize,
  TILE_SHADOW_WIDTH,
  TILE_UNITS,
  WG_UNITS_HIGH,
  WG_UNITS_WIDE
} from '../stuff/slices/StylingSlice';
import { selectChosenDirection, setGameMode } from '../stuff/slices/GameSlice';
import { selectChosenLetterString } from '../stuff/slices/FoundWordsSlice';
import {
  chooseWordGridSpace,
  selectWordGridChosenSpace,
  selectWordGridTilesState,
  WGTileData
} from '../stuff/slices/WordGridSlice';
import {
  selectLeftOffset,
  selectTopOffset
} from '../stuff/slices/StylingSlice';
import {
  CancelDirPickingButton,
  DirectionPicker
} from './bulk/DirectionPicker';
import { NetwordsTile } from './bulk/NetwordsTile';
import { ConnectorMode, TileConnector } from './bulk/TileConnector';

import './WordGrid.css';
import { PCBRow } from './PlacementControlButtons';

export const WordGrid = () => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const unitSize = useAppSelector(selectUnitSize);
  const wordGrid = useAppSelector(selectWordGridTilesState);
  const chosenSpace = useAppSelector(selectWordGridChosenSpace);
  const placedWords = useAppSelector((state) => state.wordGrid.placedWords);
  const chosenDirection = useAppSelector(selectChosenDirection);
  const chosenLetterString = useAppSelector(selectChosenLetterString);

  const dispatch = useAppDispatch();

  const showControlButtons =
    chosenLetterString !== undefined &&
    chosenSpace !== undefined &&
    chosenDirection !== undefined;
  const controlButtons = !showControlButtons ? null : <PCBRow></PCBRow>;

  const tiles = wordGrid.map((row, rowIndex) => {
    return row.map((tile, colIndex) => {
      const tileData = { row: rowIndex, col: colIndex };

      let onClick: undefined | (() => void);
      if (chosenLetterString && tile.isValidChoice) {
        onClick = () => {
          dispatch(chooseWordGridSpace({ row: rowIndex, col: colIndex }));
          dispatch(setGameMode(GameModes.ChoosingDirection));
        };
      }

      return (
        <WGTile
          key={`WG Tile at (${rowIndex}, ${colIndex})`}
          wgHasErrors={!!wordGrid.hasErrors}
          wgTileData={tile}
          className={`WGTile ${tile.letter ? 'WithLetter' : ''} ${
            tile.isJunction ? 'Junction' : ''
          }`}
          nwTileData={tileData}
          onClick={onClick}
        ></WGTile>
      );
    });
  });

  const connectors: ReactNode[] = [];
  placedWords.forEach((word) => {
    word.tiles.forEach((tileData, index) => {
      if (index === 0) {
        return null;
      }
      const prev = word.tiles[index - 1];
      connectors.push(
        <TileConnector
          key={`(${prev.row}, ${prev.col}) to (${tileData.row}, ${tileData.col})`}
          prev={prev}
          next={tileData}
          mode={ConnectorMode.WG}
        ></TileConnector>
      );
    });
  });

  let directionPickers: ReactNode[] = [];
  if (gameMode === GameModes.ChoosingDirection) {
    directionPickers = Object.values(Directions).map((dir) => {
      return (
        <DirectionPicker
          key={`direction picker ${dir}`}
          direction={dir}
        ></DirectionPicker>
      );
    });

    directionPickers.push(
      <CancelDirPickingButton key='Dir Picking Cancel Button'></CancelDirPickingButton>
    );
  }

  return (
    <div className={`WordGrid ${gameMode}`}>
      {tiles}
      <svg
        width={`${WG_UNITS_WIDE * unitSize}`}
        height={`${WG_UNITS_HIGH * unitSize}`}
        viewBox={`0 0 ${WG_UNITS_WIDE * unitSize} ${WG_UNITS_HIGH * unitSize}`}
        xmlns='http://www.w3.org/2000/svg'
      >
        {connectors}
      </svg>
      {directionPickers}
      {controlButtons}
    </div>
  );
};

interface WGTProps {
  wgHasErrors: boolean;
  wgTileData: WGTileData;
  className: string;
  nwTileData: NWTData;
  onClick?: () => void;
}
const WGTile = ({
  wgHasErrors,
  wgTileData,
  className,
  nwTileData,
  onClick
}: WGTProps) => {
  const unitSize = useAppSelector(selectUnitSize);

  // Left and top offsets.
  const leftOffset = useAppSelector((state) => {
    return selectLeftOffset(state, nwTileData);
  });
  const topOffset = useAppSelector((state) => {
    return selectTopOffset(state, nwTileData);
  });
  let style: CSSProperties = {
    left: `${leftOffset}${TILE_UNITS}`,
    top: `${topOffset}${TILE_UNITS}`
  };

  // Chosen tile box-shadow indicator.
  if (wgTileData?.isChosen) {
    if (wgTileData.candy) {
      style.boxShadow = `0 0 0 ${TILE_SHADOW_WIDTH * unitSize}${TILE_UNITS} ${
        wgTileData.candy.colorMain
      }80`;
    } else {
      style.border = `0 0 0 ${
        TILE_SHADOW_WIDTH * unitSize
      }${TILE_UNITS} ${COLOR_BLUE_TRANS}`;
    }
  }

  // Error, preview, and candy background colors.
  if (wgHasErrors && wgTileData.isInPreview) {
    style.backgroundColor = COLOR_RED_MAIN;
    style.color = 'white';
    style.boxShadow = `0 0 0 ${
      TILE_SHADOW_WIDTH * unitSize
    }${TILE_UNITS} ${COLOR_RED_MAIN}80`;
  } else if (wgTileData.isInPreview) {
    style.backgroundColor = COLOR_YELLOW_MAIN;
    style.color = 'black';
    style.boxShadow = `0 0 0 ${
      TILE_SHADOW_WIDTH * unitSize
    }${TILE_UNITS} ${COLOR_YELLOW_MAIN}80`;
  } else if (wgTileData.candy && wgTileData.letter) {
    style.backgroundColor = wgTileData.candy.colorMain;
    style.color = wgTileData.candy.colorText;
  }

  return (
    <NetwordsTile
      candy={wgTileData.candy}
      letter={wgTileData.previewLetter ?? wgTileData.letter}
      className={className}
      onClick={onClick}
      style={style}
    ></NetwordsTile>
  );
};
