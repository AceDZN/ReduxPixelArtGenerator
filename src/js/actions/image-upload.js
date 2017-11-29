import loadImage from 'image-promise';
import {generatePixels} from './generate-pixels';


//{ctx:, pixel_size:, canvas_width:,canvas_height:,}



export function renderUploadedImage(setup){
    const data = renderImage(setup);
    return {
        type: 'RENDER_UPLOADED_IMAGE',
        payload: data
    }
}

function resizeImage(image, canvas, ctx,pixel_size){
    var imageAspectRatio = image.width / image.height;
    var canvasAspectRatio = canvas.width / canvas.height;
    var renderableHeight, renderableWidth, xStart, yStart;

    // If image's aspect ratio is less than canvas's we fit on height
    // and place the image centrally along width
    if(imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = image.width * (renderableHeight / image.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
    }

    // If image's aspect ratio is greater than canvas's we fit on width
    // and place the image centrally along height
    else if(imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width
        renderableHeight = image.height * (renderableWidth / image.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
    }

    // Happy path - keep aspect ratio
    else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
    }

    canvas.height = renderableHeight;
    ctx.imageSmoothingEnabled = false;
    //{ctx:, pixel_size:, canvas_width:,canvas_height:,}
    const can      = document.createElement('canvas'), // Not shown on page
        can_ctx      = can.getContext('2d');
        can.width  = canvas.width;
        can.height = canvas.height;

    can_ctx.drawImage(image, 0, 0, renderableWidth, renderableHeight);

    //can_ctx.drawImage( image, 0, 0, image.width, image.height );

    const setup = {
        ctx:can_ctx,
        pixel_size:pixel_size,
        canvas_width:renderableWidth,
        canvas_height:renderableHeight,
    }
    const r = generatePixels(setup);
    if(!!r.pixel_array){
        const pixel_array = r.pixel_array;
        for(var i=0; i<pixel_array.length; i++){
            const p = pixel_array[i];
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size );

        }

    }
    return r;
}

function renderImage(setup){
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
            return resizeImage(image, canvas, ctx, setup.pixel_size);
        });


    }
}
