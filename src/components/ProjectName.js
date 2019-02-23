import React from 'react';
import { Typography } from '@material-ui/core';

const ProjectName = (props) => {
    return (
        <Typography
            variant="h6"
            style={{ paddingLeft: '8px', paddingRight: '16px' }}>
            {props.name}
        </Typography>
    );
};

export default ProjectName;