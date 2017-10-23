import React from 'react';
import '../assets/css/DueDate.css';
import Calendar from './Calendar';
import Moment from 'moment';
import { ParseDueDate } from 'pounder-utilities';

class DueDate extends React.Component {
  constructor(props) {
    super(props);

    // Method Bindings.
    this.handleClick = this.handleClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
  }

  render() {
    var {className, text} = ParseDueDate(this.props.isComplete, this.props.dueDate);
    var calendarMenu = this.getCalendarMenu(this.props);

    return (
      <div className={className} onClick={this.handleClick}>
        <label className="DueDateText"> {text} </label>
        {calendarMenu}
      </div>
    );
  }


  getCalendarMenu(props) {
    if (props.isCalendarOpen) {
      return (
        <Calendar dueDate={this.props.dueDate} onNewDateSubmit={this.handleNewDateSubmit}/>
      )
    }
  }

  handleClick() {
    if (!this.props.isCalendarOpen) {
      this.props.onClick();
    }
  }

  handleNewDateSubmit(newDate) {
    this.props.onNewDateSubmit(newDate);
  }
}

export default DueDate;
