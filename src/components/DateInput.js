import React, { Component } from 'react';
import DatePicker from './DatePicker';
import { Typography } from '@material-ui/core';
import Moment from 'moment';

class DateInput extends Component {
    constructor(props) {
        super(props);
        
        // Refs.
        this.datePickerRef = React.createRef();

        // Method Bindings.
        this.getDateText = this.getDateText.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isOpen === false && this.props.isOpen === true) {
            this.datePickerRef.current.open();
        }

        if (prevProps.isOpen === true && this.props.isOpen === false) {
            this.datePickerRef.current.close();
        }
    }
    
    
    render() {
        let hasDate = this.props.value !== "";
        let momentDate = hasDate ? Moment(this.props.value) : null;
        let closedValue = hasDate ? this.getDateText(momentDate) : this.props.placeholder || "";
        let typographyColor = hasDate ? "textPrimary" : "textSecondary";

        return (
            <React.Fragment>
                <Typography
                    color={typographyColor}
                    onClick={ this.handleInputClick() }>
                    { closedValue }
                </Typography>

                <DatePicker
                    clearable={this.props.clearable}
                    autoOk={this.props.autoOk}
                    disableFuture={this.props.disableFuture}
                    disablePast={this.props.disablePast}
                    ref={this.datePickerRef}
                    style={{ display: 'none' }}
                    onChange={this.props.onChange}
                    value={momentDate}
                    onClose={this.props.onClose}
                />
            </React.Fragment>
        );
    }

    handleInputClick(e) {
        if (this.props.isOpen === undefined) {
            // Uncontrolled Mode
            this.datePickerRef.current.open()
        }   
    }

    getDateText(momentDate) {
        if (momentDate !== null) {
            return momentDate.format('dddd MMMM Do');
        }

        return "Add due date"
    }

    isDateSet(date) {
        return date !== "" || date !== undefined;
    }
}

export default DateInput;