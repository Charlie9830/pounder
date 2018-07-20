import React from 'react';
import '../assets/css/Button.css';
import ReactTooltip from 'react-tooltip';

class Button extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getIconJSX = this.getIconJSX.bind(this);
        this.getTextJSX = this.getTextJSX.bind(this);
        this.getTooltipJSX = this.getTooltipJSX.bind(this);
    }

    render() {
        var iconJSX = this.getIconJSX();
        var textJSX = this.getTextJSX();
        var isEnabled = this.props.isEnabled === undefined ? true : this.props.isEnabled;
        var tooltipJSX = this.getTooltipJSX();

        return (
            <React.Fragment>
                <div className="ButtonTooltipContainer"
                    data-tip={this.props.tooltip}
                    data-border
                    data-delay-show={500}>
                    <div className="ButtonContainer" data-isenabled={isEnabled} data-size={this.props.size} onClick={(e) => { this.props.onClick(e) }}>
                        <div className="ButtonContentFlexContainer">
                            {iconJSX}
                            {textJSX}
                        </div>
                    </div>
                    {tooltipJSX}
                </div>
            </React.Fragment>
        )
    }

    getTooltipJSX() {
        if (this.props.tooltip !== undefined) {
            return (
                <ReactTooltip />
            )
        }
    }

    getIconJSX() {
        if (this.props.iconSrc !== undefined) {
            return (
                <div className="ButtonContentFlexItemContainer">
                    <img className="ButtonIcon" src={this.props.iconSrc}/>
                </div>
            )
        }
    }

    getTextJSX() {
        if (this.props.text !== undefined) {
            return (
                <div className="ButtonContentFlexItemContainer">
                    <div className="ButtonText" data-size={this.props.size}> {this.props.text} </div>
                </div>
            )
        }
    }
}

export default Button;