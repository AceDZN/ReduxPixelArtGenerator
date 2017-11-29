// state arg. is not application state - only state this reducer responsible for.
export default function(state = null, action){
    switch(action.type){
        case 'LOAD_UPLOADED_IMAGE':
            return {loading: true};
        case 'SET_UPLOADED_IMAGE':
            return {loading: true, image:action.payload};
        case 'RENDER_UPLOADED_IMAGE':
            return {loading: false, image:state.image};

        default:
            return state
    }
}
