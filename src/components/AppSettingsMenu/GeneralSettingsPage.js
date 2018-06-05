import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class GeneralSettingsPage extends React.Component {
    constructor(props) {
        super(props);
        
        // Method Bindings.
        this.getFavouriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX.bind(this);
        this.getColorPropertiesJSX = this.getColorPropertiesJSX.bind(this);
        this.handleStartInFullscreenChange = this.handleStartInFullscreenChange.bind(this);
        this.handleStartLockedChange = this.handleStartLockedChange.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleCSSPropertyInputBlur = this.handleCSSPropertyInputBlur.bind(this);
        this.handleCSSPropertyInputKeyPress = this.handleCSSPropertyInputKeyPress.bind(this);
    }

    render() {
        var favoriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX();
        var colorPropertiesJSX = this.getColorPropertiesJSX();

        return (
            <div className="AppSettingsVerticalFlexContainer">
                {/* Application startup Fullscreen Mode*/}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref="startInFullscreenCheckbox"
                    checked={this.props.generalConfig.startInFullscreen} onChange={this.handleStartInFullscreenChange}/>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Start application in fullscreen </div>
                    </span>
                </div>
                
                {/* Application Startup Locked Mode */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref="startLockedCheckbox"
                    checked={this.props.generalConfig.startLocked} onChange={this.handleStartLockedChange}/>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Automaticaly lock application on start up </div>
                    </span>
                </div>

                {/* Faviourte Project Selection */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Favourite project </div>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        {favoriteProjectSelectorJSX}
                    </span>
                </div>

                {/* Color Selection Title */}
                <div className="AppSettingsVerticalFlexItem">
                    <AppSettingsMenuSubtitle text="Application Color Selection"/>
                </div>

                {/* Color Selection Properties and Inputs */}
                {colorPropertiesJSX}
            </div>
        )
    }

    handleStartLockedChange() {
        var value = this.refs.startLockedCheckbox.checked;
        this.props.onStartLockedChange(value);
    }

    handleStartInFullscreenChange(e) {
        var value = this.refs.startInFullscreenCheckbox.checked;
        this.props.onStartInFullscreenChange(value);
    }

    getFavouriteProjectSelectorJSX() {
        // Build Projects into HTML Option Elements.
        var optionsJSX = this.props.projects.map((project,index) => {
            return (
                <option key={index + 1} value={project.uid}> {project.projectName} </option>
            )
        })

        // Append a "None" option.
        optionsJSX.unshift((<option key={0} value="-1"> None </option>))
        
        // Build options into HTML select Element.
        return (
            <select className="FavouriteProjectSelect" value={this.props.accountConfig.favouriteProjectId}
             ref="favourteProjectSelect" onChange={this.handleFavouriteProjectSelectChange}>
                {optionsJSX}
            </select>
        )
    }

    handleFavouriteProjectSelectChange() {
        var id = this.refs.favourteProjectSelect.value;
        this.props.onFavouriteProjectSelectChange(id);
    }

    getColorPropertiesJSX() {
        // Parse the cssConfig object into a "Zero Filled" object. Blanks replaced by current Computed Values.
        var computedStyle = window.getComputedStyle(document.getElementById('root'));
        var filledCSSVariables = [];

        for (var property in this.props.cssConfig) {
            var value = this.props.cssConfig[property];
            var filledValue = value === "" ? computedStyle.getPropertyValue(property) : value;
            filledCSSVariables.push({property: property, value: filledValue});
        }

        var jsx = filledCSSVariables.map((item,index) => {
            var colorDisplayStyle = {
                height: '20px',
                width: '20px',
                background: item.value,
                border: 'gray 1px solid'
            }

            return (
                <div key={index} className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel">{item.property}</div>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        <input className="AppSettingsItemInput" type="text" defaultValue={item.value}
                        onBlur={(e) => this.handleCSSPropertyInputBlur(e, item.property)}
                        onKeyPress={(e) => this.handleCSSPropertyInputKeyPress(e, item.property)}/>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div style={colorDisplayStyle}>
                        </div>
                    </span>
                </div>
            )
        })

        return jsx;
    }

    handleCSSPropertyInputKeyPress(e, propertyName) {
        if (e.key === "Enter") {
            this.props.onCSSPropertyChange(propertyName, e.target.value);
        }

    }

    handleCSSPropertyInputBlur(e, propertyName) {
        this.props.onCSSPropertyChange(propertyName, e.target.value);
    }
}

export default GeneralSettingsPage;