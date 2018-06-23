import React from 'react';
import '../assets/css/DueDate.css';
import Calendar from './Calendar';
import ContextMenuContainer from '../containers/ContextMenuContainer';
import Moment from 'moment';
import { ParseDueDate } from 'pounder-utilities';

class DueDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastClickPos: {x: 0, y: 0},
    }

    // Method Bindings.
    this.handleClick = this.handleClick.bind(this);
    this.handleNewDateSubmit = this.handleNewDateSubmit.bind(this);
    this.handlePriorityToggleClick = this.handlePriorityToggleClick.bind(this);
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
        <ContextMenuContainer offsetX={this.state.lastClickPos.x} offsetY={this.state.lastClickPos.y}>
          <Calendar dueDate={this.props.dueDate} onNewDateSubmit={this.handleNewDateSubmit}
          isHighPriority={this.props.isHighPriority} onPriorityToggleClick={this.handlePriorityToggleClick}/>
        </ContextMenuContainer>
      )
    }
  }

  handleClick(e) {
    if (!this.props.isCalendarOpen) {
      this.setState({lastClickPos: {x: e.clientX, y: e.clientY}});
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
