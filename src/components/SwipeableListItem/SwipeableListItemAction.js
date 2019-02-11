import React from 'react';

const SwipeableListItemAction = (props) => {
    let containerStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: 'hidden',
        background: props.background,
    }
    
    return (
        <div style={containerStyle} onClick={props.onClick}>
            {props.children}
        </div>
    );
};

export default SwipeableListItemAction;