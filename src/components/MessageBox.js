import React from 'react';
import Modal from 'react-modal';
import Button from './Button';
import { MessageBoxTypes } from 'pounder-redux';
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
        var buttonsJSX = this.props.config.isOpen === undefined ? (<div/>) : this.getButtonsJSX();
        var isOpen = typeof this.props.config.isOpen === 'boolean' ? this.props.config.isOpen : false;
        var message = this.props.config.message === undefined ? "" : this.props.config.message;

        return (
            <Modal portalClassName="ModalPortal" className="ModalContent" overlayClassName="ModalOverlay" isOpen={isOpen}
            ariaHideApp={false}>
                <div className="MessageBoxVerticalFlexContainer">
                    <div className="MessageBoxMessageContainer">
                        <div className="MessageBoxMessage">
                            {message}
                        </div>
                    </div>
                    {buttonsJSX}
                </div>
            </Modal>
        )
    }
 
    getButtonsJSX() {
        if (this.props.config.type === MessageBoxTypes.OK_ONLY) {
            return (
                <div className="MessageBoxButtonFooter">
                    <Button text="Ok" onClick={this.handleOkButtonClick}/>
                </div>
            )
        }

        else {
            return (
                <div className="MessageBoxButtonFooter">
                    <Button text="Cancel" onClick={this.handleCancelButtonClick}/>
                    <Button text="Ok" onClick={this.handleOkButtonClick}/>
                </div>
            )
        }
    }

    handleOkButtonClick() {
        if (this.props.config.closeCallback !== undefined) {
            this.props.config.closeCallback("ok");
        }    
    }

    handleCancelButtonClick() {
        if (this.props.config.closeCallback !== undefined) {
            this.props.config.closeCallback("cancel");
        }  
    }
}

export default MessageBox;