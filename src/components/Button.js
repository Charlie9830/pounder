import React from 'react';

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ButtonContainer" onClick={(e) => {this.props.onClick(e)}} >
                <img className="Button" src={NewTaskIcon}/>
            </div>
        )
    }
}

export default Button;