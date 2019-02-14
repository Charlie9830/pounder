import React from 'react';
import { Popover, Toolbar, IconButton, Collapse, ClickAwayListener } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const Expander = (props) => {
    return (
        <div>
            <Collapse
                collapsedHeight="0px"
                in={!props.open}
                unmountOnExit={true}
                mountOnEnter={true}>
                    {props.closedComponent}
            </Collapse>

            <Collapse
                collapsedHeight="0px"
                in={props.open}
                unmountOnExit={true}
                mountOnEnter={true}>
                <ClickAwayListener
                onClickAway={props.onClose}>
                    <div
                        style={{ overflowY: 'hidden' }}
                        onClick={(e) => { e.stopPropagation() }}>
                        {props.openComponent}
                    </div>
                </ClickAwayListener>
            </Collapse>
        </div>
    );
};


export default Expander;