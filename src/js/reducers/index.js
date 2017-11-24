import { combineReducers } from 'redux';
import PixelColorReducer from './reducer-pixel-color';
import PixelSizeReducer from './reducer-pixel-size';
import CanvasSetupReducer from './reducer-canvas-setup';
import CanvasClearReducer from './reducer-canvas-clear';
import CanvasContextReducer from './reducer-canvas-context';
import CssGeneratorReducer from './reducer-css-generator';
import UploadedImageReducer from './reducer-uploaded-image';
const rootReducer = combineReducers({
    defaults: CanvasSetupReducer,
    pixel_color: PixelColorReducer,
    pixel_size: PixelSizeReducer,
    canvas_clear: CanvasClearReducer,
    canvas_ctx: CanvasContextReducer,
    css_generator: CssGeneratorReducer,
    uploaded_image: UploadedImageReducer,
});

export default rootReducer;
