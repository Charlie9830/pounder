import React from 'react';
import AppIcon from '../../assets/icons/Handball-Icon-Desktop-Draft.svg';

import { Grid, Typography } from '@material-ui/core';

let dependencyVersions = [
    { name: "handball-libs", value: require('handball-libs/package.json').version },
]

// eslint-disable-next-line
const appVersion = HANDBALL_VERSION;

let AppIconComponent = (props) => {
    let style = {
        flex: 1,
        width: '96px',
        height: '96px',
        marginTop: '32px',
        marginBottom: '32px',
    }
    return (
        <img style={style} src={AppIcon}/>
    )
}

class AboutPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDependencyVersionInfo: false,
        }

        // Method Bindings.
        this.getDependencyJSX = this.getDependencyJSX.bind(this);
    }
    render() {
        var dependencyJSX = this.getDependencyJSX();

        return (
            <Grid container
            direction="column"
            justify="center"
            alignItems="center">

                <Grid item onClick={() => {this.setState({showDependencyVersionInfo: !this.state.showDependencyVersionInfo})}}>
                    <AppIconComponent/>
                </Grid>
                

                <Typography color="textPrimary" variant="h6"> Handball </Typography>
                <Typography color="textSecondary"> Version {appVersion} </Typography>
                <Typography color="textSecondary"> Charlie Hall </Typography>

                {dependencyJSX}
                
                <Grid container
                direction="column"
                justify="flex-end"
                alignItems="center"
                style={{marginTop: '32px'}}>
                    <Typography color="textSecondary"> To report bugs or suggest features visit </Typography>
                    <Typography color="textPrimary"> {this.props.issuesURL} </Typography>
                </Grid>

            </Grid>
        )
    }

    getDependencyJSX() {
        if (this.state.showDependencyVersionInfo) {
            var jsx = dependencyVersions.map((item,index) => {
                return (
                    <Typography key={index}> {item.name} : {item.value} </Typography>
                )
            })
    
            return (
                <Grid item style={{marginTop: '24px'}}>
                    {jsx}
                </Grid>    
            )
        }
    }
}

export default AboutPage;