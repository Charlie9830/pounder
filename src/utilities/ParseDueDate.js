import Moment from 'moment';

var ParseDueDate = function (isComplete, dueDate) {
  if (isComplete) {
    return {
      className: "DueDate Complete",
      text: ""
    }
  }

  if (dueDate === "") {
    return {
      className: "DueDate NotSet",
      text: ""
    }
  }

  var dueDate = new Moment(dueDate).hours(13);
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
      text: Math.floor(difference / 7) + "w"
    }
  }

  else {
    return {
      className: "DueDate NotSet",
      text: ""
    }
  }
}

export default ParseDueDate;