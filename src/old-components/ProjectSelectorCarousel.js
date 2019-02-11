import React from 'react';
import '../assets/css/ProjectSelectorCarousel.css';

class ProjectSelectorCarousel extends React.Component {
    constructor(props) {
        super(props);


    }


    render() {
        // Wrap existing ProjectSelector JSX' into Flex Containers.
        var flexProjectSelectors = this.props.projectSelectorsJSX.map((item,index) => {
            return (
                <div key={index} className="ProjectSelectorCarouselFlexItem">
                    {item}
                </div>
            )
        })

        return (
            <div className="ProjectSelectorCarousel">
                <div className="ProjectSelectorCarouselFlexContainer">
                    {flexProjectSelectors}
                </div>
            </div>
        )
    }

    getPreviousSelectorJSX(projectSelectorsJSX, selectedProjectSelectorIndex) {
        if (projectSelectorsJSX[selectedProjectSelectorIndex - 1] == undefined) {
            return (
                <div/>
            )
        }

        else {
            return (
                <div className="ProjectSelectorCarouselDeselectedItem">
                    {projectSelectorsJSX[selectedProjectSelectorIndex - 1]}
                </div>
            )
        }
    }

    getNextSelectorJSX(projectSelectorsJSX, selectedProjectSelectorIndex) {
        if (projectSelectorsJSX[selectedProjectSelectorIndex + 1] == undefined) {
            return (
                <div/>
            )
        }

        else {
            return (
                <div className="ProjectSelectorCarouselDeselectedItem">
                    {projectSelectorsJSX[selectedProjectSelectorIndex + 1]}
                </div>
            )
        }
    }
}

export default ProjectSelectorCarousel;
