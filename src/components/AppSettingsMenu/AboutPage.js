import React from 'react';
import CenteringContainer from '../../containers/CenteringContainer';
import HorizontalCenteringContainer from '../../containers/HorizontalCenteringContainer';
import '../../assets/css/AppSettingsMenu/AboutPage.css';
import AppIcon from '../../assets/icons/Handball-Icon-Desktop-Draft.svg'
import GitHubMark from '../../assets/icons/GitHubMark.svg';
import os from 'os';
import open from 'open';

class AboutPage extends React.Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.handleGitHubMarkClick = this.handleGitHubMarkClick.bind(this);
    }

    
    render() {
        const appVersion = "2.0.2";
        const nodeVersion = process.versions.node;
        const chromiumVersion = process.versions.chrome;
        const electronVersion = process.versions.electron;
        const arch = process.arch;
        const platform = process.platform;
        const operatingSystem = os.release();

        return (
            <div className="AboutPageContainer">
                <CenteringContainer>
                    <div className="AboutPageAppInfoContainer">
                        <img className="AboutPageAppIcon" src={AppIcon} />
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

    handleGitHubMarkClick() {
        open("https://github.com/Charlie9830/Pounder/issues");
    }
}

export default AboutPage;