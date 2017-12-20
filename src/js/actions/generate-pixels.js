import loadImage from 'image-promise';
import { getImageBoundries } from '../utils/';

export const DEFAULT_RENDER_PIXEL_SIZE = 2;

export function makePixelsArray(setup){
    const data = generatePixels();
    return {
        type: 'GENERATE_PIXEL_ARRAY',
        payload: data
    }
}

export function generatePixelArtCss(setup){
    var data = generatePixelArt(setup, 'css');
    return {
        type: 'GENERATE_PIXEL_CSS',
        payload: data
    }
}
export function generatePixelArtSvg(setup){
    var data = generatePixelArt(setup, 'svg');
    return {
        type: 'GENERATE_PIXEL_SVG',
        payload: data
    }
}
export function generatePixelArtPng(setup){
    var data = generatePixelArt(setup, 'png');
    return {
        type: 'GENERATE_PIXEL_PNG',
        payload: data
    }
}

export function generatePixels(setup){
    if(!setup || !setup.ctx){console.log("can't generatePixels - no canvas context"); return;}

    return new Promise((resolve,reject)=>{
        var res = requestAnimationFrame(()=>{makePixels(setup);};
        resolve(res);
    });

}

function makePixels(setup){
    const size = DEFAULT_RENDER_PIXEL_SIZE;

    let pixel_array = {};
    const pixel_size = setup.pixel_size;
    const x = 0;
    const y = 0;
    const w = setup.ctx.canvas.width;
    const h = setup.ctx.canvas.height;

    let min_width = w,
    min_height = h,
    max_width = 0,
    max_height = 0;

    for (var j = x; j < (x+w); j += pixel_size) {
          for (var i = y; i < (y+h); i += pixel_size) {
        var data = setup.ctx.getImageData(j, i, pixel_size, pixel_size).data;

        if (data[0] <= 256 && data[1] <= 256 && data[2] <= 256 && data[3] != 0) {
          if ((j + pixel_size) < min_width) {
            min_width = (j + pixel_size);
          }
          if ((i + pixel_size) < min_height) {
            min_height = (i + pixel_size);
          }
          if ((j + (pixel_size * 2)) > max_width) {
            max_width = (j + (pixel_size * 2));
          }
          if ((i + (pixel_size * 2)) > max_height) {
            max_height = (i + (pixel_size * 2));
          }

          let temp_pixels = {};
          const rc_count = (pixel_size/2); //row/columns count


        const p = {
            x: (j + pixel_size),
            y: (i + pixel_size)
        };
          // push the right pixels to the temporary n object
          for(var row = 0; row < rc_count; row++ ){
              for(var col = 0; col < rc_count; col++ ){
                  const x = p.x+(col * size);
                  const y = p.y+(row * size);
                  temp_pixels[`${x}_${y}`] = {
                      x, y, size,

                      color: `#${(data[2] | (data[1] << 8) | (data[0] << 16) | (1 << 24)).toString(16).slice(1)}`
                  };
              }
          }

          for(var k in temp_pixels){
              pixel_array[k] = temp_pixels[k];
          }

        }
      }
    }
    setup.min_height = min_height;
    setup.min_width = min_width;
    setup.max_height = max_height;
    setup.max_width = max_width;
    setup.pixel_array = pixel_array;
    return setup;
}









function generatePixelArt(setup,type){
    if(!type || type == 'css'){
        return generateCSSPixelArt(setup)
    } else if(!type || type == 'svg'){
        return generateSVGPixelArt(setup)
    } else {
        return generatePNGPixelArt(setup)
    }
}


function generateCSSPixelArt(s){
    if(!s || !s.ctx){console.log("no canvas context"); return;}
    let CSSPixels = [];
    let setup = null;
    if(!!s.pixel_array){
        setup = s;
    } else {
        setup = generatePixels(s);
    }


// GET FILLED IN BOUNDRIES FOR FINAL SVG
    const boundries = getImageBoundries(setup.ctx);
    setup.boundries = {x: boundries[0], y: boundries[1], w: boundries[2], h: boundries[3]};
    let x = (setup.boundries?setup.boundries.x:0);
    let y = (setup.boundries?setup.boundries.y:0);
    let w = (setup.boundries?setup.boundries.w:setup.canvas_width);
    let h = (setup.boundries?setup.boundries.h:setup.canvas_height);

    let shadow = [];

    for(let k in setup.pixel_array){
        const pixel = setup.pixel_array[k];
        shadow.push((pixel.x-x) + 'px ' + (pixel.y-y) + 'px '+pixel.color);
    }

    const box_shadow = shadow.join(',');
    const result = {
        box_shadow: box_shadow,
        generated_text : '.pixels {\n\tdisplay: block;\n\twidth: ' + setup.pixel_size + 'px;\n'
            +'\theight: ' + setup.pixel_size + 'px;\n'
            +'\tmargin: -' + setup.min_height + 'px ' + setup.max_width + 'px ' + setup.max_height + 'px -' + setup.min_width + 'px;\n'
            +'\tbox-shadow: \n\t\t' + box_shadow + ';\n\}',
    }
    return result;
}


function generateSVGPixelArt(s){
    if(!s || !s.ctx){console.log("no canvas context"); return;}
    let svgPixels = [];
    let setup = null;
    if(!!s.pixel_array){
        setup = s;
    } else {
        setup = generatePixels(s);
    }


// GET FILLED IN BOUNDRIES FOR FINAL SVG
    const boundries = getImageBoundries(setup.ctx);
    setup.boundries = {x: boundries[0], y: boundries[1], w: boundries[2], h: boundries[3]};
    let x = (setup.boundries?setup.boundries.x:0);
    let y = (setup.boundries?setup.boundries.y:0);
    let w = (setup.boundries?setup.boundries.w:setup.canvas_width);
    let h = (setup.boundries?setup.boundries.h:setup.canvas_height);

    for(let k in setup.pixel_array){
        const pixel = setup.pixel_array[k];
        let svg_rect ='';
        if(!!s.pixel_array){
            svg_rect = ('\n\t<rect x="'+(pixel.x-x+ 0.5)+'" y="'+(pixel.y-y+ 0.5)+'" width="'+pixel.size+'" height="'+pixel.size+'" style="fill:'+pixel.color+'" />');
        } else {
            svg_rect = ('\n\t<rect x="'+(pixel.x-x+ 0.5)+'" y="'+(pixel.y-y+ 0.5)+'" width="'+setup.pixel_size+'" height="'+setup.pixel_size+'" style="fill:'+pixel.color+'" />');
        }
        svgPixels.push(svg_rect);
    }
    const svgPixels_string = svgPixels.join('');
    const result = {
        type: 'svg',
        boundries: setup.boundries,
        generated_text : '<svg width="'+w+'" height="'+h+'"  viewBox="0 0 '+w+' '+h+'">'+svgPixels_string+'</svg>',
    }
    return result;
}

function generatePNGPixelArt(s){
    const pixel_art = generateSVGPixelArt(s);
    const svg_base_img = pixel_art.generated_text;
    var can      = document.createElement('canvas'), // Not shown on page
        ctx      = can.getContext('2d'),
        loader   = new Image;                        // Not shown on page

    loader.width  = can.width  = pixel_art.boundries.w;
    loader.height = can.height = pixel_art.boundries.h;

    var tmp = document.createElement("div");
    tmp.innerHTML = svg_base_img;
    var tmp_el = tmp.children[0]; var xmlSerializer = new XMLSerializer(); var svgAsXML = xmlSerializer.serializeToString( tmp_el );
    loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );

    let result = {};

    return loadImage(loader).then(()=>{
        requestAnimationFrame(()=>{
            ctx.drawImage( loader, 0, 0, loader.width, loader.height )
        });
        pixel_art.png_to_url = can.toDataURL();
        result = {
            type: 'png',
            generated_text : '<img width="'+pixel_art.boundries.w+'" height="'+pixel_art.boundries.h+'" src="'+pixel_art.png_to_url+'" />',
            png_image: pixel_art.png_to_url
        }
        return result;
    });
}
