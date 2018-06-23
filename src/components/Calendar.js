import React from 'react';
import '../assets/css/Calendar.css';
import '../assets/css/react-day-picker/style.css';
import DayPicker from 'react-day-picker';
import Button from './Button';
import Moment from 'moment';
import { EnableBodyScroll, DisableBodyScroll } from '../utilities/DOMHelpers';
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
        this.handleNoDueDateClick = this.handleNoDueDateClick.bind(this);
        this.handleDaysApplyButtonClick = this.handleDaysApplyButtonClick.bind(this);
        this.submitDays = this.submitDays.bind(this);
        this.handleDaysInputKeyPress = this.handleDaysInputKeyPress.bind(this);
        this.handlePriorityToggleClick = this.handlePriorityToggleClick.bind(this);

        const dateFormat = "DD-MM-YYYY";
    }

    componentDidMount() {
        DisableBodyScroll();
    }

    componentWillUnmount() {
        EnableBodyScroll();
    }

    render() {
        var humanFriendlyDate = this.getHumanFriendlyDate(this.props);
        var daysApplyButton = this.getDaysApplyButton(this.state);

        return (
            <div className="CalendarPopupContainer">

                {/* Header */}
                <div className="CalendarHeaderContainer">
                    <div className="PriorityToggle" data-ishighpriority={this.props.isHighPriority}
                        onClick={this.handlePriorityToggleClick}>
                        !
                    </div>
                    {humanFriendlyDate}
                </div>

                <div className="CalendarGrid">
                    {/* Left Side  */} 
                    {/* Calendar Shortcuts  */}
                    <div className="ShortcutsColumn">
                        <div className="CalendarShortcutsContainer">
                            <div className="ShortcutItemContainer" onClick={this.handleTodayItemClick}>
                                <div className="CalendarShortcutItemLabel"> Today </div>
                            </div>
                            <div className="ShortcutItemContainer" onClick={this.handleTomorrowItemClick}>
                                <div className="CalendarShortcutItemLabel"> Tomorrow </div>
                            </div>
                            <div className="ShortcutItemContainer" onClick={this.handleOneWeekItemClick}>
                                <div className="CalendarShortcutItemLabel"> One Week </div>
                            </div>
                            <div className="ShortcutItemContainer">
                                <input className="CalendarShortcutDaysInput" ref="DaysInput" type="number" onChange={this.handleDaysChanged}
                                    onKeyPress={this.handleDaysInputKeyPress} />
                                <div className="CalendarShortcutHorizontalSpace" />
                                <div className="CalendarShortcutItemLabel"> Days </div>
                                {daysApplyButton}
                            </div>
                            <div className="ShortcutItemContainer" onClick={this.handleNoDueDateClick}>
                                <div className="CalendarShortcutItemLabel"> No Due Date </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side  */}
                    {/* Day Picker  */}
                    <div className="DayPickerColumn">
                        <div>
                            <DayPicker enableOutsideDays={true} onDayClick={this.handleDayClick} />
                        </div>
                    </div>
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
                    <Button text="Apply" size="small" onClick={this.handleDaysApplyButtonClick}> Apply </Button>
            )
        }
    }

    getHumanFriendlyDate(props) {
        if (props.dueDate === "") {
            return (
                <div className="DateLabel">
                    No Due Date
                </div>
            )
        }
        
        else {
            var date = new Moment(this.props.dueDate);
            return (
                <div className="DateLabel">
                    {date.date()}/{date.month() + 1}/{date.year()}
                </div>
            )
        }
        
    }

    handleNoDueDateClick() {
        this.props.onNewDateSubmit(getClearedDate());
    }

    handleDayClick(day) {
        this.props.onNewDateSubmit(getDayPickerDate(day));
    }

    handleTodayItemClick() {
        this.props.onNewDateSubmit(getDaysForwardDate(0));
    }

    handleTomorrowItemClick() {
        this.props.onNewDateSubmit(getDaysForwardDate(1));
    }

    handleOneWeekItemClick() {
        this.props.onNewDateSubmit(getWeeksForwardDate(1));
    }

    handleDaysChanged() {
        this.setState({isApplyButtonVisible: true});
    }

    handleDaysApplyButtonClick() {
        this.submitDays();
    }

    submitDays() {
        var days = this.refs.DaysInput.value;
        this.props.onNewDateSubmit(getDaysForwardDate(days));
    }
}

export default Calendar;