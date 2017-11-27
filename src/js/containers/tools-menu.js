import React, {Component} from 'react';
import {connect} from 'react-redux';
import { TwitterPicker } from 'react-color';
import {setPixelColor, setPixelSize, setCanvasDefaults, clearCanvas,setUploadedImage,loadUploadedImage,setRenderPixelSize} from '../actions/index';
import {bindActionCreators} from 'redux';

const DEFAULT_PIXEL_SIZE = 10;
const RENDER_PIXEL_SIZE = 4;
const DEFAULT_CANVAS_WIDTH = 480 || (RENDER_PIXEL_SIZE*30);
const DEFAULT_CANVAS_HEIGHT = 480 || (RENDER_PIXEL_SIZE*30);


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
    componentDidMount(){

    }
    componentWillReceiveProps(newProps){
        if(newProps.defaults){
            console.log(newProps.defaults,"newProps.defaults");
        }


    }

    onColorInputChange(c){
        if(!c || !c.hex) return
        this.props.setPixelColor(c.hex);
        this.setState({color_pallete_open: false})
    }
    onFilePreview(e){
        if(!e || !e.target || !e.target.files){return;}
        this.props.loadUploadedImage();
        const currentFile = e.target.files[0];
        try{
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
        if(c == this.props.defaults.render_pixel_size){
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
        if(this.props.defaults){
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
        if(this.props.defaults){
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
    renderPixelSize(){
        if(!!this.props.defaults){return(
            <div>{this.props.defaults.render_pixel_size}</div>
        )}
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
            <nav className="fixed_header" onClick={this.closePallete.bind(this)}>
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
                </ul>
                {this.renderPixelSize()}
            </nav>

        )
    }
}

function mapStateToProps(state) {
    return {
        defaults: state.defaults,
        pixel_color: state.pixel_color,
        pixel_size: state.pixel_size,
        canvas_width: state.canvas_width,
        canvas_height: state.canvas_height,
        canvas_clear: state.canvas_clear
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
      setRenderPixelSize
  }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CanvasToolsMenu);
