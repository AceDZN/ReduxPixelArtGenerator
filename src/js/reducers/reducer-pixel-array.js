import _ from 'lodash';
// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    const p = action.payload;
    switch(action.type){
        case 'ADD_PIXEL_TO_ARRAY':
            let n = [];

            n.push(p);
            if(!state){
                return n
            } else {
                // Find item index using _.findIndex (thanks @AJ Richardson for comment)
                var index = _.findIndex(state, {x: p.x, y:p.y, size:p.size});
                let s = state;
                if(index !== -1){
                    s[index] = p;
                    return s;
                }

                return  state.concat(n);
            }
        case 'REMOVE_PIXEL_FROM_ARRAY':
            if(!state){
                return []
            }
            var index = _.findIndex(state, {x: p.x, y:p.y, size:p.size});
            var removeByIndex = (array, index) => array.filter((_, i) => i !== index);


            if(index !== -1){
                const s = state;
                return removeByIndex(s,index);

            } else {
                return state
            }

        case 'POPULATE_PIXEL_ARRAY':
            return action.payload;
        case 'CANVAS_CLEAR':
            return [];
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
