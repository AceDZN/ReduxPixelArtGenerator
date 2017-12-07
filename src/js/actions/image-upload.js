import loadImage from 'image-promise';
import {generatePixels} from './generate-pixels';

export function renderUploadedImage(setup){
    /*
    return (dispatch) => {
        renderImage(setup,dispatch);
    };
    */
    //const data = renderImage(setup);
    return {
        type: 'RENDER_UPLOADED_IMAGE',
        payload: setup
    }
}

export function setUploadedImage(setup){
    if(!setup.uploaded_image) return

    return (dispatch) => {
        renderImage(setup,dispatch);
    };



    return {
        type: 'SET_UPLOADED_IMAGE',
        payload: image
    }
}
function resizeImage(setup,image,dispatch){

    var imageAspectRatio = image.width / image.height;
    var canvasAspectRatio = setup.canvas.width / setup.canvas.height;
    var renderableHeight, renderableWidth, xStart, yStart;

    // If image's aspect ratio is less than canvas's we fit on height
    // and place the image centrally along width
    if(imageAspectRatio < canvasAspectRatio) {
        renderableHeight = setup.canvas.height;
        renderableWidth = image.width * (renderableHeight / image.height);
        xStart = (setup.canvas.width - renderableWidth) / 2;
        yStart = 0;
    }

    // If image's aspect ratio is greater than canvas's we fit on width
    // and place the image centrally along height
    else if(imageAspectRatio > canvasAspectRatio) {
        renderableWidth = setup.canvas.width
        renderableHeight = image.height * (renderableWidth / image.width);
        xStart = 0;
        yStart = (setup.canvas.height - renderableHeight) / 2;
    }

    // Happy path - keep aspect ratio
    else {
        renderableHeight = setup.canvas.height;
        renderableWidth = setup.canvas.width;
        xStart = 0;
        yStart = 0;
    }


    //{ctx:, pixel_size:, canvas_width:,canvas_height:,}
    const can      = document.createElement('canvas'), // Not shown on page
        can_ctx      = can.getContext('2d');
        can.width  = setup.canvas.width;
        can.height = setup.canvas.height;

    //setup.canvas.height = renderableHeight;
    setup.ctx.imageSmoothingEnabled = false;

    can_ctx.drawImage(image, 0, 0, renderableWidth, renderableHeight);

    //can_ctx.drawImage( image, 0, 0, image.width, image.height );

    const temp_set = {
        can: can,
        ctx: can_ctx,
        pixel_size:setup.pixel_size,
        canvas_width:renderableWidth,
        canvas_height:renderableHeight,
    }
    //setup.ctx.drawImage(image, 0, 0, renderableWidth, renderableHeight);
    const r = generatePixels(temp_set);
    if(!!r.pixel_array){
        const pixel_array = r.pixel_array;
        for(var i=0; i<pixel_array.length; i++){
            const p = pixel_array[i];
            setup.ctx.fillStyle = p.color;
            setup.ctx.fillRect(p.x, p.y, p.size, p.size );

        }

    }
    dispatch(renderUploadedImage(r));
}

function renderImage(setup,dispatch){
    const canvas = setup.canvas,
    ctx = setup.ctx,
    canvas_width = setup.canvas_width,
    canvas_height = setup.canvas_height;
    const uploaded_image = setup.uploaded_image;

    if(!uploaded_image || uploaded_image == '') return;

    const imageStyle = {
        width:canvas_width,
        height:canvas_height,
    };
    if(uploaded_image == "Loading"){
        return "Loading";
    } else {
        var image = new Image();
        image.src = uploaded_image;

        return loadImage(image).then(()=>{

            resizeImage(setup,image,dispatch);
        });


    }
}
