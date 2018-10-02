import React from 'react';
import Button from '../Button';
import CenteringContainer from '../../containers/CenteringContainer';
import '../../assets/css/CommentPanel/ShowMoreButton.css';

class ShowMoreButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var internalJSX = this.props.isAllCommentsFetched ? 
        <div className="ShowMoreButtonText"> No more comments </div> :
        <Button size="small" text="More" onClick={() => { this.props.onClick() }}/>;

            return (
                <div className="ShowMoreButtonContainer">
                    <CenteringContainer>
                        {internalJSX}
                    </CenteringContainer>
                </div>
            )
    }
}

export default ShowMoreButton;