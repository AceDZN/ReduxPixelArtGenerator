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
                css_text: props.css_generator.generated_text
            });
        }
    }

    render() {
        return (<div className="code-block"><textarea id="output" value={this.state.css_text}></textarea></div>);
    }
}

function mapStateToProps(state) {
  return {
    css_generator: state.css_generator
  }
}

export default connect(mapStateToProps)(CssCodeBlock);
