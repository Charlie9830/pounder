import React from 'react';
import ReactDOM from 'react-dom';
import { ChromePicker } from 'react-color';
import Button from '../Button';
import ContextMenuContainer from '../../containers/ContextMenuContainer';
import ColorPickerContainer from '../../containers/ColorPickerContainer';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class ThemeSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openColorPickerIndex: -1,
            colorPickerOffset: {x: 0, y: 0}
        }

        // Method Bindings.
        this.handleHighlightButtonMouseDown = this.handleHighlightButtonMouseDown.bind(this);
        this.handleHighlightButtonMouseUp = this.handleHighlightButtonMouseUp.bind(this);
        this.getZeroFilledCssValues = this.getZeroFilledCssValues.bind(this);
        this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
        this.getColorPicker = this.getColorPicker.bind(this);
        this.handleColorPickerSelect = this.handleColorPickerSelect.bind(this);
        this.handleDefaultButtonClick = this.handleDefaultButtonClick.bind(this);
        this.handleColorPickerCloseButtonClick = this.handleColorPickerCloseButtonClick.bind(this);
        this.handleDefaultAllColorsButtonClick = this.handleDefaultAllColorsButtonClick.bind(this);
    }

    render() {
        var zeroFilledCssValues = this.getZeroFilledCssValues();
        console.log("ThemeSettings Render() " + this.props.contentContainerRef.current);

        var jsx = zeroFilledCssValues.map((item,index) => {
            
            var colorDisplayStyle = {
                height: '20px',
                width: '100px',
                background: item.value,
                border: 'gray 1px solid',
            }

            const friendlyPropertyName = this.parsePropertyName(item.property);
            const showColorPicker = index === this.props.colorPicker.index;
            const colorPicker = this.getColorPicker(showColorPicker, item.property, item.value );

            return (
                <div key={index} className="CSSSelectorsRowGrid">
                    <span className="CSSSelectors-label">
                        <div className="AppSettingsItemLabel">{friendlyPropertyName}</div>
                    </span>
                    <span className="CSSSelectors-value">
                        <div style={colorDisplayStyle} onClick={(e) => {this.handleColorPickerClick(e,index)}}>
                            {colorPicker}
                        </div>
                    </span>
                    <span className="CSSSelectors-defaultButton">
                        <Button text="Default" size="small" onClick={() => {this.handleDefaultButtonClick(item.property)}}/>
                    </span>
                </div>
            )
        })

        return (
            <div>
                {jsx}
                <div className="CSSSelectorsRowGrid">
                    <div className="CSSSelectorsGridDivider"/>
                </div>
                <div className="CSSSelectorsRowGrid">
                    <div className="CSSSelectors-label">
                        <div className="ResetColorSettingsLink" onClick={this.handleDefaultAllColorsButtonClick}>
                         Reset all colors to default
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleDefaultAllColorsButtonClick() {
        this.props.onDefaultAllColorsButtonClick();
    }

    handleDefaultButtonClick(propertyName) {
        // Determine default Value. Instead of having to deal directly with the CSS Stylesheet from here. We just remove the
        // rule (which removes it from the inline style), then read the Computed Style. This means the browser does the work of
        // falling back to the Stylesheet for us.
        var appRoot = document.getElementById('root')
        appRoot.style.removeProperty(propertyName);
        var value = window.getComputedStyle(appRoot).getPropertyValue(propertyName);

        this.props.onCSSPropertyChange(propertyName, value);
    }

    getColorPicker(showColorPicker, propertyName, currentColor) {
        if (showColorPicker) {
            var colorPicker = (
                <ChromePicker color={currentColor} disableAlpha={true}
                onChangeComplete={(newColor, e) => { this.handleColorPickerSelect(newColor, e, propertyName) }} />
            )

            return (
                <ContextMenuContainer offsetX={this.props.colorPicker.xOffset} offsetY={this.props.colorPicker.yOffset}
                parentScrollRef={this.props.contentContainerRef.current}>
                    <ColorPickerContainer onCloseButtonClick={this.handleColorPickerCloseButtonClick}>
                        {colorPicker}
                    </ColorPickerContainer>
                </ContextMenuContainer>
            )
        }     
    }

    handleColorPickerCloseButtonClick() {
        this.props.onColorPickerCloseButtonClick();
    }

    handleColorPickerSelect(newColor, e, propertyName) {
        this.props.onCSSPropertyChange(propertyName, newColor.hex);
    }

    handleColorPickerClick(e,index) {
        if (index === this.props.colorPicker.index) {
            e.stopPropagation();
        }

        if (this.props.colorPicker.index === -1) {
            this.props.onColorPickerClick(index, e.clientX, e.clientY);
        }
    }

    getZeroFilledCssValues() {
        // Parse the cssConfig object into a "Zero Filled" object. Blanks replaced by current Computed Values.
        var computedStyle = window.getComputedStyle(document.getElementById('root'));
        var filledCSSVariables = [];

        for (var property in this.props.cssConfig) {
            var value = this.props.cssConfig[property];
            var filledValue = value === "" ? computedStyle.getPropertyValue(property) : value;
            filledCSSVariables.push({property: property, value: filledValue});
        }

        return filledCSSVariables;
    }

    handleHighlightButtonMouseDown(propertyName) {
        this.highlightValueBuffer = window.getComputedStyle(document.getElementById('root')).getPropertyValue(propertyName);
        document.getElementById('root').style.setProperty(propertyName, "red");
    }

    handleHighlightButtonMouseUp(propertyName) {
        document.getElementById('root').style.setProperty(propertyName, this.highlightValueBuffer);
    }

    parsePropertyName(propertyName) {
        // Remove leading hypens, then replace non Leading hypens with spaces.
        var workingString = propertyName.replace('--','').replace(/-/g,' ');
        return this.toTitleCase(workingString);
    }

    toTitleCase(str) {
        str = str.toLowerCase()
            .split(' ')
            .map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            });

        return str.join(' ');
    }
}


export default ThemeSettings;