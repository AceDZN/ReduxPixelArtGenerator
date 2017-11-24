// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'CANVAS_PROPS_SELECTED':
            console.log('CANVAS_PROPS_SELECTED');
            return action.payload;
        default:
            return state
    }
}
