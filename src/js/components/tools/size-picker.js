import React,{ Component } from 'react';
export default class SizePicker extends Component {
    constructor(props) {
      super(props);
      this.state = {
          selected_size: this.props.selected,
          key_prefix: this.props.key
      };
    }
    componentWillReceiveProps(nextProps){
        if(!!nextProps.selected && nextProps.selected !== this.props.selected){
            this.setState({selected_size: nextProps.selected});
        }
    }
    handleButtonClick(s){
        this.setState({selected_size: s});
        this.props.onClick(s);
    }
    getPaginationClassName(c){
        if(c == this.state.selected_size){
            return "page-item active"
        } else {
            return "page-item"
        }
    }
    renderBrushSizePicker(){
        if(this.props.sizelist){
            let size_list = this.props.sizelist;
            let size_elements = size_list.map(function(size){
                return (<li key={this.state.key+'_'+size} className={this.getPaginationClassName(size)}  onClick={()=>this.handleButtonClick(size)}><a className="page-link" href="#" >{size}</a></li>)
            }.bind(this));
            return (
                <ul className="pagination">
                    <li className="page-item active "><a className="page-link icon_item" href="#" ><svg dangerouslySetInnerHTML={{__html: this.props.icon }} /></a></li>
                    {size_elements}
                </ul>
            );
        }
    }
    render() {
        return (
            <div>
                {this.renderBrushSizePicker()}
            </div>
        );
    }
}
