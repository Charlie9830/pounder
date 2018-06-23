import React from 'react'; 
import ReactDOM from 'react-dom';

// window.innerWidth and window.innerHeight will give you the Parent container size.
// this.containerRef.current.getBoundingClientRect() will give you the Children Size.
const PADDING = 10;

class ContextMenuContainer extends React.Component {
    constructor(props) {
        super(props);
        // State.
        this.state = {
            actualOffsetX: 0,
            actualOffsetY: 0,
        }

        // Refs.
        this.containerRef = React.createRef();
        this.adjustOffsets = this.adjustOffsets.bind(this);
    }
    
    componentDidMount() {
        if (this.props.parentScrollRef !== undefined && this.props.parentScrollRef !== null) {
            this.props.parentScrollRef.style.setProperty('overflow-y', 'hidden');
        }

        this.adjustOffsets();
    }

    componentWillUnmount() {
        if (this.props.parentScrollRef !== undefined && this.props.parentScrollRef !== null) {
            this.props.parentScrollRef.style.setProperty('overflow-y', 'scroll');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.actualOffsetX !== this.state.actualOffsetX || prevState.actualOffsetY !== this.state.actualOffsetY) {
            this.adjustOffsets();
        }
    }

    render() {
        var containerStyle = {
            position: "fixed",
            width: 'fit-content',
            height: 'fit-content',
            left: this.state.actualOffsetX,
            top: this.state.actualOffsetY,
            zIndex: 50,
        }

        var contentJSX = (
            <div style={containerStyle} ref={this.containerRef}>
                {this.props.children}
            </div>
        )

        return ReactDOM.createPortal(contentJSX, document.getElementById('root'));
    }

    adjustOffsets() {
        // Calculate if the Child elements are rendering outside the Screen area. If so, adjust their position.
        
        var updateRequired = false;
        var windowHeight = Math.floor(window.innerHeight);
        var windowWidth = Math.floor(window.innerWidth);
        var childBoundingBox = this.containerRef.current.getBoundingClientRect();
        var childHeight = Math.floor(childBoundingBox.height);
        var childBottom = Math.floor(this.props.offsetY + childBoundingBox.height);
        var childRight = Math.floor(this.props.offsetX + childBoundingBox.width);
        var actualOffsetX = Math.floor(this.props.offsetX);
        var actualOffsetY = Math.floor(this.props.offsetY);



        // OffsetY.
        if (childBottom > windowHeight) {
            var overhang = childBottom - windowHeight;
            actualOffsetY = this.props.offsetY - overhang - PADDING;

            // Coerce to Positive Value.
            actualOffsetY = actualOffsetY < 0 ? 0 : actualOffsetY;
        }

        // OffsetX.
        if (childRight > windowWidth) {
            var overhang = childRight - windowWidth;
            actualOffsetX = this.props.offsetX - overhang - PADDING;;

            // Coerce to Positive Value.
            actualOffsetX = actualOffsetX < 0 ? 0 : actualOffsetX;
        }

        this.setState({
            actualOffsetX: actualOffsetX,
            actualOffsetY: actualOffsetY,
        });
    }
}

export default ContextMenuContainer;