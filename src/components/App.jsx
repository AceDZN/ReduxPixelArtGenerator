import React, {Component} from 'react';
import AceLogo from './AceLogo.jsx';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              {this.props.children}
            </div>
          </div>
        </div>
        <AceLogo />
      </div>
    )
  }
}

export default App
