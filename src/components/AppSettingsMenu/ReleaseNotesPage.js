import React, { Component } from 'react';
import { Drawer, ListItem, ListItemText, List, withTheme, Typography } from '@material-ui/core';
import ReleaseNotes from '../../assets/release-notes';
import ReactMarkdown from 'react-markdown';

let Strong = (props) => {
    let { theme } = props;
    return (
        <span style={{
            ...theme.typography.body1,
            fontWeight: 'bold',
            color: theme.palette.secondary.light,
        }}>
            {props.children}
        </span>
    )
}

let Root = (props) => {
    return (
        <div
            style={{ width: '100%', height: '100%', padding: '8px' }}>
            {props.children}
        </div>
    )
}

let MDListItem = (props) => {
    let { theme } = props;
    return (
        <div
            style={{
                ...theme.typography.body1,
            }}>
            - {props.children}
        </div>
    )
}

let Heading = (props) => {
    let level = props.level + 2;
    level = level > 6 ? 6 : level;

    return (
        <Typography
            style={{ marginTop: '16px', marginBottom: '16px' }}
            variant={`h${level}`}>
            {props.children}
        </Typography>
    )
}

let Paragraph = (props) => {
    return (
        <Typography>
            {props.children}
        </Typography>
    )
}

let Credit = (props) => {
    let { theme } = props;
    return (
        <span
            style={{
                ...theme.typography.body1,
                color: theme.palette.secondary.main,
            }}>
            [Thanks {props.children}]
        </span>
    )
}

let renderers = {
    root: Root,
    heading: Heading,
    paragraph: Paragraph,
    inlineCode: withTheme()(Credit),
    listItem: withTheme()(MDListItem),
    strong: withTheme()(Strong),
}

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
                    <ReactMarkdown
                        source={this.getContent()}
                        renderers={renderers} />
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