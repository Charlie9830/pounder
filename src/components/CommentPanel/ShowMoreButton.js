import React from 'react';
import Button from '../Button';
import CenteringContainer from '../../containers/CenteringContainer';
import Spinner from '../Spinner';
import '../../assets/css/CommentPanel/ShowMoreButton.css';

class ShowMoreButton extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getInternalJSX = this.getInternalJSX.bind(this);
    }

    render() {
        var internalJSX = this.getInternalJSX();
            return (
                <div className="ShowMoreButtonContainer">
                    <CenteringContainer>
                        {internalJSX}
                    </CenteringContainer>
                </div>
            )
    }

    getInternalJSX() {
        if (this.props.isPaginating) {
            return <Spinner size="small"/>
        }

        return this.props.isAllCommentsFetched ? 
        <div className="ShowMoreButtonText"> No more comments </div> :
        <Button size="small" text="More" onClick={() => { this.props.onClick() }}/>;
    }


}

export default ShowMoreButton;