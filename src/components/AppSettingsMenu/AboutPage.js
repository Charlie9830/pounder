import React from 'react';
import CenteringContainer from '../../containers/CenteringContainer';
import HorizontalCenteringContainer from '../../containers/HorizontalCenteringContainer';
import '../../assets/css/AppSettingsMenu/AboutPage.css';
import AppIcon from '../../assets/icons/Handball-Icon-Desktop-Draft.svg'
import GitHubMark from '../../assets/icons/GitHubMark.svg';
import os from 'os';
import open from 'open';
let dependencyVersions = [
    { name: "pounder-redux", value: require('pounder-redux/package.json').version },
    { name: "pounder-firebase", value: require('pounder-firebase/package.json').version },
    { name: "pounder-stores", value: require('pounder-stores/package.json').version },
    { name: "pounder-utilities", value: require('pounder-utilities/package.json').version },
    { name: "pounder-dexie", value: require('pounder-dexie/package.json').version },
    { name: "firestore-batch-paginator", value: require('firestore-batch-paginator/package.json').version },
    
]

class AboutPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDependencyVersionInfo: false,
        }

        // Method Bindings.
        this.handleGitHubMarkClick = this.handleGitHubMarkClick.bind(this);
        this.getDependencyJSX = this.getDependencyJSX.bind(this);
    }

    render() {
        const appVersion = HANDBALL_VERSION;
        const nodeVersion = process.versions.node;
        const chromiumVersion = process.versions.chrome;
        const electronVersion = process.versions.electron;
        const arch = process.arch;
        const platform = process.platform;
        const operatingSystem = os.release();

        var dependencyJSX = this.getDependencyJSX();

        return (
            <div className="AboutPageContainer">
                <CenteringContainer>
                    <div className="AboutPageAppInfoContainer">
                        <img className="AboutPageAppIcon" src={AppIcon} 
                        onDoubleClick={() => {this.setState({showDependencyVersionInfo: true})}} />
                        <div className="AboutPageAppTitle"> Handball </div>
                        <div className="AboutPageVersionNumber"> Version {appVersion} </div>
                        <div className="AboutPageAuthor"> Charlie Hall </div>
                        
                        <div className="AboutPageDivider"/>

                        <div className="AboutPageSystemValueContainer">
                            <HorizontalCenteringContainer>
                                <div className="AboutPageSystemValue"> Node Version: {nodeVersion} </div>
                            </HorizontalCenteringContainer>

                            <HorizontalCenteringContainer>
                                <div className="AboutPageSystemValue"> Chromium Version: {chromiumVersion} </div>
                            </HorizontalCenteringContainer>

                            <HorizontalCenteringContainer>
                                <div className="AboutPageSystemValue"> Electron Version: {electronVersion} </div>
                            </HorizontalCenteringContainer>

                            <HorizontalCenteringContainer>
                                <div className="AboutPageSystemValue"> Operating System: {platform}  {operatingSystem}  {arch} </div>
                            </HorizontalCenteringContainer>
                        </div>

                        <div className="AboutPageDivider"/>
                        {dependencyJSX}
                        
                    </div>

                    <div className="AboutPageDivider"/>

                    <div className="AboutPageContactContainer">
                        <div className="AboutPageContactText">
                            Click below to report bugs, suggest features or join the development team.
                        </div>
                        <div className="AboutPageGithubMarkContainer" onClick={this.handleGitHubMarkClick}>
                            <img className="AboutPageGithubMark" src={GitHubMark}/>
                        </div>
                    </div>
                </CenteringContainer>
            </div>
        )
    }

    getDependencyJSX() {
        if (this.state.showDependencyVersionInfo) {
            var jsx = dependencyVersions.map((item,index) => {
                return (
                    <HorizontalCenteringContainer key={index}>
                        <div className="AboutPageSystemValue"> {item.name} : {item.value} </div>
                    </HorizontalCenteringContainer>
                )
            })
    
            return (
                <div className="AboutPageSystemValueContainer">
                    {jsx}
                </div>
            )
        }
    }

    handleGitHubMarkClick() {
        open("https://github.com/Charlie9830/Pounder/issues/new/choose");
    }
}

export default AboutPage;