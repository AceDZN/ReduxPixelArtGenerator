export function getScreenDimensions(){
    const screenSize = [window.innerWidth,window.innerHeight];
    return screenSize;
}

export function getCorrectTextColor(hex){
    if(hex=='transparent'){return "#000000"}
    const threshold = 130,
    hRed = hexToR(hex),
    hGreen = hexToG(hex),
    hBlue = hexToB(hex);

    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold){return "#000000";} else { return "#ffffff";}
}



export function getImageBoundries(ctx){
    var w = ctx.canvas.width, h = ctx.canvas.height;
    var idata = ctx.getImageData(0, 0, w, h),      // get image data for canvas
    buffer = idata.data,                       // get buffer (unnes. step)
    buffer32 = new Uint32Array(buffer.buffer), // get a 32-bit representation
    x, y,                                      // iterators
    x1 = w, y1 = h, x2 = 0, y2 = 0;            // min/max values

    // get left edge
    for(y = 0; y < h; y++) {                       // line by line
        for(x = 0; x < w; x++) {                   // 0 to width
            if (buffer32[x + y * w] > 0) {         // non-transparent pixel?
                if (x < x1) x1 = x;                // if less than current min update
            }
        }
    }
    // get right edge
    for(y = 0; y < h; y++) {                       // line by line
        for(x = w; x >= 0; x--) {                  // from width to 0
            if (buffer32[x + y * w] > 0) {
                if (x > x2) x2 = x;
            }
        }
    }
    // get top edge
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            if (buffer32[x + y * w] > 0) {
                if (y < y1) y1 = y;
            }
        }
    }

    // get bottom edge
    for(x = 0; x < w; x++) {
        for(y = h; y >= 0; y--) {
            if (buffer32[x + y * w] > 0) {
                if (y > y2) y2 = y;
            }
        }
    }

    return [x1, y1, (x1==0?10:x2-x1), y2-y1]
}
