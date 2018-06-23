import React from 'react';
import ReactDOM from 'react-dom';
import { EnableBodyScroll, DisableBodyScroll } from '../utilities/DOMHelpers';
import '../assets/css/Containers/OverlayMenuContainer.css';

class OverlayMenuContainer extends React.Component {
    constructor(props) {
        super(props);

        // Method Binding.
        this.handleContainerKeyPress = this.handleContainerKeyPress.bind(this);
        this.handleContainerClick = this.handleContainerClick.bind(this);

    }

    componentDidMount() {
        DisableBodyScroll();
    }

    componentWillUnmount() {
        EnableBodyScroll();
    }

    render() {
        var jsx = (
            <div className="OverlayMenuContainer" onKeyPress={this.handleContainerKeyPress} onClick={this.handleContainerClick}>
                {this.props.children}
            </div>
        )

        return ReactDOM.createPortal(jsx, document.getElementById('root'));
    }

    handleContainerKeyPress(e) {
        if (this.props.onKeyPress !== undefined) {
            this.props.onKeyPress(e);
        }
    }

    handleContainerClick(e) {
        if (this.props.onClick !== undefined) {
            this.props.onClick(e);
        }
    }
    
}

export default OverlayMenuContainer;