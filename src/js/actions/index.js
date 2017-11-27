export function selectPlatform(platform){
  return {
    type: 'PLATFORM_SELECTED',
    payload: platform
  }
}

export function setPixelSize(pixel_size){
    return {
        type: 'PIXEL_SIZE_SELECTED',
        payload: pixel_size
    }
}

export function setPixelColor(pixel_color){
    return {
        type: 'PIXEL_COLOR_SELECTED',
        payload: pixel_color
    }
}
export function setCanvasDefaults(props){
    return {
        type: 'CANVAS_PROPS_SELECTED',
        payload: props
    }
}
export function setRenderPixelSize(props){
    return {
        type: 'SET_RENDER_PIXELS_DEFAULT',
        payload: props
    }
}


export function clearCanvas(clear){
    return {
        type: 'CANVAS_CLEAR',
        payload: clear
    }
}
export function setCanvasContext(ctx){
    return {
        type: 'CANVAS_CTX',
        payload: ctx
    }
}
export function generateCSSPixelArt(setup){
    return {
        type: 'GENERATE_PIXEL_CSS',
        payload: setup
    }
}
export function addToShadowArray(setup){
    return {
        type: 'ADD_TO_SHADOW_ARRAY',
        payload: setup
    }
}
export function setUploadedImage(image){
    return {
        type: 'SET_UPLOADED_IMAGE',
        payload: image
    }
}
export function loadUploadedImage(image){
    return {
        type: 'LOAD_UPLOADED_IMAGE',
        payload: image
    }
}
