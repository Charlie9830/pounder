import React from 'react';
import '../assets/css/DueDate.css';
import Calendar from './Calendar';
import Moment from 'moment';

class DueDate extends React.Component {
  constructor(props) {
    super(props);

    // Method Bindings.
    this.handleClick = this.handleClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
  }

  render() {
    var {className, text} = this.getDueDateClassAndText(this.props);
    var calendarMenu = this.getCalendarMenu(this.props);

    return (
      <div className={className} onClick={this.handleClick}>
        <label className="DueDateText"> {text} </label>
        {calendarMenu}
      </div>
    );
  }

  getDueDateClassAndText(props) {
    if (this.props.isComplete) {
      return {
        className: "DueDate Complete",
        text: ""
      }
    }

    if (this.props.dueDate === "") {
      return { 
        className: "DueDate NotSet",
        text: ""
      }
    }

    var dueDate = new Moment(this.props.dueDate).hours(13);
    var currentDate = new Moment();
    var difference = dueDate.diff(currentDate, 'days');

    // Today.
    if (dueDate.isSame(currentDate, 'day')) {
      return {
        className: "DueDate Soon",
        text: "Today"
      }
    }

    // Tomorrow
    if (dueDate.calendar(currentDate).includes("Tomorrow")) {
      return {
        className: "DueDate Soon",
        text: 1 + "d"
      }
    }

    // Overdue
    if (difference < 0) {
      return {
        className: "DueDate Overdue",
        text: "Due"
      }
    }

    // Later On
    if (difference >= 1 && difference <= 6) {
      return {
        className: "DueDate Later",
        text: (difference + 1) + "d"
      }
    }

    // At least a Week out.
    if (difference >= 7) {
      return {
        className: "DueDate Later",
        text: Math.floor(difference/7) + "w"
      }
    }

    else {
      return {
        className: "DueDate NotSet",
        text: ""
      }
    }
  }

  getCalendarMenu(props) {
    if (props.isCalendarOpen) {
      return (
        <Calendar dueDate={this.props.dueDate} onNewDateSubmit={this.handleNewDateSubmit}/>
      )
    }
  }

  handleClick() {
    this.props.onClick();
  }

  handleNewDateSubmit(newDate) {
    this.props.onNewDateSubmit(newDate);
  }
}

export default DueDate;
