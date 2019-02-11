import React from 'react';
import '../assets/css/DueDate.css';
import Calendar from './Calendar';
import ContextMenuContainer from '../containers/ContextMenuContainer';
import OverlayMenuContainer from '../containers/OverlayMenuContainer';
import CenteringContainer from '../containers/CenteringContainer';
import Moment from 'moment';
import { ParseDueDate } from 'handball-libs/libs/pounder-utilities';

class DueDate extends React.Component {
  constructor(props) {
    super(props);

    // Method Bindings.
    this.handleClick = this.handleClick.bind(this);
  }


  render() {
    var {className, text} = ParseDueDate(this.props.isComplete, this.props.dueDate);

    return (
      <div className={className} onClick={this.handleClick}>
        <label className="DueDateText"> {text} </label>
      </div>
    );
  }

  handleClick(e) {
    this.props.onClick();
  }
}

export default DueDate;
