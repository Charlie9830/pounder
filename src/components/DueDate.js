import React from 'react';
import '../assets/css/DueDate.css';
import Calendar from './Calendar';
import ContextMenuContainer from '../containers/ContextMenuContainer';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import CenteringContainer from '../containers/CenteringContainer';
import Moment from 'moment';
import { ParseDueDate } from 'pounder-utilities';

class DueDate extends React.Component {
  constructor(props) {
    super(props);

    // Method Bindings.
    this.handleClick = this.handleClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    this.handlePriorityToggleClick = this.handlePriorityToggleClick.bind(this);
    this.handleOverlayMenuOutsideChildBoundsClick = this.handleOverlayMenuOutsideChildBoundsClick.bind(this);
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
        <OverlayMenuContainer onOutsideChildBoundsClick={this.handleOverlayMenuOutsideChildBoundsClick}>
            <Calendar dueDate={this.props.dueDate} onNewDateSubmit={this.handleNewDateSubmit}
              isHighPriority={this.props.isHighPriority} onPriorityToggleClick={this.handlePriorityToggleClick} />
        </OverlayMenuContainer>
      )
    }
  }

  handleOverlayMenuOutsideChildBoundsClick(e) {
    // Revert Due Date.
    this.props.onNewDateSubmit(this.props.dueDate);
  }

  handleClick(e) {
    if (!this.props.isCalendarOpen) {
      this.props.onClick();
    }
  }

  handleNewDateSubmit(newDate) {
    this.props.onNewDateSubmit(newDate);
  }

  handlePriorityToggleClick(newValue) {
    this.props.onPriorityToggleClick(newValue);
  }
}

export default DueDate;
