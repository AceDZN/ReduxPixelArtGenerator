import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clearCanvas, setCanvas, setCanvasContext,addPixelToArray,removePixelFromArray} from '../actions/index';
import {renderUploadedImage} from '../actions/image-upload';

class PixelCanvas extends Component {
    constructor(props) {
      super(props);
      this.state = {
          uploaded_image: '',
          latest_uploaded_image: false
      };
    }
    componentDidMount() {
        this.props.setCanvas({ canvas: this.canvas, grid: this.canvas_grid });
        this.props.setCanvasContext({ canvas: this.canvas.getContext('2d'), grid: this.canvas_grid.getContext('2d') });
        this.resetCanvas();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.pixel_size!==this.props.pixel_size){
            this.makeGrid(nextProps.pixel_size);
        }
        if(!!nextProps.uploaded_image && !!nextProps.uploaded_image.loading && !this.state.loading){
            this.setState({ loading: true });
        }
        if(!!nextProps.uploaded_image && !nextProps.uploaded_image.loading && !!this.state.loading){
            this.setState({ loading: false });
        }

        if(nextProps.canvas_clear!==this.props.canvas_clear){
            this.resetCanvas(true);
            this.props.clearCanvas(false);
        }
    }
    resetCanvas(v) {
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.grid_ctx = this.canvas_grid.getContext('2d');
        this.props.setCanvas({ canvas: this.canvas, grid: this.canvas_grid });
        this.props.setCanvasContext({ canvas: this.canvas.getContext('2d'), grid: this.canvas_grid.getContext('2d') });

        var w = (this.props.default_props ? this.props.default_props.canvas_width : this.canvas.clientWidth);
        var h = (this.props.default_props ? this.props.default_props.canvas_height : this.canvas.clientHeight);

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
        var w = this.grid_ctx.canvas.width,
            h = this.grid_ctx.canvas.height;
        var size = size || this.props.pixel_size ||this.props.default_props.render_pixel_size;

        var pixels = [];

        this.grid_ctx.clearRect(0, 0, w, h );

        // Draw a checker board
        let lastNum = 0;
        for (let i = 0; i< w*6; (i=i+size)){
          pixels.push(lastNum);
          lastNum = (lastNum == 0 ? 1 : 0);
        }
        for (var row = 0; row < w; row++) {
            for (var col = 0; col < h; col++) {
                var i = 5 * row + col;
                if (pixels[i] == 1) {
                  this.grid_ctx.fillStyle = "#f1f4f5";
                  this.grid_ctx.fillRect(col * size, row * size, size, size);
                }
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
    drawPixelOnScreen(x, y, color, clear) {
        if (!clear || clear == null) clear = false;
        const pixel = {
            x, y,color,
            size: this.props.pixel_size,
        };
        if (!!clear) {
            this.ctx.clearRect(x, y, this.props.pixel_size, this.props.pixel_size);
            this.props.removePixelFromArray(pixel);
        } else {
            this.ctx.fillStyle = this.props.pixel_color;
            this.ctx.fillRect(x, y, this.props.pixel_size, this.props.pixel_size);
            this.props.addPixelToArray(pixel);
        }

    };



    _onMouseUp(e) { this.mouse_down = false; }
    _onMouseLeave(e) { this.mouse_down = false; }
    _onMouseEnter(e) { this.mouse_down = false; }
    _onMouseMove(e) {
        if(!!this.mouse_down){
            this.drawPixel(e);
        }
    }
    _onMouseDown(e) {
        this.mouse_down = true;
        this.drawPixel(e);
    }

    drawPixel(e){
        const pixel_size = this.props.pixel_size;
        const pixel_color = this.props.pixel_color;
        const current_tool = this.props.current_tool;

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
        if (e.ctrlKey || e.metaKey || current_tool=="eraser") {
            this.drawPixelOnScreen(cx, cy, null, true); // ERASE PIXELS IF CURRENT SELECTED TOOL IS ERASER
        } else {
            this.drawPixelOnScreen(cx, cy, pixel_color); // DRAW PIXELS
        }
    }
    renderLoaderOnCanvas(){
        if(!!this.state.loading){
            const loader_style = {
                width: ( this.canvas ? this.canvas.width : this.props.default_props.canvas_width),
                height: ( this.canvas ? this.canvas.height : this.props.default_props.canvas_height),
            }
            return(
                <div className="loader_wrap" style={loader_style}>
                    <div className="progress_loader" aria-busy='true' aria-label='Loading' role='progressbar'></div>
                </div>
            )
        }

    }
    render(){

        return (
            <div>
                <div className="canvas_wrap">
                    {this.renderLoaderOnCanvas()}
                    <canvas className="grid_canvas" ref={(c) => this.canvas_grid = c} width={this.props.default_props.canvas_width} height={this.props.default_props.canvas_height} ></canvas>
                    <canvas className="pixel_canvas"
                        ref={(c) => this.canvas = c}
                        width={this.props.default_props.canvas_width} height={this.props.default_props.canvas_height}
                        onMouseDown={this._onMouseDown.bind(this)}
                        onMouseUp={this._onMouseUp.bind(this)}
                        onMouseMove={this._onMouseMove.bind(this)}
                        onMouseLeave={this._onMouseLeave.bind(this)}
                        onMouseEnter={this._onMouseEnter.bind(this)}
                        ></canvas>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
      default_props: state.default_props,
      current_tool: state.current_tool,
      pixel_size: state.pixel_size,
      pixel_color: state.pixel_color,
      canvas_clear: state.canvas_clear,
      uploaded_image: state.uploaded_image,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
      clearCanvas,
      setCanvas,
      setCanvasContext,
      renderUploadedImage,
      addPixelToArray,
      removePixelFromArray
  }, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PixelCanvas);
