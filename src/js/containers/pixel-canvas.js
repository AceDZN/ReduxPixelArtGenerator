import React, {Component} from 'react';
import {connect} from 'react-redux';
import {clearCanvas, setCanvasContext} from '../actions/index';
import {bindActionCreators} from 'redux';



class PixelCanvas extends Component {
    componentDidMount() {
        this.props.setCanvasContext(this.canvas.getContext('2d'));
        this.resetCanvas();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.canvas_clear!==this.props.canvas_clear){
            this.resetCanvas();
            this.props.clearCanvas(false);
        }

    }
    resetCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.props.setCanvasContext(this.canvas.getContext('2d'));
        var w = this.canvas.clientWidth;
        var h = this.canvas.clientHeight;

        this.ctx.canvas.width  = w;
        this.ctx.canvas.height = h;
        this.makeGrid();
        this.setState({
            canvas_width: w,
            canvas_height: h,
        });


    }
    makeGrid() {
        var w = this.canvas.width,
            h = this.canvas.height;

        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0,0,w,h);

        for(var i = .5; i < w || i < h; i += 10) {
            // draw horizontal lines
            this.ctx.moveTo( i, 0 );
            this.ctx.lineTo( i, h);
            // draw vertical lines
            this.ctx.moveTo( 0, i );
            this.ctx.lineTo( w, i);
        }
        this.ctx.strokeStyle = 'hsla(0, 0%, 40%, .5)';
        this.ctx.stroke();
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


    render(){
        return (
            <div>
                <h1>Pixel CANVAS</h1>
                <canvas ref={(c) => this.canvas = c} width={this.props.canvas_width} height={this.props.canvas_height} onMouseDown={this._onMouseDown.bind(this)} ></canvas>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
    pixel_size: state.pixel_size,
    pixel_color: state.pixel_color,
    canvas_width: state.canvas_setup.width,
    canvas_height: state.canvas_setup.height,
    canvas_clear: state.canvas_clear,
    canvas_ctx: state.canvas_ctx
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({clearCanvas:clearCanvas,setCanvasContext:setCanvasContext}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(PixelCanvas);
