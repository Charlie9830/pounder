import React from 'react';
import '../assets/css/TaskMetadata.css';
import UpArrowIcon from '../assets/icons/UpArrowIcon.svg';

class TaskMetadata extends React.Component {
    render() {
        return (
            <div className="TaskMetadata">

                <div className="TaskMetadataHeader">
                    <div className="TaskMetadataCloseButtonContainer" onClick={() => {this.props.onCloseButtonClick()}}>
                        <img className="TaskMetadataCloseButton" src={UpArrowIcon}/>
                    </div>
                </div>
                <div className="TaskMetadataGrid">
                    {/* Created By  */}
                    <div className="TaskMetadataLabel">
                        Created By
                </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.createdBy}
                </div>

                    {/* Created  */}
                    <div className="TaskMetadataLabel">
                        Created
                </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.createdOn}
                </div>

                    {/* Updated By  */}
                    <div className="TaskMetadataLabel">
                        Updated By
                </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.updatedBy}
                </div>

                    {/* Updated  */}
                    <div className="TaskMetadataLabel">
                        Updated
                </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.updatedOn}
                </div>

                    {/* Completed By  */}
                    <div className="TaskMetadataLabel">
                        Completed By:
                </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.completedBy}
                </div>
                </div>
        </div>
        )
    }
}

export default TaskMetadata;