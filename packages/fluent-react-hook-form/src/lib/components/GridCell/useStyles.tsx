import { makeStyles, shorthands, tokens } from "@fluentui/react-components";



export const useInputStyles = makeStyles({
    cell: {
        minWidth: "30px",
        width: "100%", 
    },
    placeholderDiv: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        ...shorthands.padding("5px", "10px"),
        // boxShadow: tokens.shadow2,
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),

        ":hover": {
            backgroundColor: tokens.colorNeutralBackground2,
        }
        
    },
    placeholder: {
        color: tokens.colorNeutralForeground4,
        overflowX: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "400px",
    },
    truncatedText: {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "290px",
    },
    listbox: {
        maxHeight: "300px",
    },
    highlightError : {
        ...shorthands.border(tokens.strokeWidthThin, "solid", tokens.colorPaletteRedBackground3)
    }
});