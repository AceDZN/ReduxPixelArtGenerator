import React, {Component} from 'react';
import {connect} from 'react-redux';
import {generateCSSPixelArt} from '../actions/index';
import {bindActionCreators} from 'redux';

class PreviewBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
          box_shadow: ' 0 0 0 transparent',
          css_pixel_text:''
      };
    }

    componentWillReceiveProps(props) {
        if(!!props.css_generator){
            this.setState({
                css_pixel_text: props.css_generator.css_pixel_text,
                box_shadow: props.css_generator.box_shadow
            });
        }
    }

    render(){
        const output_text = "";
        const output_style = {
            display: 'inline-block',
            width: this.props.defaults.default_pixel_size,
            height: this.props.defaults.default_pixel_size,
            position:'relative',
            //margin: (this.min_height?'-' + this.min_height + 'px ' + this.max_width + 'px ' + this.max_height + 'px -' + this.min_width + 'px': '0 0'),
            boxShadow: this.state.box_shadow
        };

        const css_setup = {
            ctx: this.props.canvas_ctx,
            pixel_size: this.props.defaults.default_pixel_size,
            canvas_width: this.props.defaults.canvas_width,
            canvas_height: this.props.defaults.canvas_height
        };

        return (
            <div>
                <button onClick={()=>{this.props.generateCSSPixelArt(css_setup)}}>Generate CSS</button>
                <div className="css-preview-block">
                    <div className="pixels" style={output_style}></div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      defaults: state.defaults,
      pixel_size: state.pixel_size,
      pixel_color: state.pixel_color,
      canvas_clear: state.canvas_clear,
      canvas_ctx: state.canvas_ctx,
      css_generator: state.css_generator,
      uploaded_image: state.uploaded_image
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({generateCSSPixelArt:generateCSSPixelArt}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PreviewBlock);
