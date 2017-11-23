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
export function setCanvasSize(width,height){
    return {
        type: 'CANVAS_SIZE_SELECTED',
        payload: {width,height}
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
