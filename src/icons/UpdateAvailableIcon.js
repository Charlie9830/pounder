import React from 'react';
import { SvgIcon } from '@material-ui/core';

const UpdateAvailableIcon = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" width="24" height="24">
        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
        </SvgIcon>
    );
};

export default UpdateAvailableIcon;