import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setPixelColor,setPixelSize,setCanvasSize} from '../actions/index';
import {bindActionCreators} from 'redux';

class PreviewBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pixelartText:''

      };
    }

    componentDidMount() {
        this.generateCSSPixelArt({});
    }

    generateCSSPixelArt(){
        if(!this.props.canvas_ctx) return false;
        const pixel_size = 10;
        const pixel_color = 10;
        let shadow = [];
        this.min_width = this.props.canvas_width,
        this.min_height = this.props.canvas_height,
        this.max_width = 0,
        this.max_height = 0;


        for (var i = 0; i < this.props.canvas_height; i += pixel_size) {
          for (var j = 0; j < this.props.canvas_width; j += pixel_size) {
            var data = this.props.canvas_ctx.getImageData(j, i, pixel_size, pixel_size).data;
            if (data[0] != 255 && data[1] != 255 && data[2] != 255 && data[3] != 0) {
              if ((j + pixel_size) < this.min_width) {
                this.min_width = (j + pixel_size);
              }
              if ((i + pixel_size) < this.min_height) {
                this.min_height = (i + pixel_size);
              }
              if ((j + (pixel_size * 2)) > this.max_width) {
                this.max_width = (j + (pixel_size * 2));
              }
              if ((i + (pixel_size * 2)) > this.max_height) {
                this.max_height = (i + (pixel_size * 2));
              }
              if(data[0]==141 ||  data[1]==141 || data[2]==141){
                  //shadow.push((j + pixel_size) + 'px ' + (i + pixel_size) + 'px transparent');
              } else {
                  shadow.push((j + pixel_size) + 'px ' + (i + pixel_size) + 'px #' + (data[2] | (data[1] << 8) | (data[0] << 16) | (1 << 24)).toString(16).slice(1));
              }
            }
          }
        }
        this.shadow = shadow.join(',\n\t\t');
        console.log(shadow);

        /*
        $('#drawing .pixels').css({
          'display': 'block',
          'width': pixel_size,
          'height': pixel_size,
          'margin': '-' + this.min_height + 'px ' + this.max_width + 'px ' + this.max_height + 'px -' + this.min_width + 'px',
          'box-shadow': this.shadow
        });
        */
        let shadow_text = '.pixels {\n\tdisplay: block;\n\twidth: ' + pixel_size + 'px;\n\theight: ' + pixel_size + 'px;\n\tmargin: -' + this.min_height + 'px ' + this.max_width + 'px ' + this.max_height + 'px -' + this.min_width + 'px;\n\tbox-shadow: \n\t\t' + this.shadow + ';\n\}';

        this.setState({pixelartText: shadow_text});
    }


    render(){
        const output_text = "";
        const output_style = {
            display: 'inline-block',
            width: 10,
            height: 10,
            position:'relative',
            //margin: (this.min_height?'-' + this.min_height + 'px ' + this.max_width + 'px ' + this.max_height + 'px -' + this.min_width + 'px': '0 0'),
            boxShadow: (this.shadow? this.shadow : ' 0 0 0 transparent')
        };
        console.log(this.props.canvas_ctx);
        return (
            <div>
                <h1>Preview</h1>
                <div className="">
                    <div>
                        <button onClick={()=>{this.generateCSSPixelArt()}}>CLICK</button>
                    </div>
                    <div className="css-preview-block">
                        <div className="pixels" style={output_style}></div>
                    </div>

                    <textarea id="output" value={this.state.pixelartText}></textarea>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
    pixel_color: state.pixel_color,
    default_pixel_size: state.default_pixel_size,
    pixel_size: state.pixel_size,
    canvas_width: state.canvas_setup.width,
    canvas_height: state.canvas_setup.height,
    canvas_ctx: state.canvas_ctx
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({setPixelColor:setPixelColor,setPixelSize:setPixelSize,setCanvasSize:setCanvasSize}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PreviewBlock);
