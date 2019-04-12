import React, { Component } from 'react';
import { ListItem, ListItemText, List, withTheme, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

let TableHead = (props) => {
    return null;
}

let TableCell = (props) => {

    let { theme } = props;

    return (
        <td style={{
            ...theme.typography.body1,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            padding: '16px'
        }}>
            {props.children}
        </td>
    )
}

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

let ExampleContainer = (props) => {
    let { theme } = props;

    let style = {
        ...theme.typography.body1,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: theme.palette.divider,
        width: 'fit-content',
        height: 'fit-content',
        padding: '8px',
        marginBottom: '8px',
    }
    return (
        <div
        style={style}>
            {props.value}
        </div>
    )
}

let renderers = {
    root: Root,
    heading: Heading,
    paragraph: Paragraph,
    inlineCode: withTheme()(Credit),
    listItem: withTheme()(MDListItem),
    strong: withTheme()(Strong),
    tableHead: TableHead,
    tableCell: withTheme()(TableCell),
    code: withTheme()(ExampleContainer),
}

const MarkdownViewer = (props) => {
    return (
        <ReactMarkdown
            source={props.source}
            renderers={renderers} />
    );
}

export default MarkdownViewer;