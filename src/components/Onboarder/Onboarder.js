import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccountStep from './AccountStep';

class Onboarder extends Component {
    render() {
        return (
            <React.Fragment>
                { this.props.onboarderStep === 0 && <AccountStep/> }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        onboarderStep: state.onboarderStep,
    }
}

const VisibleOnboarder = connect(mapStateToProps)(Onboarder);

export default VisibleOnboarder;