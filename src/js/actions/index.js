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

export function populatePixelArray(pixel_array){
    return {
        type: 'POPULATE_PIXEL_ARRAY',
        payload: pixel_array
    }
}

export function addPixelToArray(pixel){
    return {
        type: 'ADD_PIXEL_TO_ARRAY',
        payload: pixel
    }
}

export function removePixelFromArray(pixel){
    return {
        type: 'REMOVE_PIXEL_FROM_ARRAY',
        payload: pixel
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

export function setCanvas(canvas_obj){
    return {
        type: 'CANVAS_DECLARED',
        payload: canvas_obj
    }
}
export function setCanvasContext(ctx){
    return {
        type: 'CANVAS_CTX',
        payload: ctx
    }
}


export function loadUploadedImage(image){
    return {
        type: 'LOAD_UPLOADED_IMAGE',
        payload: image
    }
}

export function selectTool(tool){
    return {
        type: 'TOOL_SELECTED',
        payload: tool
    }
}
