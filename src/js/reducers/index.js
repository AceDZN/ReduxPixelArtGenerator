import { combineReducers } from 'redux';
import PixelColorReducer from './reducer-pixel-color';
import PixelSizeReducer from './reducer-pixel-size';
import RenderPixelSizeReducer from './reducer-render-size';
import CanvasSetupReducer from './reducer-canvas-setup';
import CanvasClearReducer from './reducer-canvas-clear';
import CanvasContextReducer from './reducer-canvas-context';
import CssGeneratorReducer from './reducer-css-generator';
import UploadedImageReducer from './reducer-uploaded-image';
import PixelCanvasReducer from './pixel-canvas-reducer';
const rootReducer = combineReducers({
    defaults: CanvasSetupReducer,
    pixel_color: PixelColorReducer,
    pixel_size: PixelSizeReducer,
    render_pixel_size: RenderPixelSizeReducer,
    canvas_clear: CanvasClearReducer,
    canvas_ctx: CanvasContextReducer,
    css_generator: CssGeneratorReducer,
    uploaded_image: UploadedImageReducer,
    pixel_canvas: PixelCanvasReducer,
});

export default rootReducer;
