import React from 'react';
import AppSettingsMenuSubtitle from './AppSettingsMenuSubtitle';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';

class GeneralSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        // CSS Variables.
        this.cssVariables = [
            { property: '--primary-color', value: 'rgb(27,27,27' },
            { property: '--background-color', value: '#000' },
            { property: '--surface-color', value: 'rgb(17,17,17)'},
            { property: '--surface-color-alternate', value: 'rgb(27,27,27)'},
            { property: '--primary-button-background-image', value: 'linear-gradient(to bottom, rgba(68, 68, 68, 0.50), rgba(60, 60, 60, 0.50));'}
        ]
        // Method Bindings.
        this.getFavouriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX.bind(this);
        this.getColorPropertiesJSX = this.getColorPropertiesJSX.bind(this);
    }

    render() {
        var favoriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX();
        var colorPropertiesJSX = this.getColorPropertiesJSX();
        return (
            <div className="AppSettingsVerticalFlexContainer">
                {/* Application startup Fullscreen Mode*/}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox"/>
                    <span className="AppSettingsHorizontalFlexItem">
                        <label className="AppSettingsItemLabel"> Start application in fullsceen </label>
                    </span>
                </div>
                
                {/* Application Startup Locked Mode */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox"/>
                    <span className="AppSettingsHorizontalFlexItem">
                        <label className="AppSettingsItemLabel"> Automaticaly lock application on start up </label>
                    </span>
                </div>

                {/* Faviourte Project Selection */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <label className="AppSettingsItemLabel"> Favourite project </label>
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

    getFavouriteProjectSelectorJSX() {
        // Build Projects into HTML Option Elements.
        var optionsJSX = this.props.projects.map((project,index) => {
            return (
                <option key={index + 1} value={project.uid}> {project.projectName} </option>
            )
        })

        // Build a "None" option.
        optionsJSX.unshift((<option key={0} value="-1"> None </option>))

        // Build options into HTML select Element.
        return (
            <select>
                {optionsJSX}
            </select>
        )
    }

    getColorPropertiesJSX() {
        var jsx = this.cssVariables.map((item,index) => {
            return (
                <div key={index} className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <label className="AppSettingsItemLabel">{item.property}</label>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        <input className="AppSettingsItemInput" type="text" defaultValue={item.value}/>
                    </span>
                </div>
            )
        })

        return jsx;

    }
}

export default GeneralSettingsPage;