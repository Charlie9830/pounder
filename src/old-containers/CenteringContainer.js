import React from 'react'; 
import VerticalCenteringContainer from './VerticalCenteringContainer';
import HorizontalCenteringContainer from './HorizontalCenteringContainer';

class CenteringContainer extends React.Component {
    render() {
        return (
            <HorizontalCenteringContainer>
                <VerticalCenteringContainer>
                    {this.props.children}
                </VerticalCenteringContainer>
            </HorizontalCenteringContainer>
        )
    }
}

export default CenteringContainer;