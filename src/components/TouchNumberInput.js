import React, { Component } from 'react';
import IncreaseIcon from '@material-ui/icons/AddCircleOutline';
import DecreaseIcon from '@material-ui/icons/RemoveCircleOutline';
import { IconButton, Typography } from '@material-ui/core';

let grid = {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '[Decrease]auto [Value]auto [Increase]auto'
}

class NumberInput extends Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleIncreaseButtonClick = this.handleIncreaseButtonClick.bind(this);
        this.handleDecreaseButtonClick = this.handleDecreaseButtonClick.bind(this);
    }

    render() {
        let value = this.props.value === undefined ? 0 : this.props.value;

        return (
            <div style={grid}>
                <div style={{gridColumn: 'Decrease', placeSelf: 'center'}}>
                    <IconButton
                    onClick={this.handleIncreaseButtonClick}>
                        <DecreaseIcon/>
                    </IconButton>
                </div>

                <div style={{gridColumn: 'Value', placeSelf: 'center'}}>
                    <Typography> {value} </Typography>
                </div>

                <div style={{gridColumn: 'Increase', placeSelf: 'center'}}>
                    <IconButton
                    onClick={this.handleDecreaseButtonClick}>
                        <IncreaseIcon/>
                    </IconButton>
                </div>
            </div>
        );
    }

    handleIncreaseButtonClick() {
        let newValue = this.props.value + this.props.increment;
        newValue = newValue > this.props.maxValue ? this.props.maxValue : newValue;

        this.props.onChange(newValue);
    }

    handleDecreaseButtonClick() {
        let newValue = this.props.value + this.props.increment;
        newValue = newValue < this.props.minValue ? this.props.minValue : newValue;

        this.props.onChange(newValue);
    }
}

export default NumberInput;