// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'CANVAS_PROPS_SELECTED':
            return action.payload;
        case 'SET_RENDER_PIXELS_DEFAULT':
            var res = state;
            res.render_pixel_size = action.payload;
            return res;
        default:
            return state
    }
}
