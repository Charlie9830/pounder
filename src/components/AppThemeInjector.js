import React, { Component } from 'react';
import VisibleApp from './App';
import { connect } from 'react-redux';
import { BuildMuiTheme } from '../utilities/BuildMuiTheme';
import { MuiThemeProvider }  from '@material-ui/core/styles';

class AppThemeInjector extends Component {
    constructor(props) {
        super(props);

        // Method Bindings.
        this.getTheme = this.getTheme.bind(this);
    }
    
    render() {
        let theme = this.getTheme();

        if (theme === undefined) {
            return (
                <VisibleApp/>
            );
        }
        
        else {
            return (
                <MuiThemeProvider theme={theme}>
                    <VisibleApp/>
                </MuiThemeProvider>
            )
        }
    }

    getTheme() {
        let storedTheme = this.props.muiThemes.find( item => {
            return item.id === this.props.selectedMuiThemeId;
        })

        if (storedTheme === undefined || storedTheme.theme === undefined) {
            // Look for hardcoded Default.
            storedTheme = this.props.muiThemes.find( item => {
                return item.id === 'default';
            })

            if (storedTheme === undefined || storedTheme.theme === undefined) {
                // Give up.
                return undefined;
            }
        }

        return BuildMuiTheme(storedTheme.theme);
    }
}

let mapStateToProps = state => {
    return {
        selectedMuiThemeId: state.selectedMuiThemeId,
        muiThemes: state.muiThemes,
        generalConfig: state.generalConfig,
    }
}

let VisibleAppThemeInjector = connect(mapStateToProps)(AppThemeInjector);

export default VisibleAppThemeInjector;