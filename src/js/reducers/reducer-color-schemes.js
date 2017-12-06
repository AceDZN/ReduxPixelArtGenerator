import _ from 'lodash';

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });
        _.mapValues(_.invert(_.invert(obj)),parseInt);
        var o = _.fromPairs(_.sortBy(_.toPairs(keys), function(a){return a[1]}).reverse());
        return o
    }
});

export default function(state = null, action){
    function _getColorSchemeFromPixels(pixels){
        const original_state = state;
        let colors_obj ={};

        for(var i=0; i<pixels.length; i++){
            const keyName = (pixels[i].color ? 'color' : (pixels[i].hex ? 'hex' : 'undefined' ))
            if(!!colors_obj[pixels[i][keyName]]){
                colors_obj[pixels[i][keyName]]++;
            } else {
                colors_obj[pixels[i][keyName]] = 1;
            }
        }

        let o = _.map(colors_obj, (value, key) => {
            return {hex: key, count: value}
        });

        o =  _.orderBy(o, ['count'],['desc']);
        const output = o;
        return output;
    }

    function getCurrentPixelsColor(action_payload){
        let color_state = state || {};
        color_state.current_scheme = _getColorSchemeFromPixels(action_payload.pixel_array);
        return color_state;
    }

    let c = {};
    switch(action.type){
        case 'SET_MAIN_COLOR_SCHEME':
            c = { main_scheme: [], current_scheme:[], popular_scheme: [] };
            c.main_scheme = action.payload;
            return c;

        case 'ADD_PIXEL_TO_ARRAY':
            const s = state.current_scheme.concat(action.payload);
            let current_state = state;
            current_state.current_scheme = _getColorSchemeFromPixels(s);
            return current_state;

        case 'POPULATE_PIXEL_ARRAY':
            _getColorSchemeFromPixels(action.payload)
            return state;

        case 'RENDER_UPLOADED_IMAGE':
            return getCurrentPixelsColor(action.payload);


        default:
            return state
    }
}
