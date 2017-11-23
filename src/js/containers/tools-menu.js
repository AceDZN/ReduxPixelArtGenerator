import React, {Component} from 'react';
import {connect} from 'react-redux';
import { GithubPicker } from 'react-color';
import {setPixelColor, setPixelSize, setCanvasSize, clearCanvas} from '../actions/index';
import {bindActionCreators} from 'redux';



class CanvasToolsMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
          default_props: {pixel_color:"#000000", pixel_size:10, canvas_setup:{width:250, height:250}},
          color_pallete_open: false

      };
    }

    componentWillMount() {
        this.props.setPixelColor(this.state.default_props.pixel_color);
        this.props.setPixelSize(this.state.default_props.pixel_size);
        this.props.setCanvasSize(this.state.default_props.canvas_setup.width,this.state.default_props.canvas_setup.height);
    }

    onColorInputChange(c){
        if(!c || !c.hex) return
        this.props.setPixelColor(c.hex);
        this.setState({color_pallete_open: false})
    }
    getPaginationClassName(c){
            if(c == this.props.pixel_size){
                return "page-item active"
            } else {
                return "page-item"
            }
    }
    render(){
        const colorStyle = {
          backgroundColor: this.props.pixel_color,
        };

        const pixelSizeSVG = '<use xlink:href="/images/svg/solid.svg#octagon" />';
        const pixelColorSVG = '<use xlink:href="/images/svg/solid.svg#eye-dropper" />';
        const clearCanvasSVG = '<use xlink:href="/images/svg/solid.svg#eraser" />';

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
                            <li className={this.getPaginationClassName(10)}  onClick={()=>this.props.setPixelSize(10)}><a className="page-link" href="#" >10</a></li>
                            <li className={this.getPaginationClassName(20)} onClick={()=>this.props.setPixelSize(20)}><a className="page-link" href="#" >20</a></li>
                            <li className={this.getPaginationClassName(30)} onClick={()=>this.props.setPixelSize(30)}><a className="page-link" href="#" >30</a></li>
                            <li className={this.getPaginationClassName(40)} onClick={()=>this.props.setPixelSize(40)}><a className="page-link" href="#" >40</a></li>
                        </ul>
                    </li>

                    <li className="pixel_tool">
                        <button className="btn btn-danger" onClick={()=>this.props.clearCanvas(true)}><svg dangerouslySetInnerHTML={{__html: clearCanvasSVG }} /></button>
                    </li>
                </ul>
            </nav>

        )
    }
}

function mapStateToProps(state) {
    return {
        pixel_color: state.pixel_color,
        pixel_size: state.pixel_size,
        canvas_width: state.canvas_width,
        canvas_height: state.canvas_height,
        canvas_clear: state.canvas_clear
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({setPixelColor:setPixelColor,setPixelSize:setPixelSize,setCanvasSize:setCanvasSize,clearCanvas:clearCanvas}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CanvasToolsMenu);
