import { combineReducers } from 'redux';
import PixelColorReducer from './reducer-pixel-color';
import PixelSizeReducer from './reducer-pixel-size';
import CanvasSetupReducer from './reducer-canvas-setup';
import CanvasClearReducer from './reducer-canvas-clear';
import CanvasContextReducer from './reducer-canvas-context';
const rootReducer = combineReducers({
  pixel_color: PixelColorReducer,
  pixel_size: PixelSizeReducer,
  canvas_setup: CanvasSetupReducer,
  canvas_clear: CanvasClearReducer,
  canvas_ctx: CanvasContextReducer
});

export default rootReducer;
