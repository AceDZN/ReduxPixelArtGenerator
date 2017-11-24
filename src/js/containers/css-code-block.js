import React, {Component} from 'react';
import {connect} from 'react-redux';


class CssCodeBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
          css_text:''
      };
    }
    componentWillReceiveProps(props) {
        if(!!props.css_generator){
            this.setState({
                css_text: props.css_generator.css_pixel_text
            });
        }
    }

    render() {
        return (
            <div>
                <textarea id="output" value={this.state.css_text}></textarea>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {
    default_pixel_size: state.default_pixel_size,
    pixel_size: state.pixel_size,
    canvas_width: state.canvas_width,
    canvas_height: state.canvas_height,
    canvas_ctx: state.canvas_ctx,
    css_generator: state.css_generator
  }
}

export default connect(mapStateToProps)(CssCodeBlock);
