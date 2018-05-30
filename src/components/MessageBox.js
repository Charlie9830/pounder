import React from 'react';
import Modal from 'react-modal';
import '../assets/css/MessageBox.css';
import '../assets/css/ToolBarButton.css';

class MessageBox extends React.Component {
    constructor(props) {
        super(props);

        this.handleCancelButtonClick = this.handleCancelButtonClick.bind(this);
        this.handleOkButtonClick = this.handleOkButtonClick.bind(this);
        this.getButtonsJSX = this.getButtonsJSX.bind(this);
    }

    render() {
        var buttonsJSX = this.getButtonsJSX();
        return (
            <Modal portalClassName="ModalPortal" className="ModalContent" overlayClassName="ModalOverlay" isOpen={this.props.isOpen}
            ariaHideApp={false}>
                <div className="MessageBoxVerticalFlexContainer">
                    <div className="MessageBoxMessageContainer">
                        <div className="MessageBoxMessage">
                            {this.props.message}
                        </div>
                    </div>
                    {buttonsJSX}
                </div>
            </Modal>
        )
    }

    getButtonsJSX() {
        if (!this.props.okOnly === undefined || this.props.okOnly === true) {
            return (
                <div className="ToolBarButtonContainer" onClick={this.handleOkButtonClick}>
                    <div className="ToolBarButton">
                        Ok
                            </div>
                </div>
            )
        }

        else {
            return (
                <div className="MessageBoxButtonFooter">
                    <div className="ToolBarButtonContainer" onClick={this.handleCancelButtonClick}>
                        <div className="ToolBarButton">
                            Cancel
                            </div>
                    </div>
                    <div className="ToolBarButtonContainer" onClick={this.handleOkButtonClick}>
                        <div className="ToolBarButton">
                            Ok
                            </div>
                    </div>
                </div>
            )
        }
    }

    handleOkButtonClick() {
        this.props.onDialogClosing("ok");
        
    }

    handleCancelButtonClick() {
        this.props.onDialogClosing("cancel");
    }
}

export default MessageBox;