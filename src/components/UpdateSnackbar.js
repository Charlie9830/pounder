import React from 'react';
import Button from './Button';
import '../assets/css/UpdateSnackbar.css';
import { connect } from 'react-redux';
import UpdateIcon from '../assets/icons/UpdateIcon.svg';
import { setIsUpdateSnackbarOpen } from 'handball-libs/libs/pounder-redux/action-creators';
import electron from 'electron';

class UpdateSnackbar extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleLaterClick = this.handleLaterClick.bind(this);
        this.handleInstallClick = this.handleInstallClick.bind(this);
    }

    render() {
        return (
            <div className="UpdateSnackbarContainer" data-isopen={this.props.isUpdateSnackbarOpen}>
                <div className="UpdateSnackbarHorizontalFlexContainer">
                    <img className="UpdateSnackbarIcon" src={UpdateIcon}/>
                    <div className="UpdateSnackbarMessageContainer">
                        <div className="UpdateSnackbarMessage">
                            A new update is downloaded and ready to install!
                        </div>
                    </div>
                    <Button text="Later" onClick={this.handleLaterClick}/>
                    <Button text="Install" onClick={this.handleInstallClick} />
                </div>
            </div>
        )
    }

    handleLaterClick() {
        this.props.dispatch(setIsUpdateSnackbarOpen(false));
    }

    handleInstallClick() {
        electron.ipcRenderer.send('install-update');
        this.props.dispatch(setIsUpdateSnackbarOpen(false));
    }
}

let mapStateToProps = state => {
    return {
        isUpdateSnackbarOpen: state.isUpdateSnackbarOpen,
    }
}

let VisibleUpdateSnackbar = connect(mapStateToProps)(UpdateSnackbar);

export default VisibleUpdateSnackbar;