import React from 'react';
import '../assets/css/Calendar.css';
import '../assets/css/react-day-picker/style.css';
import DayPicker from 'react-day-picker';
import Moment from 'moment';
import { getDayPickerDate, getClearedDate, getDaysForwardDate, getWeeksForwardDate } from 'pounder-utilities';


class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isApplyButtonVisible: false
        }

        // Method Bindings.
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleTodayItemClick = this.handleTodayItemClick.bind(this);
        this.handleTomorrowItemClick = this.handleTomorrowItemClick.bind(this);
        this.handleOneWeekItemClick = this.handleOneWeekItemClick.bind(this);
        this.handleDaysChanged = this.handleDaysChanged.bind(this);
        this.submitNewDateSelection = this.submitNewDateSelection.bind(this);
        this.handleNoDueDateClick = this.handleNoDueDateClick.bind(this);
        this.handleDaysApplyButtonClick = this.handleDaysApplyButtonClick.bind(this);
        this.submitDays = this.submitDays.bind(this);
        this.handleDaysInputKeyPress = this.handleDaysInputKeyPress.bind(this);
        this.handlePriorityToggleClick = this.handlePriorityToggleClick.bind(this);

        const dateFormat = "DD-MM-YYYY";
    }

    render() {
        var humanFriendlyDate = this.getHumanFriendlyDate(this.props);
        var daysApplyButton = this.getDaysApplyButton(this.state);

        return (
            <div className="CalendarPopupContainer">
                <div>
                    {humanFriendlyDate}
                    <div className="PriorityToggleContainer" onClick={this.handlePriorityToggleClick}>
                        <label className="PriorityToggle" data-ishighpriority={this.props.isHighPriority}>
                            !
                        </label>
                    </div>
                </div>
                <div className="ShortcutItemContainer" onClick={this.handleTodayItemClick}>
                    <label className="ItemLabel"> Today </label>
                </div>
                <div className="ShortcutItemContainer" onClick={this.handleTomorrowItemClick}>
                    <label className="ItemLabel"> Tomorrow </label>
                </div>
                <div className="ShortcutItemContainer" onClick={this.handleOneWeekItemClick}>
                    <label className="ItemLabel"> One Week </label>
                </div>
                <div className="ShortcutItemContainer" onClick={this.handleNoDueDateClick}>
                    <label className="ItemLabel"> No Due Date </label>
                </div>
                <div className="ShortcutItemContainer">
                    <input ref="DaysInput" id="CalendarPopupDaysInput" type="number" onChange={this.handleDaysChanged}
                    onKeyPress={this.handleDaysInputKeyPress} />
                    <label id="DaysLabel" className="ItemLabel"> Days </label>
                    {daysApplyButton}
                </div>
                <div>
                    <DayPicker enableOutsideDays={true} onDayClick={this.handleDayClick}/>
                </div>
            </div>
        )
    }

    handlePriorityToggleClick(e) {
        this.props.onPriorityToggleClick(!this.props.isHighPriority);
    }

    handleDaysInputKeyPress(e) {
        if (e.key === "Enter") {
            this.submitDays();
        }
    }   

    getDaysApplyButton(state) {
        if (state.isApplyButtonVisible) {
            return (
                <button id="DaysApplyButton" onClick={this.handleDaysApplyButtonClick}> Apply </button>
            )
        }
    }

    getHumanFriendlyDate(props) {
        if (props.dueDate === "") {
            return (
                <div id="DateLabelContainer">
                    <label id="DateLabel"> No Due Date </label>
                </div>
            )
        }
        
        else {
            var date = new Moment(this.props.dueDate);
            return (
                <div id="DateLabelContainer">
                    <label id="DateLabel"> {date.date()}/{date.month()}/{date.year()} </label>
                </div>
            )
        }
        
    }

    handleNoDueDateClick() {
        this.submitNewDateSelection(getClearedDate());
    }

    handleDayClick(day) {
        this.submitNewDateSelection(getDayPickerDate(day));
    }

    handleTodayItemClick() {
        this.submitNewDateSelection(getDaysForwardDate(0));
    }

    handleTomorrowItemClick() {
        this.submitNewDateSelection(getDaysForwardDate(1));
    }

    handleOneWeekItemClick() {
        this.submitNewDateSelection(getWeeksForwardDate(1));
    }

    handleDaysChanged() {
        this.setState({isApplyButtonVisible: true});
    }

    handleDaysApplyButtonClick() {
        this.submitDays();
    }

    submitDays() {
        var days = this.refs.DaysInput.value;
        this.submitNewDateSelection(getDaysForwardDate(days));
    }

    submitNewDateSelection(newDate) {
        if (newDate !== "") {
            var normalizedDate = newDate.startOf('day').hours(12);
            this.props.onNewDateSubmit(normalizedDate.toISOString());
        }

        else {
            this.props.onNewDateSubmit(newDate);
        }
        
    }
    
}

export default Calendar;