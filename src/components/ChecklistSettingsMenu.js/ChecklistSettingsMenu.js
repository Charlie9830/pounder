import React, { Component } from 'react';
import FullScreenView from '../../layout-components/FullScreenView';
import { connect } from 'react-redux';
import { updateChecklistSettingsAsync, manuallyRenewChecklistAsync, closeChecklistSettings } from 'handball-libs/libs/pounder-redux/action-creators';
import {
    Toolbar, IconButton, Typography, FormControlLabel, Switch, Button, List, ListItem, ListItemIcon,
    Input, FormControl, InputLabel, InputAdornment, Paper
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RefreshIcon from '@material-ui/icons/Refresh';
import DateInputListItem from '../DateInputListItem';

let contentGrid = {
    width: '100%',
    height: '100%',
    padding: '8px',
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: `' Information   Information'
                        ' Enable        Renew '
                        ' SettingsList  SettingsList`
    
}

class ChecklistSettingsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRenewIntervalValid: true,
        }

        // Method Bindings.
        this.handleEnabledChange = this.handleEnabledChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleRenewIntervalBlur = this.handleRenewIntervalBlur.bind(this);
        this.validateRenewInterval = this.validateRenewInterval.bind(this);
    }
    
    render() {
        let settings = this.props.openChecklistSettingsEntity;

        if (settings === null || settings === undefined) {
            return null;
        }

        let disabled = settings.isChecklist === false;

        return (
            <FullScreenView>
                <Toolbar>
                    <IconButton
                    onClick={() => { this.props.dispatch(closeChecklistSettings()) }}>
                        <ArrowBackIcon/>
                    </IconButton>
                </Toolbar>
                <Paper
                style={{padding: '8px', margin: '8px'}}>
                    <div style={contentGrid}>
                        <div style={{ gridArea: 'Information', placeSelf: 'center flex-start' }}>
                            <Typography color="textSecondary">
                                Checklists allow you to set a date and interval in which completed tasks in this list will be automatically renewed.
                        </Typography>
                        </div>

                        <div style={{ gridArea: 'Enable', placeSelf: 'center flex-start' }}>
                            <FormControlLabel
                                label={"Enable"}
                                control={<Switch
                                    checked={settings.isChecklist}
                                    onChange={(e) => { this.handleEnabledChange(e.target.checked) }} />}
                            />
                        </div>

                        <div style={{ gridArea: 'Renew', placeSelf: 'center flex-end' }}>
                            <Button
                                onClick={() => { this.props.dispatch(manuallyRenewChecklistAsync(this.props.openChecklistSettingsId)) }}
                                variant="outlined"
                                color='secondary'
                                disabled={disabled}>
                                Renew now
                        </Button>
                        </div>

                        <div style={{ gridArea: 'SettingsList', placeSelf: 'flex-start' }}>
                            <List>
                                <DateInputListItem
                                    disabled={disabled}
                                    placeholder="Set renew date"
                                    value={settings.initialStartDate}
                                    onChange={this.handleDateChange}
                                    disablePast={true}
                                    autoOk={true}
                                    clearable={true} />

                                <ListItem
                                    disabled={disabled}>
                                    <ListItemIcon>
                                        <RefreshIcon />
                                    </ListItemIcon>

                                    <FormControl>
                                        <InputLabel> Then renew every </InputLabel>
                                        <Input
                                            type='number'
                                            error={!this.state.isRenewIntervalValid}
                                            defaultValue={settings.renewInterval}
                                            onChange={(e) => { this.validateRenewInterval(e.target.value) }}
                                            onBlur={(e) => { this.handleRenewIntervalBlur(e.target.value) }}
                                            endAdornment={<InputAdornment position='end'> days </InputAdornment>} />
                                    </FormControl>

                                </ListItem>
                            </List>
                        </div>
                    </div>
                </Paper>
            </FullScreenView>
        );
    }

    validateRenewInterval(newValue) {
        if (newValue >= 1) {
            this.setState({ isRenewIntervalValid: true })
        }

        else {
            this.setState({ isRenewIntervalValid: false })
        }
    }

    handleRenewIntervalBlur(newValue) {
        newValue = this.state.isRenewIntervalValid ? newValue : 1;

        let newSettings = { ...this.props.openChecklistSettingsEntity };
        newSettings.renewInterval = newValue;
        this.props.dispatch(updateChecklistSettingsAsync(this.props.openChecklistSettingsId, newSettings));
    }

    handleEnabledChange(newValue) {
        let newSettings = { ...this.props.openChecklistSettingsEntity };
        newSettings.isChecklist = newValue;
        this.props.dispatch(updateChecklistSettingsAsync(this.props.openChecklistSettingsId, newSettings));
    }

    handleDateChange(newDate) {
        let newDateString = newDate === null ? '' : newDate.toISOString();

        let newSettings = { ...this.props.openChecklistSettingsEntity };
        newSettings.initialStartDate = newDateString;
        this.props.dispatch(updateChecklistSettingsAsync(this.props.openChecklistSettingsId, newSettings));
    }

}

let mapStateToProps = state => {
    return {
        openChecklistSettingsEntity: state.openChecklistSettingsEntity,
        openChecklistSettingsId: state.openChecklistSettingsId,
    }
}

let VisibleChecklistSettingsMenu = connect(mapStateToProps)(ChecklistSettingsMenu);
export default VisibleChecklistSettingsMenu;