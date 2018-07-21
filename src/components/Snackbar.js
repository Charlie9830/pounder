import React from 'react';
import Button from './Button';
import '../assets/css/Snackbar.css';
import { connect } from 'react-redux';
import { dismissSnackbar } from 'pounder-redux/action-creators';
import TickIcon from '../assets/icons/TickIcon.svg';
import CrossIcon from '../assets/icons/CrossIcon.svg';
import InfomationIcon from '../assets/icons/InfomationIcon.svg'
import ErrorIcon from '../assets/icons/ErrorIcon.svg';

class Snackbar extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getButtonJSX = this.getButtonJSX.bind(this);
        this.getIconJSX = this.getIconJSX.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // Set a self dismissing timer if isSnackbarSelfDissming has toggled to true AND isSnackbarOpen has toggled to True.
        if (this.props.isSnackbarSelfDismissing === true && this.props.isSnackbarOpen === true) {
            // Set a Self Dismiss Timer.
            setTimeout( () => {
                this.props.dispatch(dismissSnackbar());
            }, this.getDisplayDuration());
        }
    }

    render() {
        var type = this.props.snackbarType === undefined ? "affirmative-notification" : this.props.snackbarType;
        var buttonJSX = this.getButtonJSX();
        var iconJSX = this.getIconJSX(type);

        return (
            <div className="SnackbarContainer" data-type={type} data-isopen={this.props.isSnackbarOpen}>
                <div className="SnackbarHorizontalFlexContainer">
                    {iconJSX}
                    <div className="SnackbarMessageContainer">
                        <div className="SnackbarMessage" data-type={type}>
                         {this.props.snackbarMessage}
                          </div>
                    </div>
                    {buttonJSX}     
                </div>
            </div>
        )
    }

    getDisplayDuration() {
        var wordCount = this.props.snackbarMessage.split(' ').length;

        if (wordCount <= 4) {
            return 4 * 1000;
        }

        if (wordCount <= 10) {
            return 6 * 1000;
        }

        else {
            return 10 * 1000;
        }
    }

    getIconJSX(type) {
        if (type === "affirmative-notification") {
            return (
                <img className="SnackbarIcon" src={TickIcon} />
            )
        }

        if (type === "negative-notification") {
            return (
                <img className="SnackbarIcon" src={CrossIcon} />
            )
        }

        if (type === "infomation") {
            return (
                <img className="SnackbarIcon" src={InfomationIcon}/>
            )
        }

        if (type === "error") {
            return (
                <img className="SnackbarIcon" src={ErrorIcon}/>
            )
        }
    }

    getButtonJSX() {
        if (this.props.isSnackbarSelfDismissing !== true) {
            return (
                <div className="SnackbarButtonContainer">
                    <Button text="Dismiss" onClick={() => { this.props.dispatch(dismissSnackbar()) }} />
                </div>
            )
        }
    }
}

let mapStateToProps = state => {
    return {
        isSnackbarOpen: state.isSnackbarOpen,
        snackbarType: state.snackbarType,
        snackbarMessage: state.snackbarMessage,
        isSnackbarSelfDismissing: state.isSnackbarSelfDismissing,
    }
}

let VisibleSnackbar = connect(mapStateToProps)(Snackbar);

export default VisibleSnackbar;