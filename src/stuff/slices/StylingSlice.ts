import {
  createSelector,
  createSlice,
  SliceCaseReducers
} from '@reduxjs/toolkit';

import { RootState } from '../store';
import { Directions, NWTData } from '../Shared';

/** The diameter of a NetwordsTile in Networds units. */
export const TILE_DIAMETER = 5;
export const TILE_MARGIN_HORZ = 0.5;
export const TILE_MARGIN_VERT = -0.4;
export const TILE_SHADOW_WIDTH = 0.5;
export const TILE_FONT_SIZE = (TILE_DIAMETER * 2) / 3;
export const TILE_UNITS = 'px';

/** Width of the margin between components in Networds units. */
export const COMPONENT_MARGIN = 1;

/** The extra left offset that odd-numbered rows get, in Networds units. */
export const ODD_ROW_OFFSET = TILE_DIAMETER / 2 + TILE_MARGIN_HORZ / 2;

// Word Grid
export const WG_TILES_WIDE = 9;
export const WG_TILES_HIGH = 9;
export const WG_UNITS_WIDE =
  ODD_ROW_OFFSET +
  WG_TILES_WIDE * TILE_DIAMETER +
  (WG_TILES_WIDE - 1) * TILE_MARGIN_HORZ;
export const WG_UNITS_HIGH =
  WG_TILES_HIGH * TILE_DIAMETER + (WG_TILES_HIGH - 1) * TILE_MARGIN_VERT;

// Found Words List
export const FWL_TILES_WIDE = Math.max(WG_TILES_WIDE, WG_TILES_HIGH);
export const FWL_TILES_HIGH = WG_TILES_HIGH;
export const FWL_UNITS_WIDE =
  FWL_TILES_WIDE * TILE_DIAMETER + (FWL_TILES_WIDE - 1) * TILE_MARGIN_HORZ;
export const FWL_UNITS_HIGH =
  FWL_TILES_HIGH * TILE_DIAMETER + (FWL_TILES_HIGH - 1) * TILE_MARGIN_VERT;

// Placement Control Buttons
/** PCBRow width in Networds units. */
export const PCBR_UNITS_WIDE = TILE_DIAMETER * 3 + TILE_MARGIN_HORZ * 2;
/** PlacementControlButton diameter in Networds units. */
export const PCB_UNITS_DIAM =
  (PCBR_UNITS_WIDE - TILE_MARGIN_HORZ * 3 - COMPONENT_MARGIN * 2) / 4;
/** PlacementControlButton font size in Networds units. */
export const PCB_FONT_SIZE = (PCB_UNITS_DIAM * 2) / 3;
/** PCBRow height in Networds units. */
export const PCBR_UNITS_HIGH = PCB_UNITS_DIAM + COMPONENT_MARGIN * 2;

// Calculated dimensions for the whole app layout.
export const SCREEN_UNITS_TALL_SANS_HEADER =
  COMPONENT_MARGIN +
  TILE_DIAMETER +
  TILE_MARGIN_VERT +
  WG_UNITS_HIGH +
  COMPONENT_MARGIN +
  WG_UNITS_HIGH +
  COMPONENT_MARGIN;
export const SCREEN_UNITS_TALL = SCREEN_UNITS_TALL_SANS_HEADER + TILE_DIAMETER;
export const SCREEN_UNITS_WIDE_MOBILE =
  WG_UNITS_WIDE + 2 * TILE_DIAMETER + 2 * TILE_MARGIN_HORZ;
export const SCREEN_UNITS_WIDE_DESK = WG_UNITS_WIDE * 2 + 3 * COMPONENT_MARGIN;
export const MOBILE_WH_RATIO = SCREEN_UNITS_WIDE_MOBILE / SCREEN_UNITS_TALL;
export const DESK_WH_RATIO = SCREEN_UNITS_WIDE_DESK / SCREEN_UNITS_TALL;

// Letter Cloud
export const LC_TILES_DIAM = 5;
export const LC_UNITS_HIGH = WG_UNITS_HIGH - TILE_DIAMETER - COMPONENT_MARGIN;

export const LCTILE_UNITS_DIAM =
  (LC_UNITS_HIGH - (LC_TILES_DIAM - 1) * TILE_MARGIN_VERT) / LC_TILES_DIAM;
export const LCTILE_UNITS_FONT = (LCTILE_UNITS_DIAM * 2) / 3;

export const LC_UNITS_WIDE =
  LC_TILES_DIAM * LCTILE_UNITS_DIAM + (LC_TILES_DIAM - 1) * TILE_MARGIN_HORZ;
export const LC_ODD_ROW_OFFSET = LCTILE_UNITS_DIAM / 2 + TILE_MARGIN_HORZ / 2;

