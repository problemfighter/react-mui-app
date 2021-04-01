import {createStyles, Theme} from "react-mui-ui/ui/ui-component";

const privateLayoutJSS = (theme: Theme) => createStyles({
    '@global': {
        '.MuiTableCell-head': {
            color: '#000000',
            height: 20
        },
        '.MuiTableHead-root': {
            backgroundColor: '#DCDCDC',
            height: 20
        },
        '.MuiTableCell-body': {
            backgroundColor: 'white',
            height: 20
        },
    },
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: '100vh',
        overflow: 'auto',
    },
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320,
    }
});

const viewCommon = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    mainActionArea : {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
        marginBottom: "15px"
    },

    againMainActionArea : {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px",
        marginBottom: "10px"
    },

    draggableExpansionPanelSpace : {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px"
    },

    marginToLeft : {
        marginLeft: theme.spacing(1),
    },
    displayInline : {
        display: "inline",
    },

    inLineFormContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    inLineFormInput: {
        margin: theme.spacing(1),
    },
});

export {
    privateLayoutJSS,
    viewCommon
};