import React,{ Component } from 'react';
import ForkBanner from './fork-banner';
import PixelCanvas from '../containers/pixel-canvas';
import PreviewBlock from '../containers/preview-block';
import CanvasToolsMenu from '../containers/tools-menu';

export default class App extends Component {
    render() {
        return (
            <div>
                <ForkBanner url="https://github.com/AceDZN/ReduxGulpStarterKit" />
                <CanvasToolsMenu />
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <PixelCanvas/>
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
