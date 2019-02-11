import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setIsInducting, bumpVersionNumberToCurrentAsync } from 'handball-libs/libs/pounder-redux/action-creators';
import { Typography, Button, Drawer } from '@material-ui/core';
import FullScreenView from '../../layout-components/FullScreenView';

let gridStyle = {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '[Message]auto [Button]1fr',
    flexGrow: '1',
    padding: '16px'
}

let buttonContainer = {
    gridRow: 'Button',
    placeSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}

class InductionSplash extends Component {
    constructor(props) {
        super(props);
        
        // Method Bindings.
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
    }
    

    render() {    
        return (
            <Drawer anchor="top"
            open={this.props.isInducting}>
                <FullScreenView>
                    <div style={gridStyle}>
                        <div
                            style={{ gridRow: 'Message', placeSelf: 'flex-start stretch' }}>
                            <Typography variant="h5" color="secondary">
                                Welcome to the new look Handball
                            </Typography>
    
                            <p />
    
                            <Typography variant="body1">
                                A lot has changed!
                            </Typography>
    
                            <p />
    
                            <Typography variant="body1">
                                Everything you see has been redesigned to feel more intuitive and familiar.
                            </Typography>
    
                            <p />

                            <Typography variant="body1">
                                Common actions can now be initiated from the Floating Action Buttons in the bottom right hand corner.
                                Actions specific to items can now be accessed by swiping left or right on that item. Many other features
                                have been rolled into the Project and List menus.
                            </Typography>
                            
                            <p />

                            <Typography variant="body1">
                                We hope you enjoy the changes.
                            </Typography>
    
                            <p />
    
                            <Typography variant="body1">
                                As always feedback is greatly appreciated.
                            </Typography>
                        </div>
                        <div
                            style={buttonContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleStartButtonClick}>
                                Start
                       </Button>
                        </div>
                    </div>
                </FullScreenView>
            </Drawer>
        );
    }

    handleStartButtonClick() {
        this.props.dispatch(setIsInducting(false));
        this.props.dispatch(bumpVersionNumberToCurrentAsync());
    }
}

const mapStateToProps = state => {
    return {
        isInducting: state.isInducting,
    }
}

let VisibleInductionSplash = connect(mapStateToProps)(InductionSplash);
export default VisibleInductionSplash;