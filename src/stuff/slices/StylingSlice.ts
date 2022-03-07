import React from 'react';

import {
  createSelector,
  createSlice,
  SliceCaseReducers
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { Directions, NWTData } from '../Shared';

export const TILE_DIAMETER = 5;
export const TILE_MARGIN_HORZ = 0.4;
export const TILE_MARGIN_VERT = -0.2;
export const TILE_SHADOW_WIDTH = 0.5;
export const TILE_FONT_SIZE = (TILE_DIAMETER * 2) / 3;
export const TILE_UNITS = 'px';

export const PCB_DIAMETER = (TILE_DIAMETER * 2) / 3;
export const PCB_MARGIN = (TILE_DIAMETER - PCB_DIAMETER) / 2;

export const COMPONENT_MARGIN = 1;

export const ODD_ROW_OFFSET = TILE_DIAMETER / 2 + TILE_MARGIN_HORZ / 2;

export const WG_TILE_WIDTH = 9;
export const WG_TILE_HEIGHT = 9;
export const WG_DRAW_WIDTH =
  ODD_ROW_OFFSET +
  WG_TILE_WIDTH * TILE_DIAMETER +
  (WG_TILE_WIDTH - 1) * TILE_MARGIN_HORZ;
export const WG_DRAW_HEIGHT =
  WG_TILE_HEIGHT * TILE_DIAMETER + (WG_TILE_HEIGHT - 1) * TILE_MARGIN_VERT;

export const LC_TILE_DIAM = 5;
export const LC_DRAW_WIDTH =
  LC_TILE_DIAM * TILE_DIAMETER + (LC_TILE_DIAM - 1) * TILE_MARGIN_HORZ;
export const LC_DRAW_HEIGHT =
  LC_TILE_DIAM * TILE_DIAMETER + (LC_TILE_DIAM - 1) * TILE_MARGIN_VERT;

export const FWL_TILE_WIDTH = Math.max(WG_TILE_WIDTH, WG_TILE_HEIGHT);
export const FWL_TILE_HEIGHT = WG_TILE_HEIGHT;
export const FWL_DRAW_WIDTH =
  FWL_TILE_WIDTH * TILE_DIAMETER + (FWL_TILE_WIDTH - 1) * TILE_MARGIN_HORZ;
export const FWL_DRAW_HEIGHT =
  FWL_TILE_HEIGHT * TILE_DIAMETER + (FWL_TILE_HEIGHT - 1) * TILE_MARGIN_VERT;

export const SCREEN_UNITS_TALL_SANS_HEADER =
  COMPONENT_MARGIN +
  TILE_DIAMETER +
  TILE_MARGIN_VERT +
  WG_DRAW_HEIGHT +
  COMPONENT_MARGIN +
  WG_DRAW_HEIGHT +
  COMPONENT_MARGIN;
export const SCREEN_UNITS_TALL = SCREEN_UNITS_TALL_SANS_HEADER + TILE_DIAMETER;
export const SCREEN_UNITS_WIDE_MOBILE = WG_DRAW_WIDTH + 2 * COMPONENT_MARGIN;
export const SCREEN_UNITS_WIDE_DESK = WG_DRAW_WIDTH * 2 + 3 * COMPONENT_MARGIN;
export const MOBILE_WH_RATIO = SCREEN_UNITS_WIDE_MOBILE / SCREEN_UNITS_TALL;
export const DESK_WH_RATIO = SCREEN_UNITS_WIDE_DESK / SCREEN_UNITS_TALL;

export const COLOR_GRAY_MAIN = '#f8f9fa';
export const COLOR_GRAY_FOCUS = '#e2e6ea';
export const COLOR_BLUE_MAIN = '#007bff';
export const COLOR_BLUE_FOCUS = '#0069d9';
export const COLOR_BLUE_TRANS = COLOR_BLUE_MAIN + '80';
export const COLOR_RED_MAIN = '#dc3545';
export const COLOR_YELLOW_MAIN = '#ffc107';
export const COLOR_GREEN_MAIN = '#28a745';
export const COLOR_GREEN_FOCUS = '#00a700';
export const COLOR_PINK_MAIN = '#ec407a';
export const COLOR_PINK_FOCUS = '#e91e63';
export const COLOR_PINK_TRANS = COLOR_PINK_MAIN + '80';
export const COLOR_PURPLE_MAIN = '#9c27b0';

const calcUnitSize = () => {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const winRatio = winW / winH;
  let unitSize: number;
  if (winRatio < MOBILE_WH_RATIO) {
    //Width Limited
    unitSize = winW / SCREEN_UNITS_WIDE_MOBILE;
  } else {
    //Height Limited
    unitSize = winH / SCREEN_UNITS_TALL;
  }

  /////////////////////////////////////////////////////////////////////////////
  //                             Tile Props                                  //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--tile-diam',
    `${TILE_DIAMETER * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--tile-margin-horz',
    `${TILE_MARGIN_HORZ * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--tile-margin-vert',
    `${TILE_MARGIN_VERT * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--tile-font-size',
    `${TILE_FONT_SIZE * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--tile-shadow-width',
    `${TILE_SHADOW_WIDTH * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                     Placement Control Button Props                      //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--pcb-diam',
    `${PCB_DIAMETER * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--pcb-margin',
    `${PCB_MARGIN * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                              Word Grid                                  //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--wg-draw-width',
    `${WG_DRAW_WIDTH * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--wg-draw-height',
    `${WG_DRAW_HEIGHT * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                            Letter Cloud                                 //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--lc-draw-width',
    `${LC_DRAW_WIDTH * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--lc-draw-height',
    `${LC_DRAW_HEIGHT * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                                 Misc                                    //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--component-margin',
    `${COMPONENT_MARGIN * unitSize}${TILE_UNITS}`
  );

  document.documentElement.style.setProperty(
    '--nw-max-height',
    `${window.innerHeight}px`
  );
  document.documentElement.style.setProperty(
    '--nw-max-height-sans-header',
    `${window.innerHeight - TILE_DIAMETER * unitSize}${TILE_UNITS}`
  );

  return unitSize;
};

interface StylingState {
  unitSize: number;
}
const stylingSlice = createSlice<StylingState, SliceCaseReducers<StylingState>>(
  {
    name: 'styling',
    initialState: {
      unitSize: calcUnitSize()
    },
    reducers: {
      updateUnitSize: (state) => {
        state.unitSize = calcUnitSize();
      }
    }
  }
);

///////////////////////////////////////////////////////////////////////////////
//                                 Colors                                    //
///////////////////////////////////////////////////////////////////////////////
document.documentElement.style.setProperty(
  '--color-blue-main',
  `${COLOR_BLUE_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-blue-focus',
  `${COLOR_BLUE_FOCUS}`
);
document.documentElement.style.setProperty(
  '--color-blue-trans',
  `${COLOR_BLUE_TRANS}`
);
document.documentElement.style.setProperty(
  '--color-gray-main',
  `${COLOR_GRAY_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-gray-focus',
  `${COLOR_GRAY_FOCUS}`
);
document.documentElement.style.setProperty(
  '--color-green-main',
  `${COLOR_GREEN_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-green-focus',
  `${COLOR_GREEN_FOCUS}`
);

export const selectUnitSize = (state: RootState) => {
  return state.styling.unitSize;
};

export const selectHalfTilePixels = createSelector(
  [selectUnitSize],
  (unitSize) => (TILE_DIAMETER * unitSize) / 2
);

const selectTileData = (state: RootState, tileData: NWTData) => {
  return tileData;
};

const selectDirection = (
  _state: RootState,
  _tileData: NWTData,
  direction: Directions
) => {
  return direction;
};

export const selectLeftOffset = createSelector(
  [selectUnitSize, selectTileData],
  (unitSize, tileData) => {
    return (
      tileData.col * (TILE_DIAMETER + TILE_MARGIN_HORZ) * unitSize +
      (tileData.row % 2 === 1 ? ODD_ROW_OFFSET * unitSize : 0)
    );
  }
);

export const selectTopOffset = createSelector(
  [selectUnitSize, selectTileData],
  (unitSize, tileData) => {
    return tileData.row * (TILE_DIAMETER + TILE_MARGIN_VERT) * unitSize;
  }
);

export const selectLeftOffsetForDirPicker = createSelector(
  [selectUnitSize, selectLeftOffset, selectDirection],
  (unitSize, baseLeftOffset, direction) => {
    let leftOffset = baseLeftOffset;
    switch (direction) {
      case Directions.East:
        leftOffset += (TILE_MARGIN_HORZ + TILE_DIAMETER) * unitSize;
        break;
      case Directions.West:
        leftOffset -= (TILE_MARGIN_HORZ + TILE_DIAMETER) * unitSize;
        break;
      case Directions.Northeast:
        leftOffset += ODD_ROW_OFFSET * unitSize;
        break;
      case Directions.Southeast:
        leftOffset += ODD_ROW_OFFSET * unitSize;
        break;
      case Directions.Northwest:
        leftOffset -= ODD_ROW_OFFSET * unitSize;
        break;
      case Directions.Southwest:
        leftOffset -= ODD_ROW_OFFSET * unitSize;
        break;
    }
    return leftOffset;
  }
);

export const selectTopOffsetForDirPicker = createSelector(
  [selectUnitSize, selectTopOffset, selectDirection],
  (unitSize, baseTopOffset, direction) => {
    let topOffset = baseTopOffset;
    switch (direction) {
      case Directions.East:
        break;
      case Directions.West:
        break;
      case Directions.Northeast:
        topOffset -= (TILE_MARGIN_VERT + TILE_DIAMETER) * unitSize;
        break;
      case Directions.Southeast:
        topOffset += (TILE_MARGIN_VERT + TILE_DIAMETER) * unitSize;
        break;
      case Directions.Northwest:
        topOffset -= (TILE_MARGIN_VERT + TILE_DIAMETER) * unitSize;
        break;
      case Directions.Southwest:
        topOffset += (TILE_MARGIN_VERT + TILE_DIAMETER) * unitSize;
        break;
    }
    return topOffset;
  }
);

export const selectLeftOffsetForConnector = createSelector(
  [selectLeftOffset, selectHalfTilePixels],
  (baseLeftOffset, halfTilePixels) => baseLeftOffset + halfTilePixels
);

export const selectTopOffsetForConnector = createSelector(
  [selectTopOffset, selectHalfTilePixels],
  (baseTopOffset, halfTilePixels) => baseTopOffset + halfTilePixels
);

export const selectIsMobileSized = createSelector([selectUnitSize], () => {
  // Dependency on selectUnitSize forces update whenever unit size changes.
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const winRatio = winW / winH;

  if (winRatio >= DESK_WH_RATIO) {
    return false;
  }
  // TODO: probably want to be more permissive than this for destop view, but idk.
  return true;
});

export const { updateUnitSize } = stylingSlice.actions;

export default stylingSlice.reducer;
