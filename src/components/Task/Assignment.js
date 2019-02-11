import React from 'react';
import AssignedToIcon from '@material-ui/icons/AssignmentInd';
import { Typography } from '@material-ui/core';

let grid = {
    display: 'grid',
    gridTemplateColumns: '[Icon]auto [DisplayName]1fr',
    columnGap: '8px',
}

const Assignment = (props) => {
    return (
        <div style={grid}>
            <div style={{ gridColumn: 'Icon', placeSelf: 'center' }}>
                <AssignedToIcon
                color="disabled"
                fontSize="small" />
            </div>

            <div style={{ gridColumn: 'DisplayName' }}>
                <Typography color="textSecondary"> {props.displayName} </Typography>
            </div>
        </div>
    );
};

export default Assignment;