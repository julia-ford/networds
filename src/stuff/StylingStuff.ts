export const WG_HEIGHT = 9;
export const WG_WIDTH = 9;

export const TILE_DIAMETER = 5;
export const TILE_MARGIN = 0.5;
export const TILE_SHADOW_WIDTH = 0.5;
export const TILE_FONT_SIZE = (TILE_DIAMETER * 2) / 3;
export const TILE_UNITS = 'vh';

export const ODD_ROW_OFFSET = TILE_DIAMETER / 2 + TILE_MARGIN / 2;

export const COLOR_GRAY_MAIN = '#f8f9fa';
export const COLOR_GRAY_FOCUS = '#e2e6ea';
export const COLOR_BLUE_MAIN = '#007bff';
export const COLOR_BLUE_FOCUS = '#0069d9';
export const COLOR_BLUE_TRANS = COLOR_BLUE_MAIN + '80';
export const COLOR_RED_MAIN = '#dc3545';
export const COLOR_YELLOW_MAIN = '#ffc107';
export const COLOR_GREEN_MAIN = '#28a745';
export const COLOR_PINK_MAIN = '#ec407a';
export const COLOR_PINK_FOCUS = '#e91e63';
export const COLOR_PINK_TRANS = COLOR_PINK_MAIN + '80';
export const COLOR_PURPLE_MAIN = '#9c27b0';

document.documentElement.style.setProperty(
  '--tile-diam',
  `${TILE_DIAMETER}${TILE_UNITS}`
);
document.documentElement.style.setProperty(
  '--tile-margin',
  `${TILE_MARGIN}${TILE_UNITS}`
);
document.documentElement.style.setProperty(
  '--tile-font-size',
  `${TILE_FONT_SIZE}${TILE_UNITS}`
);
document.documentElement.style.setProperty(
  '--tile-shadow-width',
  `${TILE_SHADOW_WIDTH}${TILE_UNITS}`
);

document.documentElement.style.setProperty('--word-grid-width', `${WG_WIDTH}`);
document.documentElement.style.setProperty(
  '--word-grid-height',
  `${WG_HEIGHT}`
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
  '--color-gray-main',
  `${COLOR_GRAY_MAIN}`
);
document.documentElement.style.setProperty(
  '--color-gray-focus',
  `${COLOR_GRAY_FOCUS}`
);

window.addEventListener('resize', () => {
  const winH = window.innerHeight;
  const winW = window.innerWidth;
});
