import React from 'react'; 
import Button from '../components/Button';
import '../assets/css/Containers/ColorPickerContainer.css';

class ColorPickerContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ColorPickerContainer">
                <div>
                    {this.props.children}
                </div>
                <div className="ColorPickerContainerFooter">
                    <Button text="Close" size="small" onClick={() => {this.props.onCloseButtonClick()}}/>
                </div>
            </div>
        ) 
    }
}

export default ColorPickerContainer;