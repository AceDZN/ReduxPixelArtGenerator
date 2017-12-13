import React,{ Component } from 'react';
import { getCorrectTextColor } from '../../utils/';
export default class ColorPicker extends Component {
    constructor(props) {
      super(props);
      this.state = {
          key_prefix: 'color_pick_'
      };
    }
    componentWillReceiveProps(nextProps){
        //console.log("props:",nextProps)
    }
    handleColorSelect(c){

        let tempState = {color_pallete_open: false};
        if(c.hex == 'transparent'){
            tempState.latest_color = this.props.selected;
        }
        this.setState(tempState);
        if(this.props.onChangeComplete){
            this.props.onChangeComplete(c);
        }
    }
    getSelectedColorClassName(c){
        var class_name= ''
        if(c.hex == 'transparent')
            class_name = 'eraser ';

        return (c.hex == this.props.selected ? class_name+'active' : class_name);
    }
    renderColorName(c){
        return c.hex;
    }


    renderColorScheme(scheme, limit = 0, schemeLabel = ''){

        let color_elements = scheme.map(function(color){
            let colorStyle= {
                backgroundColor: color.hex
            }
            colorStyle.color = getCorrectTextColor(color.hex);

            return (
                <span
                    key={this.state.key_prefix+'_'+color.hex}
                    onClick={()=>this.handleColorSelect(color)}
                    className={this.getSelectedColorClassName(color)}>
                    <div style={colorStyle} >{this.renderColorName(color)}</div>
                </span>
            );
        }.bind(this));

        return (
            <div>
                <b>{schemeLabel}</b>
                {color_elements.slice(0, (limit > 0 ? limit : color_elements.length))}
                <hr />
            </div>
        );

    }
    renderColorPickerPopup(){
        if(this.props.color_schemes){
            let c_scheme, m_scheme, p_scheme = false;
            if(this.props.color_schemes.current_scheme.length>1){
                c_scheme = this.renderColorScheme(this.props.color_schemes.current_scheme, 5, 'Currently used:');
            }
            if(this.props.color_schemes.main_scheme.length>1){
                m_scheme = this.renderColorScheme(this.props.color_schemes.main_scheme,0);
            }
            if(this.props.color_schemes.popular_scheme.length>1){
                p_scheme = this.renderColorScheme(this.props.color_schemes.popular_scheme, 5, 'Popular');
            }
            return (
                <div className={"picker-popup "+(!!this.state.color_pallete_open ? 'open' : 'closed')}>
                    {c_scheme}
                    {m_scheme}
                    {p_scheme}
                </div>
            );
        } else {
            return (
                <div className="picker-popup">NO COLORS HERE :(</div>
            )
        }
    }
    handleColorSwatchClick(){
        const o = !this.state.color_pallete_open;
        console.log(this.props.selected);
        let newState ={color_pallete_open: o};
        if(this.props.selected == 'transparent'){
            this.handleColorSelect(this.state.latest_color);
        }
        this.setState(newState);
    }

    render() {
        const pixelColorSVG = '<use xlink:href="./images/svg/solid.svg#eye-dropper" />';
        const clearCanvasSVG = '<use xlink:href="./images/svg/regular.svg#eraser" />';
        const pixelColorSVGstyle = {fill: (this.props.selected=='transparent' ? 'eraser' : getCorrectTextColor(this.props.selected))};

        const colorStyle = {
            backgroundColor: (this.props.selected=='transparent' ? this.state.latest_color : this.props.selected),
            boxShadow: (this.props.selected=='transparent' ? 'none' : '#ffffff 0px 0px 0px 5px inset')
        };
        const eraserStyle = {boxShadow: (this.props.selected=='transparent' ? 'rgb(255, 11, 11) 0px 0px 0px 5px inset' : 'none')};
        return (
            <div className="acedzn-color-picker">
                <div className="color_swatch" onClick={this.handleColorSwatchClick.bind(this)} style={colorStyle}>
                    <svg dangerouslySetInnerHTML={{__html: pixelColorSVG }} style={pixelColorSVGstyle} />
                    {this.renderColorPickerPopup()}

                </div>
                <span
                    onClick={()=>this.handleColorSelect({hex: 'transparent'})}
                    className="eraser"

                    >
                    <div style={eraserStyle}>
                        <svg dangerouslySetInnerHTML={{__html: clearCanvasSVG }} />
                    </div>
                </span>
            </div>
        );
    }
}


/*
<TwitterPicker
    className={(!!this.state.color_pallete_open?'open':'closed')}
    color={ this.props.pixel_color || this.state.default_props.pixel_color }
    onChangeComplete={ (e)=>this.onColorInputChange(e) }
/>
*/
