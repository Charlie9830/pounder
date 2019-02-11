import { createMuiTheme }  from '@material-ui/core/styles';
import { GetColor } from './MuiColors';


export function BuildMuiTheme(storedTheme) {
    let primaryColorId = storedTheme.palette.primaryColor.id;
    let primaryColorShadeIndex = storedTheme.palette.primaryColor.shadeIndex;

    let secondaryColorId = storedTheme.palette.secondaryColor.id;
    let secondaryColorShadeIndex = storedTheme.palette.secondaryColor.shadeIndex;

    return createMuiTheme({
        'palette': {
            'primary': {
                main: GetColor(primaryColorId, primaryColorShadeIndex),
            },
            'secondary': {
                main: GetColor(secondaryColorId, secondaryColorShadeIndex),
            },
            'background': getBackground(storedTheme.palette.backgroundColor, storedTheme.type),

            'type': storedTheme.type,
            'custom': {
                "today": mergeValues('#1455c0', storedTheme.palette.custom.today),
                "soon": mergeValues('#FF9300', storedTheme.palette.custom.soon),
                "overdue": mergeValues('#F00', storedTheme.palette.custom.overdue),
                "later": mergeValues('#22B30B', storedTheme.palette.custom.later),
                "unreadItem": mergeValues('#1455c0', storedTheme.palette.custom.unreadItem),
                "highPriority": mergeValues('#FF9300', storedTheme.palette.custom.highPriority)
            },
        },
        'hideTaskEditIcon': mergeValues(false, storedTheme.hideTaskEditIcon),
        'spacing': {
            'unit': getSpacingUnit(storedTheme.isDense),
        },
        'typography': {
            useNextVariants: true,
            fontSize: getFontSize(storedTheme.isDense)
        },
        'overrides': {
            'MuiIconButton': {
                root: {
                    'padding': getMuiIconButtonPadding(storedTheme.isDense)
                }
            }
        }
    })
}

function getFontSize(isDense) {
    return isDense ? 14 : 14;
}

function getSpacingUnit(isDense) {
    return isDense ? 6 : 8;
}

function getMuiIconButtonPadding(isDense) {
    return isDense ? '8px' : '12px';
}

function getBackground(backgroundColor, themeType) {
    let clonedColor = {...backgroundColor};
    let backgroundDummyTheme = createMuiTheme({
        palette: {
            'primary': {
                main: GetColor(clonedColor.id, clonedColor.shadeIndex),
            }
        },
        typography: {
            useNextVariants: true, // Silences Typography Variant deprecation warnings in Dev.
        }
    })

    if (themeType === 'dark') {
        return {
            default: backgroundDummyTheme.palette.primary.dark,
            paper: backgroundDummyTheme.palette.primary.main,
        }
    }

    else {
        return {
            default: backgroundDummyTheme.palette.primary.main,
            paper: backgroundDummyTheme.palette.primary.light,
        }
    }
    
}

function mergeValues(defaultValue, storedValue) {
    if (storedValue === undefined) {
        return defaultValue;
    }

    else {
        return storedValue;
    }
}