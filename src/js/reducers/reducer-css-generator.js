export default function(state = null, action){
    switch(action.type){
        case 'GENERATE_PIXEL_CSS':
            return action.payload
        case 'GENERATE_PIXEL_SVG':
            return action.payload
        case 'GENERATE_PIXEL_PNG':
            return action.payload
        case 'CANVAS_CLEAR':
            return {
                box_shadow: '0 0 0 transparent',
                generated_text: ''
            }
        default:
            return state
    }
}
