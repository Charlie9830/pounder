import React from 'react';
import MenuSubtitle from './MenuSubtitle';
import Button from './Button';
import DayPicker from 'react-day-picker';
import Moment from 'moment';
import { getNormalizedDate } from 'pounder-utilities';
import '../assets/css/react-day-picker/style.css';
import '../assets/css/ChecklistSettings.css';

class ChecklistSettings extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            showCustomIntervalInput: false,
            showDaysApplyButton: false,
            isCustomDaysValid: true,
        }

        // Refs.
        this.checklistModeCheckboxRef = React.createRef();
        this.daysInputRef = React.createRef();
        this.renewIntervalSelectRef = React.createRef();

        // Method Bindings.
        this.getChecklistSettingsControlJSX = this.getChecklistSettingsControlJSX.bind(this);
        this.handleChecklistModeCheckboxChange = this.handleChecklistModeCheckboxChange.bind(this);
        this.getSelectedDates = this.getSelectedDates.bind(this);
        this.handleDayPickerDayClick = this.handleDayPickerDayClick.bind(this);
        this.handleDaysInputChange = this.handleDaysInputChange.bind(this);
        this.handleRenewNowButtonClick = this.handleRenewNowButtonClick.bind(this);
        this.getRenewIntervalJSX = this.getRenewIntervalJSX.bind(this);
        this.getRenewIntervalSelectValue = this.getRenewIntervalSelectValue.bind(this);
        this.getCustomRenewIntervalJSX = this.getCustomRenewIntervalJSX.bind(this);
        this.handleRenewIntervalSelectChange = this.handleRenewIntervalSelectChange.bind(this);
        this.handleDaysApplyButtonClick = this.handleDaysApplyButtonClick.bind(this);
        this.submitRenewIntervalChange = this.submitRenewIntervalChange.bind(this);
    }

    componentDidMount() {
        if (this.getRenewIntervalSelectValue() === "custom") {
            this.setState({ showCustomIntervalInput: true });
        }

    }

    render() {
        var checkListSettingsControlJSX = this.getChecklistSettingsControlJSX();

        return (
            <div className="ChecklistSettingsContainer">
                <div className="ChecklistSettingsSwitchContainer">
                    <MenuSubtitle text="Checklist"/>
                    <div className="ChecklistSettingsHorizontalFlexContainer">
                        <input type="checkbox" ref={this.checklistModeCheckboxRef} onChange={this.handleChecklistModeCheckboxChange}
                        checked={this.props.settings.isChecklist}/>
                        <div className="ChecklistSettingsItemLabel"> Turn on Checklist mode </div>
                    </div>
                    <div className="ChecklistSettingsRenewNowContainer" >
                        <Button text="Renew" size="small" onClick={this.handleRenewNowButtonClick}
                        isEnabled={this.props.settings.isChecklist} />
                    </div>
                </div>

                {checkListSettingsControlJSX}

               
            </div>
        )
    }

    getChecklistSettingsControlJSX() {
        var isEnabled = this.props.settings.isChecklist;
        var { initialStartDate, nextRenewDate } = this.getSelectedDates();
        var renewIntervalJSX = this.getRenewIntervalJSX();
        const tomorrow = Moment().add(1,'day').toDate();

        return (
            <React.Fragment>
                <div className="ChecklistSettingsDayPickerContainer" data-isenabled={isEnabled}>
                    <MenuSubtitle text="Renew completed tasks on" />
                    <DayPicker enableOutsideDays={true} selectedDays={[initialStartDate]} onDayClick={this.handleDayPickerDayClick}
                    disabledDays={{ before: tomorrow }}/>
                </div>

                <div className="ChecklistSettingsIntervalContainer" data-isenabled={isEnabled}>
                    <MenuSubtitle text="Repeat" />
                    <div className="ChecklistSettingsHorizontalFlexContainer">
                        {renewIntervalJSX}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getRenewIntervalJSX() {
        var selectValue = this.getRenewIntervalSelectValue();
        var customRenewIntervalJSX = this.getCustomRenewIntervalJSX();

        return (
            <div className="ChecklistSettingsHorizontalFlexContainer">
                <select className="ChecklistSettingsRenewIntervalSelect" defaultValue={selectValue}
                ref={this.renewIntervalSelectRef} onChange={this.handleRenewIntervalSelectChange}>
                    <option value="daily"> Daily </option>
                    <option value="weekly"> Weekly </option>
                    <option value="fortnightly"> Fortnightly </option>
                    <option value="monthly"> Monthly </option>
                    <option value="custom"> Custom </option>
                </select>

                {customRenewIntervalJSX}

            </div>
        )
    }

    getCustomRenewIntervalJSX() {
        if (this.state.showCustomIntervalInput === true) {
            var buttonJSX = this.state.showDaysApplyButton === true ? 
            <Button text="Apply" size="small" onClick={this.handleDaysApplyButtonClick}/> : undefined;
            
            return (
                <React.Fragment>
                    <input className="ChecklistSettingsDaysInput" data-isvalid={this.state.isCustomDaysValid} type="number"
                        ref={this.daysInputRef}
                        defaultValue={this.props.settings.renewInterval}
                        onChange={this.handleDaysInputChange} />
                    <div className="ChecklistSettingsItemLabel"> days </div>
                    {buttonJSX}
                </React.Fragment>
            )
        }
    }

    handleDaysApplyButtonClick() {
        if (this.state.isCustomDaysValid) {
            this.setState({ showDaysApplyButton: false });
            this.submitRenewIntervalChange(this.daysInputRef.current.value);
        }
    }

    handleRenewIntervalSelectChange() {
        var value = this.renewIntervalSelectRef.current.value;

        if (value !== "custom") {
            this.setState({
                 showCustomIntervalInput: false,
                 showDaysApplyButton: false
                })

            var renewInterval = this.coerceDays(this.getDaysFromRenewIntervalSelectValue(value));
            this.submitRenewIntervalChange(renewInterval);
            
        }

        else {
            this.setState({ showCustomIntervalInput: true });
        }
    }


    submitRenewIntervalChange(renewInterval) {
        this.props.onRenewIntervalChange(renewInterval);
    }

    getRenewIntervalSelectValue() {
        var value = Number.parseInt(this.props.settings.renewInterval);

        switch(value) {
            case 1:
            return "daily";

            case 7:
            return "weekly";

            case 14:
            return "fortnightly";

            case 30:
            return "monthly";

            default:
            return "custom"
        }
    }

    getDaysFromRenewIntervalSelectValue(selectValue) {
        switch(selectValue) {
            case "daily":
            return 1;

            case "weekly":
            return 7;

            case "fortnightly":
            return 14;

            case "monthly":
            return 30;
            
            case "custom":
            return -1;

            default:
            return 0;
        }
    }

    handleRenewNowButtonClick() {
        this.props.onRenewNowButtonClick();
    }

    handleDaysInputChange() {
        var value = this.daysInputRef.current.value;

        this.setState({
            isCustomDaysValid: this.isCustomDaysValueValid(value),
            showDaysApplyButton: true,
        })
    }

    isCustomDaysValueValid(newValue) {
        return newValue > 0
    }

    handleDayPickerDayClick(day, modifiers, e) {
        this.props.onInitialStartDayPick(getNormalizedDate(Moment(day)));
    }

    getSelectedDates() {
        var initialStartDate = Moment(this.props.settings.initialStartDate);
        var nextRenewDate = Moment(this.props.settings.nextRenewDate);
        return {
            initialStartDate: initialStartDate.toDate(),
            nextRenewDate: nextRenewDate.toDate(),
        }
    }

    handleChecklistModeCheckboxChange() {
        var value = this.checklistModeCheckboxRef.current.checked;
        this.props.onChecklistModeChange(value);
    }

    coerceDays(days) {
        if (!this.isCustomDaysValueValid(days)) {
            return 1;
        }

        else {
            return days;
        }
    }
}

export default ChecklistSettings;