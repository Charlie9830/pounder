import React from 'react';
import { DatePicker as MuiDatePicker } from 'material-ui-pickers';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const NakedDatePicker = (props) => {
    return (
        <MuiDatePicker
        ref={props.forwardedRef}
        {...props}
        leftArrowIcon={<ArrowLeftIcon/>}
        rightArrowIcon={<ArrowRightIcon/>}
        />
    );
};

const DatePicker = React.forwardRef( (props, ref) => {
    return <NakedDatePicker {...props} forwardedRef={ref}/>
})

export default DatePicker;