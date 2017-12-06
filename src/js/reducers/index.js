import { combineReducers } from 'redux';
import PixelColorReducer from './reducer-pixel-color';
import PixelSizeReducer from './reducer-pixel-size';
import RenderPixelSizeReducer from './reducer-render-size';
import CanvasSetupReducer from './reducer-canvas-setup';
import CanvasClearReducer from './reducer-canvas-clear';
import CanvasContextReducer from './reducer-canvas-context';
import CanvasObjectReducer from './reducer-canvas-object';
import ColorSchemesReducer from './reducer-color-schemes';

import CssGeneratorReducer from './reducer-css-generator';
import UploadedImageReducer from './reducer-uploaded-image';
import PixelCanvasReducer from './pixel-canvas-reducer';
import PixelArrayReducer from './reducer-pixel-array';

const rootReducer = combineReducers({
    default_props: CanvasSetupReducer,
    pixel_color: PixelColorReducer,
    pixel_size: PixelSizeReducer,
    render_pixel_size: RenderPixelSizeReducer,
    canvas_clear: CanvasClearReducer,
    canvas_ctx: CanvasContextReducer,
    canvas_obj: CanvasObjectReducer,
    css_generator: CssGeneratorReducer,
    uploaded_image: UploadedImageReducer,
    pixel_canvas: PixelCanvasReducer,
    pixel_array: PixelArrayReducer,
    color_schemes: ColorSchemesReducer,
});

export default rootReducer;
