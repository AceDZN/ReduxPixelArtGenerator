import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import { SizePicker } from '../components/tools/size-picker';
import { ColorPicker } from '../components/tools/color-picker';
import { ToolButton } from '../components/tools/tool-button';
import { setUploadedImage } from '../actions/image-upload';
import { displayPreviewPopup } from '../actions/preview-popup';
//Actions
import { setPixelColor, setPixelSize, setCanvasDefaults, clearCanvas,loadUploadedImage,setRenderPixelSize, selectTool } from '../actions/index';
import { generatePixelArtCss, generatePixelArtSvg, generatePixelArtPng } from '../actions/generate-pixels';
import { setMainColorScheme } from '../actions/colors';

import { getScreenDimensions } from '../utils/';



const PAINTBRUSH = "paintbrush";
const ERASER = "eraser";
const UPLOAD = "upload";
const SAVE = "save";
const DEFAULT_PIXEL_SIZE = 10;
const RENDER_PIXEL_SIZE = 4;
const DEFAULT_CANVAS_WIDTH = getScreenDimensions()[0] || (RENDER_PIXEL_SIZE*30);
const DEFAULT_CANVAS_HEIGHT = (getScreenDimensions()[1]) || (RENDER_PIXEL_SIZE*30);


export class CanvasToolsMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
          default_props: {render_pixel_size: RENDER_PIXEL_SIZE, pixel_color: "#212121", pixel_size: DEFAULT_PIXEL_SIZE, canvas_width: DEFAULT_CANVAS_WIDTH, canvas_height: DEFAULT_CANVAS_HEIGHT},
      };
    }
    componentWillReceiveProps(nextProps){
        //console.log("componentWillReceiveProps",nextProps)
    }
    componentWillMount() {
        this.props.setMainColorScheme();
        this.props.setPixelColor(this.state.default_props.pixel_color);
        this.props.setPixelSize(this.state.default_props.pixel_size);
        this.props.setCanvasDefaults(this.state.default_props);
        this.props.selectTool(PAINTBRUSH);
    }

    onColorInputChange(c){
        if(!c || !c.hex) return

        this.props.setPixelColor(c.hex);
    }


    onFilePreview(e){
        if(!e || !e.target || !e.target.files || e.target.files.length<1){return;}

        this.props.loadUploadedImage();
        const currentFile = e.target.files[0];
        try{
            var reader = new FileReader();
            reader.onload = function(event) {
                this.resetCanvas(true);
                this.props.clearCanvas(false);

                const set = {
                    canvas: this.props.canvas_obj.canvas,
                    ctx: this.props.canvas_ctx.canvas,
                    canvas_width: this.props.default_props.canvas_width,
                    canvas_height: this.props.default_props.canvas_height,
                    pixel_size:this.props.pixel_size,
                    uploaded_image: event.target.result
                };
                this.props.setUploadedImage(set);
            }.bind(this);
            reader.readAsDataURL(currentFile);
        } catch(err){
            console.warn(err,"err");
        }
        e.target.value = "";
    }

    resetCanvas(t){
        this.props.clearCanvas(t);
        this.props.setMainColorScheme();
    }


    generatePixelArt(type){
        this.props.displayPreviewPopup(true);
        var ctx = this.props.canvas_ctx.canvas;
        //console.log(this.props.pixel_array,"this.props.pixel_array");
        const css_setup = {
            ctx: ctx,
            pixel_size: this.props.render_pixel_size,
            canvas_width: this.props.pixel_canvas.canvas_width,
            canvas_height: this.props.pixel_canvas.canvas_height,
            pixel_array: this.props.pixel_array
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
        this.pixelSizeSVG = '<use xlink:href="./images/svg/solid.svg#octagon" />';
        const paintBrushSVG = '<use xlink:href="./images/svg/solid.svg#paint-brush" />';
        const clearCanvasSVG = '<use xlink:href="./images/svg/solid.svg#eraser" />';
        const brush_sizes = [2, 4, 8, 10, 12, 15, 16, 19 ];
        let pixel_brushes=[];
        return (
            <nav className="fixed_header">
                <ul className="pixel_tools_menu">
                    <li className="pixel_tool brush_icon">
                        <ToolButton
                            active={ (this.props.current_tool == PAINTBRUSH) ? true : false }
                            icon="paint-brush"
                            onClick={ ()=>this.props.selectTool(PAINTBRUSH) } >
                            <b>Brush Size</b>
                            <SizePicker
                                sizelist={brush_sizes}
                                selected={this.props.pixel_size}
                                key="brush_list"
                                onClick={this.props.setPixelSize}
                                icon={this.pixelSizeSVG}
                                 />
                        </ToolButton>
                    </li>

                    <li className="pixel_tool brush_icon">
                        <ToolButton
                            active={ (this.props.current_tool == ERASER) ? true : false }
                            icon="eraser"
                            onClick={ ()=>this.props.selectTool(ERASER) } >
                            <b>Eraser Size</b>
                            <SizePicker
                                sizelist={brush_sizes}
                                selected={this.props.pixel_size}
                                key="eraser_brush_list"
                                onClick={this.props.setPixelSize}
                                icon={this.pixelSizeSVG}
                                 />
                        </ToolButton>
                    </li>
                    <li className="pixel_tool brush_icon">
                        <ColorPicker
                            latest_color={this.props.latest_pixel_color}
                            color_schemes={ this.props.color_schemes }
                            selected={ this.props.pixel_color || this.state.default_props.pixel_color }
                            onChangeComplete={ (e)=>this.onColorInputChange(e) }
                        />
                    </li>
                    <li className="pixel_tool brush_icon file_uploader">
                        <ToolButton
                            active={(this.props.current_tool == UPLOAD) ? true : false}
                            icon="upload"
                            onClick={ ()=>this.props.selectTool(UPLOAD) }>
                            <label htmlFor="file-trigger">
                                Upload File
                                <input
                                    type="file"
                                    onChange={(e)=>this.onFilePreview(e)}
                                    id="file-trigger" name="file-trigger" />
                            </label>
                            <b>Render Size</b>
                            <SizePicker
                                sizelist={brush_sizes}
                                selected={this.props.pixel_size}
                                key="upload_brush_list"
                                onClick={this.props.setPixelSize}
                                icon={this.pixelSizeSVG}
                                 />
                        </ToolButton>
                    </li>
                    <li className="pixel_tool brush_icon">
                        <ToolButton
                            active={(this.props.current_tool == SAVE) ? true : false}
                            icon="save"
                            onClick={ ()=>this.props.selectTool(SAVE) }>
                            <b>Export Format</b>
                            <div>
                                <button onClick={()=>{this.generatePixelArt('css')}}>CSS</button>
                                <button onClick={()=>{this.generatePixelArt('svg')}}>SVG</button>
                                <button onClick={()=>{this.generatePixelArt('png')}}>PNG</button>
                            </div>
                        </ToolButton>
                    </li>






                    <li className="pixel_tool"></li>
                    <li className="pixel_tool"></li>


                    <li className="pixel_tool">
                        <button className="btn btn-danger" onClick={()=>this.resetCanvas(true)}><svg dangerouslySetInnerHTML={{__html: clearCanvasSVG }} /></button>
                    </li>


                    <li className="pixel_tool">

                    </li>

                    <li className="pixel_tool hidden-md-down">

                    </li>
                    <li className="pixel_tool">

                    </li>

                </ul>

            </nav>

        )
    }
}

function mapStateToProps(state) {
    return {
        default_props: state.default_props,
        pixel_color: state.pixel_color,
        pixel_size: state.pixel_size,
        render_pixel_size: state.render_pixel_size,
        canvas_width: state.canvas_width,
        canvas_height: state.canvas_height,
        canvas_obj: state.canvas_obj,
        canvas_ctx: state.canvas_ctx,
        pixel_canvas: state.pixel_canvas,
        pixel_array: state.pixel_array,
        color_schemes: state.color_schemes,
        current_tool: state.current_tool,
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
      setMainColorScheme,
      selectTool,
      displayPreviewPopup
  }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CanvasToolsMenu);
