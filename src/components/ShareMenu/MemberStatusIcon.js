import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ClockIcon from '@material-ui/icons/AccessTime';
import CrossIcon from '@material-ui/icons/Clear';

const MemberStatusIcon = (props) => {
    switch(props.status) {
        case "pending":
        return <ClockIcon fontSize="small"/>

        case "added":
        return <CheckIcon fontSize="small"/>

        case "denied":
        return <CrossIcon fontSize="small"/>

        default:
        return null;
    }
}

export default MemberStatusIcon;