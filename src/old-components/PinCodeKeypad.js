import React from 'react';
import '../assets/css/PinCodeKeypad.css';

class PinCodeKeypad extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleNumberClick = this.handleNumberClick.bind(this);
    }
    
    render() {
        return (
            <div className="PinCodeKeypadContainer">
                {/* Row 1 */}
                <div className="PinCodeRowContainer">
                    <div className="PinCodeButton" data-number="1" onClick={this.handleNumberClick}>
                        1
                    </div>
                    <div className="PinCodeButton" data-number="2" onClick={this.handleNumberClick}>
                        2
                    </div>
                    <div className="PinCodeButton" data-number="3" onClick={this.handleNumberClick}>
                        3
                    </div>
                </div>

                {/* Row 2 */}
                <div className="PinCodeRowContainer">
                    <div className="PinCodeButton" data-number="4" onClick={this.handleNumberClick}>
                        4
                </div>
                    <div className="PinCodeButton" data-number="5" onClick={this.handleNumberClick}>
                        5
                </div>
                    <div className="PinCodeButton" data-number="6" onClick={this.handleNumberClick}>
                        6
                </div>
                </div>

                {/* Row 3 */}
                <div className="PinCodeRowContainer">
                    <div className="PinCodeButton" data-number="7" onClick={this.handleNumberClick}>
                        7
                </div>
                    <div className="PinCodeButton" data-number="8" onClick={this.handleNumberClick}>
                        8
                </div>
                    <div className="PinCodeButton" data-number="9" onClick={this.handleNumberClick}>
                        9
                </div>
                </div>

                {/* Row 4 */}
                <div id="PinCodeZeroButton" data-number="0" onClick={this.handleNumberClick}>
                    0
                </div>
            </div>
        )
    }

    handleNumberClick(e) {
        this.props.onKeypadButtonPress(e.target.dataset.number);
    }
}

export default PinCodeKeypad;