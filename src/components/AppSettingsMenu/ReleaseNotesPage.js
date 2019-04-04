import React, { Component } from 'react';
import { ListItem, ListItemText, List, withTheme, Typography } from '@material-ui/core';
import ReleaseNotes from '../../assets/release-notes';
import MarkdownViewer from '../MarkdownViewer';

let grid = {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '[Sidebar]auto [Content]1fr'
}

class ReleaseNotesPage extends Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            selectedIndex: 0,
        }

        // Method Bindings.
        this.getDrawerItems = this.getDrawerItems.bind(this);
        this.getContent = this.getContent.bind(this);
    }

    render() {
        let { theme } = this.props;

        return (
            <div
                style={grid}>
                <div
                    style={{ gridColumn: 'Sidebar', background: theme.palette.background.paper }}>
                    <List>
                        {this.getDrawerItems()}
                    </List>
                </div>

                <div
                    style={{ gridColumn: 'Content' }}>
                    <MarkdownViewer
                        source={this.getContent()}/>
                </div>
            </div>
        );
    }

    getContent() {
        let content = ReleaseNotes[this.state.selectedIndex].markdown;
        if (content === undefined) {
            return null;
        }

        return content;
    }

    getDrawerItems() {
        if (ReleaseNotes === undefined) {
            return null;
        }

        return ReleaseNotes.map((item, index) => {
            return (
                <ListItem
                    onClick={() => { this.setState({ selectedIndex: index }) }}
                    key={index}
                    selected={index === this.state.selectedIndex}>
                    <ListItemText
                        primary={item.version}
                        secondary={item.name}
                    />
                </ListItem>
            )
        })
    }
}

export default withTheme()(ReleaseNotesPage);