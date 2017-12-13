import _ from 'lodash';
// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    const p = action.payload;
    const brush_size = (!!p && p.size ? p.size : 2); // current brush size
    const size = 2; // default pixel size
    const rc_count = (brush_size/2); //row/columns count
    let temp_pixels = {};
    switch(action.type){
        case 'ADD_PIXEL_TO_ARRAY':
            temp_pixels = {};
            // push the right pixels to the temporary n object
            for(var row = 0; row < rc_count; row++ ){
                for(var col = 0; col < rc_count; col++ ){
                    const x = p.x+(col * size);
                    const y = p.y+(row * size);
                    temp_pixels[`${x}_${y}`] = {x, y, size, color: p.color };
                }
            }
            //console.log(n);
            if(!state){
                return temp_pixels
            } else {
                let s = state;
                // add temp_pixels to state
                for(var k in temp_pixels){
                    s[k] = temp_pixels[k];
                }
                return  s;
            }
        case 'REMOVE_PIXEL_FROM_ARRAY':
            if(!state){
                return {}
            }

            temp_pixels = {};
            let s = state;

            // remove the right pixels from temp state object
            for(var row = 0; row < rc_count; row++ ){
                for(var col = 0; col < rc_count; col++ ){
                    const x = p.x+(col * size);
                    const y = p.y+(row * size);
                    delete s[`${x}_${y}`];
                }
            }

            return s;


            /*
            var index = _.findIndex(state, {x: p.x, y:p.y, size:p.size});
            var removeByIndex = (array, index) => array.filter((_, i) => i !== index);


            if(index !== -1){
                const s = state;
                return removeByIndex(s,index);

            } else {
                return state
            }
            */

        case 'POPULATE_PIXEL_ARRAY':
            return action.payload;
        case 'CANVAS_CLEAR':
            return {};
        case 'RENDER_UPLOADED_IMAGE':
            let r = false;
            if(!!action.payload && !!action.payload.pixel_array){
                r = action.payload.pixel_array;
            }
            return (r ? r : state)

        default:
            return state
    }
}
