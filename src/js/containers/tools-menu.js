import React, {Component} from 'react';
import {connect} from 'react-redux';
import { GithubPicker } from 'react-color';
import {setPixelColor, setPixelSize, setCanvasDefaults, clearCanvas,setUploadedImage,loadUploadedImage} from '../actions/index';
import {bindActionCreators} from 'redux';


const DEFAULT_PIXEL_SIZE = 4;
const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 300;

class CanvasToolsMenu extends Component {
    constructor(props) {
      super(props);

      this.state = {
          default_props: {default_pixel_size: DEFAULT_PIXEL_SIZE,pixel_color:"#000000", pixel_size:DEFAULT_PIXEL_SIZE, canvas_width:DEFAULT_CANVAS_WIDTH, canvas_height:DEFAULT_CANVAS_HEIGHT},
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
        this.setState({color_pallete_open: false})
    }
    onFilePreview(e){
        if(!e || !e.target || !e.target.files){return;}
        this.props.loadUploadedImage();
        const currentFile = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            this.props.setUploadedImage(event.target.result);
        }.bind(this);
        reader.readAsDataURL(currentFile);
    }
    getPaginationClassName(c){
            if(c == this.props.pixel_size){
                return "page-item active"
            } else {
                return "page-item"
            }
    }
    resetCanvas(){
        this.props.clearCanvas(true);
    }
    render(){
        const colorStyle = {
          backgroundColor: this.props.pixel_color,
        };

        const pixelSizeSVG = '<use xlink:href="/images/svg/solid.svg#octagon" />';
        const pixelColorSVG = '<use xlink:href="/images/svg/solid.svg#eye-dropper" />';
        const clearCanvasSVG = '<use xlink:href="/images/svg/solid.svg#eraser" />';
        let pixel_size_1  = 0, pixel_size_2 = 0, pixel_size_3 = 0, pixel_size_4 = 0;
        if(this.props.defaults){
            pixel_size_1 = this.props.defaults.default_pixel_size;
            pixel_size_2 = (this.props.defaults.default_pixel_size*2);
            pixel_size_3 = (this.props.defaults.default_pixel_size*4);
            pixel_size_4 = (this.props.defaults.default_pixel_size*6);
        }
        return (
            <nav className="fixed_header">

                <ul className="pixel_tools_menu">
                    <li className="pixel_tool">
                        <div className="color_swatch" onClick={()=>this.setState({color_pallete_open: !this.state.color_pallete_open})} style={colorStyle}>
                            <svg dangerouslySetInnerHTML={{__html: pixelColorSVG }} />
                            <GithubPicker
                                className={(!!this.state.color_pallete_open?'open':'closed')}
                                color={ this.props.pixel_color || this.state.default_props.pixel_color }
                                onChangeComplete={ (e)=>this.onColorInputChange(e) }
                            />
                        </div>

                    </li>
                    <li className="pixel_tool">
                        <ul className="pagination">
                            <li className="page-item active "><a className="page-link icon_item" href="#" ><svg dangerouslySetInnerHTML={{__html: pixelSizeSVG }} /></a></li>
                            <li className={this.getPaginationClassName(pixel_size_1)}  onClick={()=>this.props.setPixelSize(pixel_size_1)}><a className="page-link" href="#" >{pixel_size_1}</a></li>
                            <li className={this.getPaginationClassName(pixel_size_2)} onClick={()=>this.props.setPixelSize(pixel_size_2)}><a className="page-link" href="#" >{pixel_size_2}</a></li>
                            <li className={this.getPaginationClassName(pixel_size_3)} onClick={()=>this.props.setPixelSize(pixel_size_3)}><a className="page-link" href="#" >{pixel_size_3}</a></li>
                            <li className={this.getPaginationClassName(pixel_size_4)} onClick={()=>this.props.setPixelSize(pixel_size_4)}><a className="page-link" href="#" >{pixel_size_4}</a></li>
                        </ul>
                    </li>

                    <li className="pixel_tool">
                        <button className="btn btn-danger" onClick={()=>this.resetCanvas(true)}><svg dangerouslySetInnerHTML={{__html: clearCanvasSVG }} /></button>
                    </li>
                    <li className="btn btn-warning">{this.state.image_source}</li>
                    <li className="hidden-md-down">
                        <input type="file" onChange={(e)=>this.onFilePreview(e)} />
                    </li>
                </ul>
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
      setPixelColor:setPixelColor,
      setPixelSize:setPixelSize,
      setCanvasDefaults:setCanvasDefaults,
      clearCanvas:clearCanvas,
      setUploadedImage:setUploadedImage,
      loadUploadedImage:loadUploadedImage
  }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CanvasToolsMenu);