export const COLOR_GRAY_MAIN = '#f8f9fa';
export const COLOR_GRAY_FOCUS = '#e2e6ea';
export const COLOR_BLUE_MAIN = '#007bff';
export const COLOR_BLUE_FOCUS = '#0069d9';
export const COLOR_BLUE_DARK = '#00579b';
export const COLOR_BLUE_TRANS = COLOR_BLUE_MAIN + '80';
export const COLOR_BLUE_INVIS = COLOR_BLUE_MAIN + '00';
export const COLOR_RED_MAIN = '#dc3545';
export const COLOR_RED_FOCUS = '#c82333';
export const COLOR_YELLOW_MAIN = '#ffc107';
export const COLOR_YELLOW_FOCUS = '#e0a800';
export const COLOR_GREEN_MAIN = '#28a745';
export const COLOR_GREEN_FOCUS = '#218838';
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
    `${PCB_UNITS_DIAM * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--pcb-font-size',
    `${PCB_FONT_SIZE * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--pcbr-width',
    `${PCBR_UNITS_WIDE * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--pcbr-height',
    `${PCBR_UNITS_HIGH * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                              Word Grid                                  //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--wg-draw-width',
    `${WG_UNITS_WIDE * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--wg-draw-height',
    `${WG_UNITS_HIGH * unitSize}${TILE_UNITS}`
  );

  /////////////////////////////////////////////////////////////////////////////
  //                            Letter Cloud                                 //
  /////////////////////////////////////////////////////////////////////////////
  document.documentElement.style.setProperty(
    '--lc-tile-diam',
    `${LCTILE_UNITS_DIAM * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--lc-font-size',
    `${LCTILE_UNITS_FONT * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--lc-draw-width',
    `${LC_UNITS_WIDE * unitSize}${TILE_UNITS}`
  );
  document.documentElement.style.setProperty(
    '--lc-draw-height',
    `${LC_UNITS_HIGH * unitSize}${TILE_UNITS}`
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

const calcIsMobileSized = () => {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const winRatio = winW / winH;

  if (winRatio >= DESK_WH_RATIO) {
    return false;
  }
  // TODO: probably want to be more permissive than this for destop view, but idk.
  return true;
};

interface StylingState {
  unitSize: number;
  isMobileSized: boolean;
}
const stylingSlice = createSlice<StylingState, SliceCaseReducers<StylingState>>(
  {
    name: 'styling',
    initialState: {
      unitSize: calcUnitSize(),
      isMobileSized: calcIsMobileSized()
    },
    reducers: {
      updateUnitSize: (state) => {
        state.unitSize = calcUnitSize();
        state.isMobileSized = calcIsMobileSized();
      },
      updateIsMobileSized: (state) => {
        state.isMobileSized = calcIsMobileSized();
      }
    }
  }
);

///////////////////////////////////////////////////////////////////////////////
//                                 Colors                                    //
///////////////////////////////////////////////////////////////////////////////
document.documentElement.style.setProperty(
  '--color-gray-main',
  `${COLOR_GRAY_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-gray-focus',
  `${COLOR_GRAY_FOCUS}`
);
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
  '--color-blue-invis',
  `${COLOR_BLUE_INVIS}`
);
document.documentElement.style.setProperty(
  '--color-red-main',
  `${COLOR_RED_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-red-focus',
  `${COLOR_RED_FOCUS}`
);
document.documentElement.style.setProperty(
  '--color-yellow-main',
  `${COLOR_YELLOW_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-yellow-focus',
  `${COLOR_YELLOW_FOCUS}`
);
document.documentElement.style.setProperty(
  '--color-green-main',
  `${COLOR_GREEN_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-green-focus',
  `${COLOR_GREEN_FOCUS}`
);
document.documentElement.style.setProperty(
  '--color-purple-main',
  `${COLOR_PURPLE_MAIN}`
);

export const selectUnitSize = (state: RootState) => {
  return state.styling.unitSize;
};

export const selectIsMobileSized = (state: RootState) => {
  return state.styling.isMobileSized;
};

export const selectHalfTilePixels = createSelector(
  [selectUnitSize],
  (unitSize) => (TILE_DIAMETER * unitSize) / 2
);

export const selectHalfLCTilePixels = createSelector(
  [selectUnitSize],
  (unitSize) => (LCTILE_UNITS_DIAM * unitSize) / 2
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

export const selectLeftOffsetForWGConnector = createSelector(
  [selectLeftOffset, selectHalfTilePixels],
  (baseLeftOffset, halfTilePixels) => baseLeftOffset + halfTilePixels
);

export const selectTopOffsetForWGConnector = createSelector(
  [selectTopOffset, selectHalfTilePixels],
  (baseTopOffset, halfTilePixels) => baseTopOffset + halfTilePixels
);

export const selectLeftOffsetForLCTile = createSelector(
  [selectUnitSize, selectTileData],
  (unitSize, tileData) => {
    return (
      tileData.col * (LCTILE_UNITS_DIAM + TILE_MARGIN_HORZ) * unitSize +
      (tileData.row % 2 === 1 ? LC_ODD_ROW_OFFSET * unitSize : 0)
    );
  }
);

export const selectTopOffsetForLCTile = createSelector(
  [selectUnitSize, selectTileData],
  (unitSize, tileData) => {
    return tileData.row * (LCTILE_UNITS_DIAM + TILE_MARGIN_VERT) * unitSize;
  }
);

export const selectLeftOffsetForLCConnector = createSelector(
  [selectLeftOffsetForLCTile, selectHalfLCTilePixels],
  (baseLeftOffset, halfTilePixels) => baseLeftOffset + halfTilePixels
);

export const selectTopOffsetForLCConnector = createSelector(
  [selectTopOffsetForLCTile, selectHalfLCTilePixels],
  (baseTopOffset, halfTilePixels) => baseTopOffset + halfTilePixels
);

export const { updateUnitSize, updateIsMobileSized } = stylingSlice.actions;

export default stylingSlice.reducer;
