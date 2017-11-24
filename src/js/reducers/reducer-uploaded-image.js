// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'LOAD_UPLOADED_IMAGE':
            return "Loading";
        case 'SET_UPLOADED_IMAGE':
            return action.payload;
        default:
            return state
    }
}
