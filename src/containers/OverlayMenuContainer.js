import React from 'react';
import ReactDOM from 'react-dom';
import CenteringContainer from './CenteringContainer';
import { EnableBodyScroll, DisableBodyScroll } from '../utilities/DOMHelpers';
import '../assets/css/Containers/OverlayMenuContainer.css';

class OverlayMenuContainer extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.overlayMenuContainerRef = React.createRef();

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
            <div className="OverlayMenuContainer" ref={this.overlayMenuContainerRef}
                onKeyPress={this.handleContainerKeyPress} onClick={(e) => { this.handleContainerClick(e, 'outside') }}>
                <CenteringContainer>
                        <div onClick={(e) => { this.handleContainerClick(e, 'inside') }}>
                            {this.props.children}
                        </div>
                </CenteringContainer>
            </div>
        )

        return ReactDOM.createPortal(jsx, document.getElementById('root'));
    }

    handleContainerKeyPress(e) {
        if (this.props.onKeyPress !== undefined) {
            this.props.onKeyPress(e);
        }
    }

    handleContainerClick(e, location) {
        e.stopPropagation();
        if (location === 'outside') {
            if (this.props.onOutsideChildBoundsClick !== undefined) {
                this.props.onOutsideChildBoundsClick(e);
            }
        }
    }
}

export default OverlayMenuContainer;