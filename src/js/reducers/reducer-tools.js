// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'TOOL_SELECTED':
            return action.payload;
        default:
            return state
    }
}
