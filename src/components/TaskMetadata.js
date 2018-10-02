import React from 'react';
import '../assets/css/TaskMetadata.css';
import UpArrowIcon from '../assets/icons/UpArrowIcon.svg';
import TimeIcon from '../assets/icons/TimeIcon.svg';
import PersonIcon from '../assets/icons/PersonIcon.svg';
import TickIcon from '../assets/icons/TickIcon.svg';

class TaskMetadata extends React.Component {
    render() {
        return (
            <div className="TaskMetadata">
                <div className="TaskMetadataGrid">

                    {/* Created  */}
                    <div className="TaskMetadataSubtitleContainer"> 
                        <div className="TaskMetadataSubtitle"> Created </div>
                    </div>
                    
                    {/* User  */} 
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={PersonIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.createdBy}
                    </div>

                    {/* Time  */} 
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={TimeIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.createdOn}
                    </div>

                    {/* Updated  */}
                    <div className="TaskMetadataSubtitleContainer"> 
                        <div className="TaskMetadataSubtitle"> Updated </div>
                    </div>

                    {/* User  */} 
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={PersonIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.updatedBy}
                    </div>

                    {/* Time */}
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={TimeIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.updatedOn}
                    </div>

                    {/* Completed */}
                    <div className="TaskMetadataSubtitleContainer"> 
                        <div className="TaskMetadataSubtitle"> Completed </div>
                    </div>

                    {/* Person */}
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={PersonIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.completedBy}
                    </div>

                    {/* Time */}
                    <div className="TaskMetadataIconContainer">
                        <img className="TaskMetadataIcon" src={TimeIcon} />
                    </div>
                    <div className="TaskMetadataValue">
                        {this.props.metadata.completedOn}
                    </div>
                </div>
            </div>
        )
    }
}

export default TaskMetadata;