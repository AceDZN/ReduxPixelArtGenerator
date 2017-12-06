import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clearCanvas} from '../actions/index';

class PreviewBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
          box_shadow: '0 0 0 transparent',
          generated_text:'',
          render_pixel_size: this.props.default_props.render_pixel_size,
          default_props: this.props.default_props
      };
    }

    componentWillReceiveProps(props) {
        if(props.canvas_clear!==this.props.canvas_clear){
            this.props.clearCanvas(false);
        }
        if(!!props.css_generator){
            if(!props.css_generator.type || props.css_generator.type=='css'){
                this.setState({
                    generated_text: props.css_generator.generated_text,
                    box_shadow: props.css_generator.box_shadow,
                    svg_image:false
                });
            } else if(props.css_generator.type=='svg'){
                this.setState({
                    generated_text: props.css_generator.generated_text,
                    box_shadow:false,
                    svg_image: true
                });
            } else if(props.css_generator.type=='png'){
                this.setState({
                    generated_text: props.css_generator.generated_text,
                    box_shadow:false,
                    svg_image: props.css_generator.png_image||''
                });
            }
        }


    }

    generatePixelArt(css_setup,type){
        this.setState({render_pixel_size:this.props.default_props.render_pixel_size})
        css_setup.pixel_size = this.props.default_props.render_pixel_size;
        if(!type || type== 'css'){
            this.props.generatePixelArtCss(css_setup);
        } else if(type== 'svg'){
            this.props.generatePixelArtSvg(css_setup);
        } else if(type== 'png'){
            this.props.generatePixelArtPng(css_setup);
        }

    }
    renderPreview(){
        if((this.state.box_shadow !== '0 0 0 transparent') || this.state.svg_image || this.state.png_image ){
            let output_style = {
                display: 'inline-block',
                position:'relative'
            };
            if(!this.state.svg_image && !this.state.png_image && this.state.box_shadow !== '0 0 0 transparent'){
                output_style.boxShadow = this.state.box_shadow;
                output_style.width = this.state.default_props.render_pixel_size;
                output_style.height = this.state.default_props.render_pixel_size;
                return (<div className="pixels" style={output_style}></div>);
            } else if(!!this.state.svg_image){
                return (<div className="svg" style={output_style} dangerouslySetInnerHTML={{__html: this.state.generated_text}}></div>);
            } else if(!!this.state.png_image){
                return (<img src={this.state.png} style={output_style} />);
            }
        } else {
            return(
                <h2>Nothing to see here</h2>
            )
        }

    }
    pixel_array(){
        if(!this.props.pixel_array || !this.props.pixel_array.length) return;
        return (
            <h1>
                {this.props.pixel_array.length}
                <br />
                {this.props.pixel_array[this.props.pixel_array.length-1].size}
            </h1>
        )
    }
    render(){
        const previewStyle = {height: this.props.default_props.canvas_height};
        return (
            <div>
                {this.pixel_array()}
                <div className="css-preview-block" style={previewStyle}>
                    {this.renderPreview()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      default_props: state.default_props,
      canvas_clear: state.canvas_clear,
      pixel_size: state.pixel_size,
      pixel_color: state.pixel_color,
      canvas_ctx: state.canvas_ctx,
      css_generator: state.css_generator,
      uploaded_image: state.uploaded_image,
      pixel_array: state.pixel_array
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({clearCanvas}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PreviewBlock);
