// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'CANVAS_PROPS_SELECTED':
            if(action.payload.render_pixel_size){
                return action.payload.render_pixel_size;
            }
            return state
        case 'SET_RENDER_PIXELS_DEFAULT':
            return action.payload;
        default:
            return state
    }
}
