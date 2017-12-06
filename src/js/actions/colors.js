export function setMainColorScheme(colors){
    const main_colors = [
        {hex: '#212121'}, {hex: '#F5F5F5'}, {hex: '#37474F'}, {hex: '#4E342E'}, {hex: '#FF5722'},
        {hex: '#FFEB3B'}, {hex: '#4CAF50'}, {hex: '#2196F3'}, {hex: '#673AB7'}, {hex: '#E91E63'},
        /*{hex: '#FFDD17'}, {hex: '#2CA768'}, {hex: '#ABB8C3'}, {hex: '#01ADD4'},*/
    ];
    return {
        type: 'SET_MAIN_COLOR_SCHEME',
        payload: main_colors
    }
}
