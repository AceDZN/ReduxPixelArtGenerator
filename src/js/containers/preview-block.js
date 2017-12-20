import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearCanvas } from '../actions/index';
import { displayPreviewPopup } from '../actions/preview-popup';

import CssCodeBlock from './css-code-block';

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
                <h2 className="text-center text-warning">Nothing to see here</h2>
            )
        }

    }
    renderPreviewBlock(){
        //const previewStyle = {height: this.props.default_props.canvas_height};
        return (
            <div className="row">
                <div className="col">
                    { this.renderPreview() }
                </div>
                <div className="col">
                    <CssCodeBlock />
                </div>
            </div>
        );
    }
    render(){

        return (
            <div className={`preview-block-wrap ${this.props.preview_active ? 'active' : '' }`}>
                <div className={`preview-block-overlay`} onClick={()=>this.props.displayPreviewPopup(false)}></div>
                <div className={`preview-block`}>
                    { this.renderPreviewBlock() }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      default_props: state.default_props,
      canvas_clear: state.canvas_clear,
      css_generator: state.css_generator,
      preview_active: state.preview_active
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({clearCanvas,displayPreviewPopup}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PreviewBlock);
