import React from 'react';
import '../assets/css/Spinner.css';

class Spinner extends React.Component {
    render() {
        return (
            <div className="Spinner" data-size={this.props.size}/>
        )
    }
}

export default Spinner;