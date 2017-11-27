import React, {Component} from 'react';
import {connect} from 'react-redux';
import {clearCanvas, setCanvasContext,addToShadowArray} from '../actions/index';
import {bindActionCreators} from 'redux';



class PixelCanvas extends Component {
    constructor(props) {
      super(props);
      this.state = {
          uploaded_image: ''
      };
    }
    componentDidMount() {
        this.props.setCanvasContext({canvas:this.canvas.getContext('2d'),grid:this.canvas_grid.getContext('2d')});
        this.resetCanvas();
    }


    componentWillReceiveProps(nextProps){
        if(nextProps.canvas_clear!==this.props.canvas_clear){
            this.resetCanvas(true);
            this.props.clearCanvas(false);
        }
        if(nextProps.pixel_size!==this.props.pixel_size){
            this.makeGrid(nextProps.pixel_size);
        }
        if(nextProps.uploaded_image){
            this.setState({uploaded_image:nextProps.uploaded_image})
        }
    }
    resetCanvas(v) {
        this.ctx = this.canvas.getContext('2d');
        this.grid_ctx = this.canvas_grid.getContext('2d');

        this.props.setCanvasContext({canvas:this.canvas.getContext('2d'),grid:this.canvas_grid.getContext('2d')});
        var w = this.canvas.clientWidth;
        var h = this.canvas.clientHeight;

        this.grid_ctx.canvas.width  = w; this.grid_ctx.canvas.height = h;
        this.ctx.canvas.width  = w; this.ctx.canvas.height = h;

        if(v !== 'no-grid'){
            this.makeGrid();
        }

        this.setState({
            canvas_width: w,
            canvas_height: h,
        });


    }
    makeGrid(size) {
        var w = this.canvas.width,
            h = this.canvas.height;
        var size = size || this.props.pixel_size ||this.props.defaults.render_pixel_size;
        this.grid_ctx.clearRect(0, 0, w, h )
        this.grid_ctx.fillStyle = "#ffffff";
        this.grid_ctx.fillRect(0,0,w,h);
        var odd=false;
        for(var i = 0; i<w;  i+=size){
            odd = !odd;
            for(var j = 0; j < h; j+=size){
                this.grid_ctx.fillStyle=(odd ? "#ffffff" : "#dadfe087");
                odd = !odd;
                this.grid_ctx.fillRect(i, j, size, size);
            }
        }
    }
    getPosition(e) {
        var targ;
        if (!e) {
            e = window.event;
        }
        if (e.target) {
            targ = e.target;
        } else if (e.srcElement) {
            targ = e.srcElement;
        }
        if (targ.nodeType == 3) {
            targ = targ.parentNode;
        }
        var offset_left = targ.getBoundingClientRect().left;
        var offset_top = targ.getBoundingClientRect().top;

        var x = Math.floor(e.pageX - offset_left);
        var y = Math.floor(e.pageY - offset_top);

        return { "x": x, "y": y };
    };

    drawPixel(x, y, color, clear) {
        if (!clear || clear == null) clear = false;

        if (!!clear) {
            this.ctx.clearRect(x, y, this.props.pixel_size, this.props.pixel_size);
        } else {
            this.ctx.fillStyle = this.props.pixel_color;
            this.ctx.fillRect(x, y, this.props.pixel_size, this.props.pixel_size);
            //this.props.addToShadowArray({pixel_color: this.props.pixel_color,pixel_size: this.props.pixel_color})
        }

    };

    _onMouseDown(e) {
        let pixel_size = this.props.pixel_size;
        let pixel_color = this.props.pixel_color;

        this.setState({ x: e.screenX, y: e.screenY });

        e.preventDefault();
        var position = this.getPosition(e);

        var cx = (Math.floor(position.x / pixel_size) * pixel_size),
        cy = (Math.floor(position.y / pixel_size) * pixel_size);

        if (position.x + pixel_size > this.w) {
          cx = this.w - pixel_size;
        }
        if (position.y + pixel_size > this.h) {
          cy = this.h - pixel_size;
        }
        if (e.ctrlKey || e.metaKey) {
          this.drawPixel(cx, cy, null, true);
        } else {
          this.drawPixel(cx, cy, pixel_color);
        }
    }

    renderUploadedImage(){
        if(!this.state.uploaded_image || this.state.uploaded_image == '') return;
        const imageStyle = {
            width:this.props.defaults.canvas_width,
            height:this.props.defaults.canvas_height,
        };
        if(this.state.uploaded_image == "Loading"){
            return (
                <h1 >Loading</h1>
            )
        } else {
            var image = new Image();
            image.src = this.state.uploaded_image;
            image.onload = function() {

                this.resetCanvas('no-grid');
                var imageAspectRatio = image.width / image.height;
            	var canvasAspectRatio = this.canvas.width / this.canvas.height;
            	var renderableHeight, renderableWidth, xStart, yStart;

            	// If image's aspect ratio is less than canvas's we fit on height
            	// and place the image centrally along width
            	if(imageAspectRatio < canvasAspectRatio) {
            		renderableHeight = this.canvas.height;
            		renderableWidth = image.width * (renderableHeight / image.height);
            		xStart = (this.canvas.width - renderableWidth) / 2;
            		yStart = 0;
            	}

            	// If image's aspect ratio is greater than canvas's we fit on width
            	// and place the image centrally along height
            	else if(imageAspectRatio > canvasAspectRatio) {
            		renderableWidth = this.canvas.width
            		renderableHeight = image.height * (renderableWidth / image.width);
            		xStart = 0;
            		yStart = (this.canvas.height - renderableHeight) / 2;
            	}

            	// Happy path - keep aspect ratio
            	else {
            		renderableHeight = this.canvas.height;
            		renderableWidth = this.canvas.width;
            		xStart = 0;
            		yStart = 0;
            	}
                this.ctx.imageSmoothingEnabled = false;
            	this.ctx.drawImage(image, 0, 0, renderableWidth, renderableHeight);
                //this.ctx.drawImage(image, 0, 0,image.width, image.height);

            }.bind(this);
            return ''
        }
    }
    render(){
        return (
            <div>
                <h1>Pixel CANVAS</h1>
                <div className="canvas_wrap">
                    <canvas className="grid_canvas" ref={(c) => this.canvas_grid = c} width={this.props.defaults.canvas_width} height={this.props.defaults.canvas_height} ></canvas>
                    <canvas className="pixel_canvas" ref={(c) => this.canvas = c} width={this.props.defaults.canvas_width} height={this.props.defaults.canvas_height} onMouseDown={this._onMouseDown.bind(this)} ></canvas>
                </div>
                <div>{this.renderUploadedImage()}</div>
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
      uploaded_image: state.uploaded_image
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({clearCanvas,setCanvasContext,addToShadowArray}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PixelCanvas);
