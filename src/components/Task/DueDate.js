import React from 'react';
import Color from 'color';
import colorString from 'color-string';
import { withTheme, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const DueDate = (props) => {
    let { theme } = props;
    let isSet = props.type !== "unset";

    if (isSet === false) {
        if (theme.hideTaskEditIcon) {
            return null;
        }
        
        else {
            return (
                <div style={{ margin: `${theme.spacing.unit}px` }}>
                    <IconButton>
                        <EditIcon color="disabled" fontSize="small" />
                    </IconButton>
                </div>
            )
        }
    }

    let color = isSet ? props.color : "transparent";
    let textColor = props.type === "unset" ? "unset" : getTextColor(color)

    let baseStyle = {
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isSet === true ? 'transparent' : theme.palette.text.secondary,
        background: color,
        margin: `${theme.spacing.unit}px`,
    }

    let textStyle = {
        flexShrink: '1',
        fontFamily: theme.typography.caption.fontFamily,
        fontSize: '7pt',
        fontWeight: '700',
        color: textColor,
    }

    return (
      <div style={baseStyle}>
        <div style={textStyle}> {props.text} </div>
      </div>
    );
};

const getTextColor = (backgroundColor) => {
    if (backgroundColor === undefined || backgroundColor === "transparent") {
        return "#FFF"
    }

    let color = colorString.get(backgroundColor);
    
    if (Color.rgb(color.value).isLight()) {
        return '#000'
    }

    else {
        return '#FFF'
    }
}

export default withTheme()(DueDate);