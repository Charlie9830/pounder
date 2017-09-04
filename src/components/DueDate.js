import React from 'react';
import '../assets/css/DueDate.css';

class DueDate extends React.Component {
  render() {
    return (
      <div className='DueDate'>
        <label> {this.props.dueDate} </label>
      </div>
    );
  }
}

export default DueDate;
