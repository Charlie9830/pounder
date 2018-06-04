import React from 'react';
import Button from './Button';
import CenteringContainer from '../containers/CenteringContainer';
import '../assets/css/Snackbar.css';
import { connect } from 'react-redux';
import { dismissSnackbar } from 'pounder-redux/action-creators';

class Snackbar extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getButtonJSX = this.getButtonJSX.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // Set a self dismissing timer if isSnackbarSelfDissming has toggled to true AND isSnackbarOpen has toggled to True.
        if (this.props.isSnackbarSelfDismissing === true && this.props.isSnackbarOpen === true) {
            // Set a Self Dismiss Timer.
            setTimeout( () => {
                this.props.dispatch(dismissSnackbar());
            }, 10 * 1000);
        }
    }

    render() {
        var buttonJSX = this.getButtonJSX();
        return (
            <div className="SnackbarContainer" data-isopen={this.props.isSnackbarOpen}>
                <div className="SnackbarHorizontalFlexContainer">
                    <div className="SnackbarMessageContainer">
                        <div className="SnackbarMessage">
                         {this.props.snackbarMessage}
                          </div>
                    </div>
                    
                </div>
            </div>
        )
    }

    getButtonJSX() {
        if (this.props.isSnackbarSelfDismissing !== true) {
            return (
                <div className="SnackbarButtonContainer">
                        <Button text="Dismiss" onClick={() => {this.props.dispatch(dismissSnackbar())}} />
                </div>
            )
        }
    }
}

let mapStateToProps = state => {
    return {
        isSnackbarOpen: state.isSnackbarOpen,
        snackbarMessage: state.snackbarMessage,
        isSnackbarSelfDismissing: state.isSnackbarSelfDismissing,
    }
}

let VisibleSnackbar = connect(mapStateToProps)(Snackbar);

export default VisibleSnackbar;