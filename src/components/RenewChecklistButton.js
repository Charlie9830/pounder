import React from 'react';
import { Button } from '@material-ui/core';

import RenewIcon from '@material-ui/icons/Refresh';

const RenewChecklistButton = (props) => {
    return (
        <Button
            variant="text"
            color="secondary"
            onClick={props.onClick}
            disabled={props.disabled}>
            <RenewIcon />
            Renew Checklist
        </Button>
    );
};

export default RenewChecklistButton;