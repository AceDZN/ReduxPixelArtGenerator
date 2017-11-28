import loadImage from 'image-promise';


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



function generatePixels(setup){
    if(!setup || !setup.ctx){console.log("can't generatePixels - no canvas context"); return;}
    let pixels = [];
    const pixel_size = setup.pixel_size;
    //const pixel_color = setup.pixel_color;

    let min_width = setup.canvas_width,
    min_height = setup.canvas_height,
    max_width = 0,
    max_height = 0;
    for (var i = 0; i < setup.canvas_height; i += pixel_size) {
      for (var j = 0; j < setup.canvas_width; j += pixel_size) {
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
          pixels.push({
              x: (j + pixel_size),
              y: (i + pixel_size),
              color: '#' + (data[2] | (data[1] << 8) | (data[0] << 16) | (1 << 24)).toString(16).slice(1),
          })
        }
      }
    }
    setup.min_height = min_height;
    setup.min_width = min_width;
    setup.max_height = max_height;
    setup.max_width = max_width;
    setup.pixels = pixels;
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
    let shadow = [];
    const setup = generatePixels(s);
    for(var i=0; i<setup.pixels.length; i++){
        var pixel = setup.pixels[i];
        shadow.push(pixel.x + 'px ' + pixel.y + 'px '+pixel.color);
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
    const setup = generatePixels(s);
    for(var i=0; i<setup.pixels.length; i++){
        const pixel = setup.pixels[i];
        const svg_rect = ('\n\t<rect x="'+pixel.x+'" y="'+pixel.y+'" width="'+setup.pixel_size+'" height="'+setup.pixel_size+'" style="fill:'+pixel.color+'" />');
        //pixel.x + 'px ' + pixel.y + 'px '+pixel.color
        svgPixels.push(svg_rect);
    }
    const svgPixels_string = svgPixels.join('');
    const result = {
        type: 'svg',
        generated_text : '<svg width="'+setup.canvas_width+'" height="'+setup.canvas_height+'">'+svgPixels_string+'</svg>',
    }
    return result;
}

function generatePNGPixelArt(s){
    if(!s || !s.ctx){console.log("no canvas context"); return;}
    let svgPixels = [];
    const setup = generatePixels(s);
    for(var i=0; i<setup.pixels.length; i++){
        const pixel = setup.pixels[i];
        const svg_rect = ('\n\t<rect x="'+pixel.x+'" y="'+pixel.y+'" width="'+setup.pixel_size+'" height="'+setup.pixel_size+'" style="fill:'+pixel.color+'" ></rect>');
        //pixel.x + 'px ' + pixel.y + 'px '+pixel.color
        svgPixels.push(svg_rect);
    }
    const svgPixels_string = svgPixels.join('');
    const svg_base_img = '<svg width="'+setup.canvas_width+'" height="'+setup.canvas_height+'">'+svgPixels_string+'</svg>';
    var tgtImage = document.querySelector('#png_img'),      // Where to draw the result
        can      = document.createElement('canvas'), // Not shown on page
        ctx      = can.getContext('2d'),
        loader   = new Image;                        // Not shown on page

    loader.width  = can.width  = setup.canvas_width;
    loader.height = can.height = setup.canvas_height;

    var tmp = document.createElement("div");
    tmp.innerHTML = svg_base_img;
    var tmp_el = tmp.children[0]; var xmlSerializer = new XMLSerializer(); var svgAsXML = xmlSerializer.serializeToString( tmp_el );
    loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );

    let result = {};

    return loadImage(loader).then(()=>{
        ctx.drawImage( loader, 0, 0, loader.width, loader.height );
        setup.png_to_url = can.toDataURL();
        result = {
            type: 'png',
            generated_text : '<img width="'+setup.canvas_width+'" height="'+setup.canvas_height+'" src="'+setup.png_to_url+'" />',
            png_image: setup.png_to_url
        }
        return result;
    });
}
