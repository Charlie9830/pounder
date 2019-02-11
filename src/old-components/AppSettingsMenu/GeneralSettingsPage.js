import React from 'react';
import MenuSubtitle from '../MenuSubtitle';
import ThemeSettings from './ThemeSettings';
import '../../assets/css/AppSettingsMenu/AppSettingsMenu.css';


class GeneralSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPinCodeEntryValid: true,
        }

        // Class Storage.
        this.highlightValueBuffer = '';

        // Refs.
        this.disableAnimationsCheckboxRef = React.createRef();
        this.hideLockButtonCheckboxRef = React.createRef();
        this.pinCodeEntryRef = React.createRef();
        this.autoBackupIntervalEntryRef = React.createRef();
        this.useLargeFontsCheckboxRef = React.createRef();
        this.sortProjectsBySelectorRef = React.createRef();
        this.enableKioskModeCheckboxRef = React.createRef();

        // Method Bindings.
        this.getFavouriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX.bind(this);
        this.handleStartInFullscreenChange = this.handleStartInFullscreenChange.bind(this);
        this.handleStartLockedChange = this.handleStartLockedChange.bind(this);
        this.handleFavouriteProjectSelectChange = this.handleFavouriteProjectSelectChange.bind(this);
        this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
        this.handleColorPickerCloseButtonClick = this.handleColorPickerCloseButtonClick.bind(this);
        this.handleDefaultAllColorsButtonClick = this.handleDefaultAllColorsButtonClick.bind(this);
        this.handleDisableAnimationsChange = this.handleDisableAnimationsChange.bind(this);
        this.handleHideLockButtonChange = this.handleHideLockButtonChange.bind(this);
        this.handlePinCodeInputChange = this.handlePinCodeInputChange.bind(this);
        this.handlePinCodeInputBlur = this.handlePinCodeInputBlur.bind(this);
        this.handleAutoBackupIntervalInputBlur = this.handleAutoBackupIntervalInputBlur.bind(this);
        this.handleUseLargeFontsChange = this.handleUseLargeFontsChange.bind(this);
        this.getSortProjectsBySelectorJSX = this.getSortProjectsBySelectorJSX.bind(this);
        this.handleSortProjectsBySelectorChange = this.handleSortProjectsBySelectorChange.bind(this);
        this.handleEnableKioskModeChange = this.handleEnableKioskModeChange.bind(this);
    }

    componentDidMount() {
        var pinCode = this.props.generalConfig.pinCode === undefined ? "" : this.props.generalConfig.pinCode;
        this.setState({ isPinCodeEntryValid: this.validatePinCodeEntry(pinCode) });
    }

    render() {
        var favoriteProjectSelectorJSX = this.getFavouriteProjectSelectorJSX();
        var sortProjectsBySelectorJSX = this.getSortProjectsBySelectorJSX();

        // Zero Fill any undefined values.
        var disableAnimations = this.props.generalConfig.disableAnimations === undefined ?
            false : this.props.generalConfig.disableAnimations;

        var hideLockButton = this.props.generalConfig.hideLockButton === undefined ?
            false : this.props.generalConfig.hideLockButton;

        var autoBackupInterval = this.props.generalConfig.autoBackupInterval === undefined ?
            0 : this.props.generalConfig.autoBackupInterval;

        return (
            <div className="AppSettingsVerticalFlexContainer">
                {/* Application startup Fullscreen Mode*/}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref="startInFullscreenCheckbox"
                        checked={this.props.generalConfig.startInFullscreen} onChange={this.handleStartInFullscreenChange} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Start application in fullscreen </div>
                    </span>
                </div>

                {/* Disable Animations */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref={this.disableAnimationsCheckboxRef}
                        onChange={this.handleDisableAnimationsChange} checked={disableAnimations} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Disable animations </div>
                    </span>
                </div>

                {/* Application Startup Locked Mode */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref="startLockedCheckbox"
                        checked={this.props.generalConfig.startLocked} onChange={this.handleStartLockedChange} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel">  Lock application on start up </div>
                    </span>
                </div>

                {/* Hide Lock Button */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref={this.hideLockButtonCheckboxRef}
                        checked={hideLockButton} onChange={this.handleHideLockButtonChange} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Hide lock button </div>
                    </span>
                </div>

                {/* Large Fonts Toggle */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref={this.useLargeFontsCheckboxRef}
                        checked={this.props.generalConfig.useLargeFonts} onChange={this.handleUseLargeFontsChange} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Use large font display </div>
                    </span>
                </div>

                {/* Kiosk Mode */}
                <div className="AppSettingsVerticalFlexItem">
                    <input className="AppSettingsHorizontalFlexItem" type="checkbox" ref={this.enableKioskModeCheckboxRef}
                        checked={this.props.generalConfig.enableKioskMode} onChange={this.handleEnableKioskModeChange} />
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Enable Touchscreen Kiosk mode </div>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemHint"> Restart required for changes to take affect </div>
                    </span>
                </div>

                {/* Pin Code */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Pin code </div>
                    </span>
                    <div className="AppSettingsHorizontalFlexItem">
                        <input className="AppSettingsItemInput" data-isvalid={this.state.isPinCodeEntryValid} type="text"
                            ref={this.pinCodeEntryRef} checked={disableAnimations} onChange={this.handlePinCodeInputChange}
                            onBlur={this.handlePinCodeInputBlur} />
                    </div>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemHint"> Max 4 digits or 0 digits to skip pin code access </div>
                    </span>
                </div>

                {/* Auto Backup Interval */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Auto backup interval </div>
                    </span>
                    <div className="AppSettingsHorizontalFlexItem">
                        <input className="AppSettingsItemInput" type="number" ref={this.autoBackupIntervalEntryRef}
                            onBlur={this.handleAutoBackupIntervalInputBlur} defaultValue={autoBackupInterval} />
                    </div>
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemHint"> In minutes. 0 to disable auto backup </div>
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

                {/* Sort projects by */}
                <div className="AppSettingsVerticalFlexItem">
                    <span className="AppSettingsHorizontalFlexItem">
                        <div className="AppSettingsItemLabel"> Sort Projects by </div>
                    </span>
                    <span className="AppSettingsHorizontalFlexItem">
                        {sortProjectsBySelectorJSX}
                    </span>
                </div>


                {/* Color Selection Title */}
                <div className="AppSettingsVerticalFlexItem">
                    <MenuSubtitle text="Application Color Selection" />
                </div>

                {/* Color Selection Properties and Inputs */}
                <div className="AppSettingsVerticalFlexItem">
                    <ThemeSettings cssConfig={this.props.cssConfig} contentContainerRef={this.props.contentContainerRef}
                        onCSSPropertyChange={(propertyName, value) => { this.props.onCSSPropertyChange(propertyName, value) }}
                        onColorPickerClick={this.handleColorPickerClick} colorPicker={this.props.colorPicker}
                        onColorPickerCloseButtonClick={this.handleColorPickerCloseButtonClick}
                        onDefaultAllColorsButtonClick={this.handleDefaultAllColorsButtonClick}
                    />
                </div>
            </div>
        )
    }

    handleSortProjectsBySelectorChange() {
        this.props.onSortProjectsBySelectorChange(this.sortProjectsBySelectorRef.current.value);
    }

    handleUseLargeFontsChange() {
        var value = this.useLargeFontsCheckboxRef.current.checked;
        this.props.onUseLargeFontsChange(value);
    }

    handleEnableKioskModeChange() {
        var value = this.enableKioskModeCheckboxRef.current.checked;
        this.props.onEnableKioskModeChange(value);
    }

    handleAutoBackupIntervalInputBlur() {
        var currentValue = this.autoBackupIntervalEntryRef.current.value;
        // Coerce Positive.
        var currentValue = currentValue < 0 ? 0 : currentValue;

        this.props.onAutoBackupIntervalChange(currentValue);

    }

    handlePinCodeInputBlur() {
        var currentValue = this.pinCodeEntryRef.current.value;
        if (this.validatePinCodeEntry(currentValue)) {
            this.props.onPinCodeChange(currentValue);
        }

        else {
            this.pinCodeEntryRef.current.value = "";
            this.setState({ isPinCodeEntryValid: true });
        }
    }

    handlePinCodeInputChange() {
        var currentValue = this.pinCodeEntryRef.current.value;
        this.setState({ isPinCodeEntryValid: this.validatePinCodeEntry(currentValue) })
    }

    validatePinCodeEntry(entry) {
        var regex = /^[0-9]{0,4}$/gm;

        if (entry === "") {
            return true;
        }

        if (regex.test(entry)) {
            return true;
        }

        else {
            return false;
        }
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

    handleHideLockButtonChange() {
        var value = this.hideLockButtonCheckboxRef.current.checked;
        this.props.onHideLockButtonChange(value);
    }

    handleDisableAnimationsChange() {
        var value = this.disableAnimationsCheckboxRef.current.checked;
        this.props.onDisableAnimationsChange(value);
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
        var optionsJSX = this.props.projects.map((project, index) => {
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

    getSortProjectsBySelectorJSX() {
        var sortProjectsBy = this.props.generalConfig.sortProjectsBy === undefined ? 'alphabetically' : this.props.generalConfig.sortProjectsBy;

        return (
            <select className="FavouriteProjectSelect" ref={this.sortProjectsBySelectorRef} defaultValue={sortProjectsBy}
            onChange={this.handleSortProjectsBySelectorChange}>
                <option key={0} value='alphabetically'> Alphabetically </option>
                <option key={1} value='created'> Date created </option>
                <option key={2} value='updated'> Updated </option>
            </select>
        )
    }

    handleFavouriteProjectSelectChange() {
        var id = this.refs.favourteProjectSelect.value;
        this.props.onFavouriteProjectSelectChange(id);
    }
}

export default GeneralSettingsPage;