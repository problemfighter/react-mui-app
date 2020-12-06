import {createStyles, Theme} from "react-mui-ui/ui/ui-component";

export const LoginLayoutJss = (theme: Theme) => createStyles({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing( 3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },

    marginBottomForPopup: {
        marginBottom: theme.spacing(8),
    },

    paper: {
        marginTop: theme.spacing(16),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },

    submit: {
        marginTop: theme.spacing(1),
    },

    form: {
        marginTop: theme.spacing(1),
    },
});