import React from 'react';

class MenuItem extends React.Component {
    render() {
        var containerClassName = this.props.isSelected ?
            this.props.containerClassName + "IsSelected" :
            this.props.containerClassName;
        return (
            <div className={containerClassName} onClick={this.props.onClick}>
                <label className={this.props.labelClassName}> {this.props.labelText} </label>
            </div>
        )
    }
}

export default MenuItem;