import React, {Component} from 'react';
import {connect} from 'react-redux';
import { TwitterPicker } from 'react-color';
import {setPixelColor, setPixelSize, setCanvasDefaults, clearCanvas,setUploadedImage,loadUploadedImage,setRenderPixelSize} from '../actions/index';
import {generatePixelArtCss, generatePixelArtSvg, generatePixelArtPng} from '../actions/generate-pixels';
import {bindActionCreators} from 'redux';

const DEFAULT_PIXEL_SIZE = 10;
const RENDER_PIXEL_SIZE = 4;
const DEFAULT_CANVAS_WIDTH = 480 || 480 ||512 || (RENDER_PIXEL_SIZE*30);
const DEFAULT_CANVAS_HEIGHT = 480 || 480 ||512 || (RENDER_PIXEL_SIZE*30);


class CanvasToolsMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
          default_props: {render_pixel_size: RENDER_PIXEL_SIZE, pixel_color: "#000000", pixel_size: DEFAULT_PIXEL_SIZE, canvas_width: DEFAULT_CANVAS_WIDTH, canvas_height: DEFAULT_CANVAS_HEIGHT},
          color_pallete_open: false,
          image_source: "BLA?"

      };
    }

    componentWillMount() {
        this.props.setPixelColor(this.state.default_props.pixel_color);
        this.props.setPixelSize(this.state.default_props.pixel_size);
        this.props.setCanvasDefaults(this.state.default_props);
    }

    onColorInputChange(c){
        if(!c || !c.hex) return
        this.props.setPixelColor(c.hex);
        this.setState({color_pallete_open: false});
        this.closePallete();
    }
    onFilePreview(e){
        if(!e || !e.target || !e.target.files || e.target.files.length<1){return;}
        this.props.loadUploadedImage();
        const currentFile = e.target.files[0];
        try{
            this.resetCanvas(true);
            var reader = new FileReader();
            reader.onload = function(event) {
                this.props.setUploadedImage(event.target.result);
            }.bind(this);
            reader.readAsDataURL(currentFile);
        } catch(err){
            console.warn(err,"err");
        }

    }
    getBrushesPaginationClassName(c){
        if(c == this.props.pixel_size){
            return "page-item active"
        } else {
            return "page-item"
        }
    }
    getRenderPaginationClassName(c){
        if(c == this.props.render_pixel_size){
            return "page-item active"
        } else {
            return "page-item"
        }
    }
    resetCanvas(){
        this.props.clearCanvas(true);
    }
    openPallete(){
        if(!this.state.color_pallete_open){
            this.setState({color_pallete_open: !this.state.color_pallete_open})
        }
    }
    closePallete(){
        if(!!this.state.color_pallete_open){
            this.setState({color_pallete_open: !this.state.color_pallete_open})
        }
    }
    renderBrushSizePicker(){
        if(this.props.default_props){
            let pixel_brushes = [4, 8, 10, 12, 16, 19 ];
            let brush_elements = pixel_brushes.map(function(brush){
                return (<li key={"brush_size_"+brush} className={this.getBrushesPaginationClassName(brush)}  onClick={()=>this.props.setPixelSize(brush)}><a className="page-link" href="#" >{brush}</a></li>)
            }.bind(this));
            return (
                <ul className="pagination">
                    <li className="page-item active "><a className="page-link icon_item" href="#" ><svg dangerouslySetInnerHTML={{__html: this.pixelSizeSVG }} /></a></li>
                    {brush_elements}
                </ul>
            );
        }
    }
    RenderSizePicker(){
        if(this.props.default_props){
            let pixel_sizes = [2, 4, 8, 10, 12];
            let brush_elements = pixel_sizes.map(function(size){
                return (<li key={"pixel_size_"+size} className={this.getRenderPaginationClassName(size)}  onClick={()=>this.props.setRenderPixelSize(size)}><a className="page-link" href="#" >{size}</a></li>)
            }.bind(this));
            return (
                <ul className="pagination">
                    <li className="page-item active "><a className="page-link icon_item" href="#" ><svg dangerouslySetInnerHTML={{__html: this.pixelSizeSVG }} /></a></li>
                    {brush_elements}
                </ul>
            );
        }
    }
    generatePixelArt(type){
        var ctx = this.props.canvas_ctx.canvas;
        const css_setup = {
            ctx: ctx,
            pixel_size: this.props.render_pixel_size,
            canvas_width: this.props.pixel_canvas.canvas_width,
            canvas_height: this.props.pixel_canvas.canvas_height
        };
        css_setup.pixel_size = this.props.render_pixel_size;
        if(!type || type== 'css'){
            this.props.generatePixelArtCss(css_setup);
        } else if(type== 'svg'){
            this.props.generatePixelArtSvg(css_setup);
        } else {
            this.props.generatePixelArtPng(css_setup);
        }

    }

    render(){
        const colorStyle = {
          backgroundColor: this.props.pixel_color,
        };



        this.pixelSizeSVG = '<use xlink:href="/images/svg/solid.svg#octagon" />';
        const pixelColorSVG = '<use xlink:href="/images/svg/solid.svg#eye-dropper" />';
        const clearCanvasSVG = '<use xlink:href="/images/svg/solid.svg#eraser" />';
        let pixel_brushes=[]



        return (
            <nav className="fixed_header">
                <ul className="pixel_tools_menu">
                    <li className="pixel_tool">
                        <div className="color_swatch" onClick={this.openPallete.bind(this)} style={colorStyle}>
                            <svg dangerouslySetInnerHTML={{__html: pixelColorSVG }} />
                            <TwitterPicker
                                className={(!!this.state.color_pallete_open?'open':'closed')}
                                color={ this.props.pixel_color || this.state.default_props.pixel_color }
                                onChangeComplete={ (e)=>this.onColorInputChange(e) }
                            />
                        </div>

                    </li>
                    <li className="pixel_tool">
                        {this.renderBrushSizePicker()}
                    </li>
                    <li className="pixel_tool">{this.RenderSizePicker()}</li>

                    <li className="pixel_tool">
                        <button className="btn btn-danger" onClick={()=>this.resetCanvas(true)}><svg dangerouslySetInnerHTML={{__html: clearCanvasSVG }} /></button>
                    </li>
                    <li className="pixel_tool hidden-md-down">
                        <input type="file" onChange={(e)=>this.onFilePreview(e)} />
                    </li>
                    <li className="pixel_tool">
                        <button onClick={()=>{this.generatePixelArt('css')}}>CSS</button>
                        <button onClick={()=>{this.generatePixelArt('svg')}}>SVG</button>
                        <button onClick={()=>{this.generatePixelArt('png')}}>PNG</button>
                    </li>

                </ul>

            </nav>

        )
    }
}

function mapStateToProps(state) {
    return {
        default_props: state.defaults,
        pixel_color: state.pixel_color,
        pixel_size: state.pixel_size,
        render_pixel_size: state.render_pixel_size,
        canvas_width: state.canvas_width,
        canvas_height: state.canvas_height,
        canvas_clear: state.canvas_clear,
        canvas_ctx: state.canvas_ctx,
        pixel_canvas: state.pixel_canvas
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
      setPixelColor,
      setPixelSize,
      setCanvasDefaults,
      clearCanvas,
      setUploadedImage,
      loadUploadedImage,
      setRenderPixelSize,
      generatePixelArtCss, generatePixelArtSvg, generatePixelArtPng,
  }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CanvasToolsMenu);
