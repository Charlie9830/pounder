import React from 'react'; 
import ReactDOM from 'react-dom';

class ContextMenuContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        if (this.props.parentScrollRef !== undefined && this.props.parentScrollRef !== null) {
            this.props.parentScrollRef.style.setProperty('overflow-y', 'hidden');
        }
    }

    componentWillUnmount() {
        if (this.props.parentScrollRef !== undefined && this.props.parentScrollRef !== null) {
            this.props.parentScrollRef.style.setProperty('overflow-y', 'scroll');
        }
    }

    render() {
        var containerStyle = {
            position: "fixed",
            left: this.props.offsetX,
            top: this.props.offsetY,
            zIndex: 50,
        }

        var contentJSX = (
            <div style={containerStyle}>
                {this.props.children}
            </div>
        )

        return ReactDOM.createPortal(contentJSX, document.getElementById('root'));
    }
}

export default ContextMenuContainer;