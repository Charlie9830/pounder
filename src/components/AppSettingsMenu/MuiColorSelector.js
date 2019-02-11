import React from 'react';
import MuiColorChit from './MuiColorChit';

import Slider from 'rc-slider';
import { GetNumberFromIndex } from '../../utilities/MuiColors';
import '../../assets/css/rc-slider/index.css';
import { FormControlLabel } from '@material-ui/core';

let container = {
    flexGrow: '1',
    width: '100%',
    display: 'grid',
    gridTemplateRows: '[Slider]64px [Chits]1fr',
}

let sliderContainer = {
    gridRow: 'Slider',
    placeSelf: 'flex-start stretch',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}

let chitContainer = {
    gridRow: 'Chits',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
}

const MuiColorSelector = (props) => {
    if (props.muiColors === undefined) {
        return null;
    }

    let muiNumber = GetNumberFromIndex(props.shadeIndex);
    let colorChits = props.muiColors.map( (item, index) => {
        return (
            <MuiColorChit
            key={index}
            isSelected={ item.id === props.colorId }
            color={item.color[muiNumber]}
            onClick={() => { props.onChange(item.id, props.shadeIndex )}}/>
        )
    })

    return (
        <div style={container}>
            <div
                style={sliderContainer}>
                <FormControlLabel
                    style={{width: '100%'}}
                    label="Shade"
                    labelPlacement="top"
                    control={
                        <Slider
                            onChange={(value) => { props.onChange(props.colorId, value) }}
                            value={props.shadeIndex}
                            min={0}
                            max={13}
                            step={1} />
                    } />

            </div>
            <div
                style={chitContainer}>
                {colorChits}
            </div>
        </div>
        
    );
};

export default MuiColorSelector;