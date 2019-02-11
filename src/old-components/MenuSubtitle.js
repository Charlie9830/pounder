import React from 'react';
import '../assets/css/MenuSubtitle.css';

class MenuSubtitle extends React.Component {
    constructor(props) {
        super(props);

        // Method bindings
        this.getDividerJSX = this.getDividerJSX.bind(this);
    }

    render() {
        var dividerJSX = this.getDividerJSX();
        return (
            <div className="MenuSubtitleContainer">
                {dividerJSX}
                <div className="MenuSubtitle">{this.props.text}</div>
            </div>
        )
    }

    getDividerJSX() {
        if (this.props.showDivider === undefined || this.props.showDivider === true) {
            return (
                <div className="MenuSubtitleFullBleedDivider"/>
            )
        }
    }
}

export default MenuSubtitle;