import {
    red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen,
    lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey
} from '@material-ui/core/colors';

const numbers = [
    50,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    'A100',
    'A200',
    'A400',
    'A700',
]

const black = {
    50: '#f5f5f5',
    100: '#e9e9e9',
    200: '#d9d9d9',
    300: '#c4c4c4',
    400: '#9d9d9d',
    500: '#7b7b7b',
    600: '#555555',
    700: '#424242',
    800: '#232323',
    900: '#000000',
    A100: '#d5d5d5',
    A200: '#aaaaaa',
    A400: '#303030',
    A700: '#616161'
};

var darkGrey = {
    50: '#eeeeee',
    100: '#dddddd',
    200: '#cccccc',
    300: '#bbbbbb',
    400: '#aaaaaa',
    500: '#555555',
    600: '#474747',
    700: '#313131',
    800: '#212121',
    900: '#111111',
    A100: '#d5d5d5',
    A200: '#aaaaaa',
    A400: '#303030',
    A700: '#616161'
};

const MuiColorMap = {
    red: { id: 'red', color: red },
    pink: { id: 'pink', color: pink },
    purple: { id: 'purple', color: purple },
    deepPurple: { id: 'deepPurple', color: deepPurple },
    indigo: { id: 'indigo', color: indigo },
    blue: { id: 'blue', color: blue },
    lightBlue: { id: 'lightBlue', color: lightBlue },
    cyan: { id: 'cyan', color: cyan },
    teal: { id: 'teal', color: teal },
    green: { id: 'green', color: green },
    lightGreen: { id: 'lightGreen', color: lightGreen },
    lime: { id: 'lime', color: lime },
    yellow: { id: 'yellow', color: yellow },
    amber: { id: 'amber', color: amber },
    orange: { id: 'orange', color: orange },
    deepOrange: { id: 'deepOrange', color: deepOrange },
    brown: { id: 'brown', color: brown },
    grey: { id: 'grey', color: grey },
    darkGrey: { id: 'darkGrey', color: darkGrey },
    blueGrey: { id: 'blueGrey', color: blueGrey },
    black: { id: 'black', color: black },
}

export const GetNumberFromIndex = (index) => {
    return numbers[index];
}

export const GetColor = (id, shadeIndex) => {
    return MuiColorMap[id].color[GetNumberFromIndex(shadeIndex)];
}



export const GetMuiColorArray = () => {
    let array = [];
    for (let propertyName in MuiColorMap) {
        array.push(MuiColorMap[propertyName])
    }

    return array;
}