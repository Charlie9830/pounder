import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import ThemeSettings from './ThemeSettings';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';


class GeneralSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // Class Storage.
        this.highlightValueBuffer = '';
        
        // Method Bindings.
        this.getFavouriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX.bind(this);
        this.handleStartInFullscreenChange = this.handleStartInFullscreenChange.bind(this);
        this.handleStartLockedChange = this.handleStartLockedChange.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
        this.handleColorPickerCloseButtonClick = this.handleColorPickerCloseButtonClick.bind(this);
        this.handleDefaultAllColorsButtonClick = this.handleDefaultAllColorsButtonClick.bind(this);
    }

    render() {
        var favoriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX();

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
                <div className="AppSettingsVerticalFlexItem">
                    <ThemeSettings cssConfig={this.props.cssConfig} contentContainerRef={this.props.contentContainerRef}
                    onCSSPropertyChange={(propertyName, value) => {this.props.onCSSPropertyChange(propertyName, value)}}
                    onColorPickerClick={this.handleColorPickerClick} colorPicker={this.props.colorPicker}
                    onColorPickerCloseButtonClick={this.handleColorPickerCloseButtonClick}
                    onDefaultAllColorsButtonClick={this.handleDefaultAllColorsButtonClick}
                    />
                </div>
            </div>
        )
    }
    
    handleDefaultAllColorsButtonClick() {
        this.props.onDefaultAllColorsButtonClick();
    }

    handleColorPickerCloseButtonClick() {
        this.props.onColorPickerCloseButtonClick();
    }

    handleColorPickerClick(index, xOffset, yOffset) {
        this.props.onColorPickerClick(index, xOffset, yOffset);
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
}

export default GeneralSettingsPage;