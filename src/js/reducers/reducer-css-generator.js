function generateCSSPixelArt(setup){
    if(!setup || !setup.ctx){console.log("no canvas context"); return;}
    const pixel_size = setup.pixel_size;
    //const pixel_color = setup.pixel_color;

    let shadow = [],
    min_width = setup.canvas_width,
    min_height = setup.canvas_height,
    max_width = 0,
    max_height = 0;


    for (var i = 0; i < setup.canvas_height; i += pixel_size) {
      for (var j = 0; j < setup.canvas_width; j += pixel_size) {
        var data = setup.ctx.canvas.getImageData(j, i, pixel_size, pixel_size).data;
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
          /*
          if(data[0]==141 ||  data[1]==141 || data[2]==141){
              shadow.push((j + pixel_size) + 'px ' + (i + pixel_size) + 'px transparent');
          } else {
              shadow.push((j + pixel_size) + 'px ' + (i + pixel_size) + 'px #' + (data[2] | (data[1] << 8) | (data[0] << 16) | (1 << 24)).toString(16).slice(1));
          }
          */
          shadow.push((j + pixel_size) + 'px ' + (i + pixel_size) + 'px #' + (data[2] | (data[1] << 8) | (data[0] << 16) | (1 << 24)).toString(16).slice(1));
        }
      }
    }
    const box_shadow = shadow.join(',');

    const result = {
        box_shadow: box_shadow,
        css_pixel_text : '.pixels {\n\tdisplay: block;\n\twidth: ' + pixel_size + 'px;\n\theight: ' + pixel_size + 'px;\n\tmargin: -' + min_height + 'px ' + max_width + 'px ' + max_height + 'px -' + min_width + 'px;\n\tbox-shadow: \n\t\t' + box_shadow + ';\n\}',

    }
    return result;
}
function generateCSSShadow(state, setup){
    const result = {
        css_pixel_text:''
    }
    return result
}
export default function(state = null, action){
    switch(action.type){
        case 'GENERATE_PIXEL_CSS':
            return generateCSSPixelArt(action.payload);

        case 'ADD_TO_SHADOW_ARRAY':
            return generateCSSShadow(state, action.payload);

        case 'CANVAS_CLEAR':
            return {
                box_shadow: '0 0 0 transparent',
                css_pixel_text: ''
            }
        default:
            return state
    }
}
