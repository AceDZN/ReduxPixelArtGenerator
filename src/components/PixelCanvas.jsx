import React,{Component} from 'react';

class PixelCanvas extends Component {

    constructor(props){
        super(props);
        this.state = {
            pixel_color : props.pixelColor || '#000000',
            pixel_size : props.pixelSize || 30,
        }
    }
    componentWillMount(){}

    componentDidMount(){

        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width  = this.w;
        this.ctx.canvas.height = this.h;
        this.setState({
            canvas_width: this.w,
            canvas_height: this.h,
        });

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
      if (clear == null) clear = false;
      this.ctx.fillStyle = this.state.pixel_color;
      if (clear) {
        this.ctx.clearRect(x, y, this.state.pixel_size, this.state.pixel_size);
      } else {
        this.ctx.fillRect(x, y, this.state.pixel_size, this.state.pixel_size);
      }
    };

    _onMouseDown(e) {
        console.log(this.getPosition(e),"getPosition(e)");
        console.log(e.screenX + ' / ' +e.screenY);
        this.setState({ x: e.screenX, y: e.screenY });

        e.preventDefault();
        var position = this.getPosition(e);

        var cx = (Math.floor(position.x / this.state.pixel_size) * this.state.pixel_size),
        cy = (Math.floor(position.y / this.state.pixel_size) * this.state.pixel_size);

        if (position.x + this.state.pixel_size > this.w) {
          cx = this.w - this.state.pixel_size;
        }
        if (position.y + this.state.pixel_size > this.h) {
          cy = this.h - this.state.pixel_size;
        }
        if (e.ctrlKey || e.metaKey) {
          this.drawPixel(cx, cy, null, true);
        } else {
          this.drawPixel(cx, cy, this.state.pixel_color);
        }


    }
    render() {
        return <canvas onMouseDown={this._onMouseDown.bind(this)} ref={(c) => this.canvas = c} />;
    }



}

export default PixelCanvas
