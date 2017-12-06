import React,{ Component } from 'react';
import ForkBanner from './fork-banner';
import PixelCanvas from '../containers/pixel-canvas';
import PreviewBlock from '../containers/preview-block';
import CanvasToolsMenu from '../containers/tools-menu';
import CssCodeBlock from '../containers/css-code-block';

export default class App extends Component {
    render() {
        return (
            <div>
                <ForkBanner url="https://github.com/AceDZN/ReduxGulpStarterKit" />
                <CanvasToolsMenu />
                <div className="css-code-block">
                    <CssCodeBlock />
                </div>

                <PixelCanvas/>
                <div className="container">
                    <div className="row">
                        <div className="col">

                        </div>
                        <div className="col">
                            <PreviewBlock />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
