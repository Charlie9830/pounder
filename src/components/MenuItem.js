import React from 'react';
import '../assets/css/MenuItem.css'

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"MenuItem"}>
                {this.props.text}
            </div>
        )
    }
}

export default MenuItem;