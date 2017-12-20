import React, { Component } from 'react';

export class ToolButton extends Component {
    constructor(props) {
      super(props);
      this.state = {
          reveal_child: false,
      };
      this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(!!nextProps.active)
            this.setState({reveal_child: true});
        else
            this.setState({reveal_child: false});
    }
    handleButtonClick(s){
        if(!!this.props.children)
            this.setState({reveal_child: !this.state.reveal_child});
        if(this.props.onClick){
            this.props.onClick(s);
        }
    }
    getPaginationClassName(c){
        if(c == this.state.selected_size){
            return "page-item active"
        } else {
            return "page-item"
        }
    }
    renderButtonChildren(){
        if(!!this.props.active && this.props.children && !!this.state.reveal_child){
            return(
                <div className="child-reveal">{this.props.children}</div>
            )
        }
        return
    }
    renderSVGIcon(){
        if(!!this.props.icon){
            const svg_icon = `<use xlink:href="./images/svg/solid.svg#${this.props.icon}" />`;
            return (
                <svg dangerouslySetInnerHTML={{__html: svg_icon }} />
            )
        }
        return
    }
    renderClassName(){
        return `btn btn-info tool-button ${(!!this.props.className ? this.props.className : '')}}`
    }
    renderButton(){
        return (
            <button className={this.renderClassName()} onClick={this.handleButtonClick}>
                {this.renderSVGIcon()}
            </button>
        );
    }
    render() {
        return (
            <div className={`tool-item ${(!!this.props.active ? 'active' : '')}`}>
                { this.renderButton() }
                { this.renderButtonChildren() }
            </div>
        );
    }
}
