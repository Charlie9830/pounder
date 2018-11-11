import React from 'react';
import '../assets/css/ProjectSelector.css';
import FavoriteIcon from '../assets/icons/HeartIcon.svg';
import NewCommentsIcon from '../assets/icons/NewCommentsIcon.svg';
import TextareaAutosize from 'react-autosize-textarea';
import Hammer from 'hammerjs';

class ProjectSelector extends React.Component {
    constructor(props) {
        super(props);

        this.hammer = {};

        // Refs.
        this.containerRef = React.createRef();

        // Method Bindings.
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.getIndicatorsJSX = this.getIndicatorsJSX.bind(this);
        this.getHeartJSX = this.getHeartJSX.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    componentDidMount() {
        if (this.props.isInputOpen) {
            this.textarea.focus();
        }

        this.hammer = new Hammer(this.containerRef.current);
        this.hammer.on('tap', this.handleDoubleClick);
        this.hammer.get('tap').set({taps: 2});
    }

    componentWillUnmount() {
        this.hammer.off('tap', this.containerRef.current, this.handleDoubleClick);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isInputOpen !== this.props.isInputOpen) {
            if (this.props.isInputOpen) {
                this.textarea.focus();
            }
        }
    }

    render() {
        var projectLabelJSX = this.getProjectLabelJSX(this.props);
        var indicators = this.getIndicatorsJSX(this.props);
        var heartJSX = this.getHeartJSX();

        return (
            <div className="ProjectSelectorContainer" ref={this.containerRef} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
                <div className="ProjectSelectorFlexContainer">
                    {heartJSX}
                    <div className="ProjectSelectorLabelContainer">
                        {projectLabelJSX}
                    </div>
                    <div className="ProjectSelectorIconContainer">
                        {indicators}
                    </div>
                </div>
            </div>
        )
    }

    getHeartJSX() {
        if (this.props.isFavouriteProject) {
            return (
                <div className="ProjectSelectorHeartContainer">
                    <img className="ProjectSelectorFavoriteIcon" src={FavoriteIcon} />
                </div>
            )
        }
    }

    getIndicatorsJSX(props) {
        if (props.projectIndicators == undefined || props.projectIndicators == {}) {
            return ( <div/>)
        }

        var hasUnseenCommentsJSX = this.getHasUnseenCommentsIconJSX(props);
        
        return (
            <div>
                <div className="ProjectSelectorIcon" data-colour="Red" data-count={props.projectIndicators.reds}>
                    <label className="ProjectSelectorIconText"> {props.projectIndicators.reds} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Blue" data-count={props.projectIndicators.yellowReds}>
                    <label className="ProjectSelectorIconText"> {props.projectIndicators.yellowReds} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Yellow" data-count={props.projectIndicators.yellows}>
                    <label className="ProjectSelectorIconText"> {props.projectIndicators.yellows} </label>
                </div>
                <div className="ProjectSelectorIcon" data-colour="Green" data-count={props.projectIndicators.greens}>
                    <label className="ProjectSelectorIconText"> {props.projectIndicators.greens} </label>
                </div>
                {hasUnseenCommentsJSX}
            </div>
        )
    }

    getHasUnseenCommentsIconJSX(props) {
        if (props.projectIndicators.hasUnseenComments) {
            return (
                <img className="ProjectSelectorCommentsIcon" src={NewCommentsIcon}/>
            )
        }
    }

    getProjectLabelJSX(props) {
        if (this.props.isInputOpen) {
            return (
                <TextareaAutosize className="ProjectSelectorInput" innerRef={ref => this.textarea = ref} type='text' defaultValue={this.props.projectName}
                onKeyPress={this.handleKeyPress} onBlur={this.handleInputBlur}/>
            )
        }

        else {
            return (
                <div className="ProjectSelectorText" data-isselected={this.props.isSelected}>{props.projectName}</div>
            )
        }
    }

    handleClick(e) {
        this.props.onClick(e, this.props.projectSelectorId);
    }

    handleDoubleClick(e) {
        this.props.onDoubleClick(e, this.props.projectSelectorId);
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.props.onProjectNameSubmit(this.props.projectSelectorId, this.textarea.value, this.props.projectName );
        }
    }

    handleInputBlur() {
        this.props.onProjectNameSubmit(this.props.projectSelectorId, this.textarea.value, this.props.projectName);
    }


}

export default ProjectSelector;