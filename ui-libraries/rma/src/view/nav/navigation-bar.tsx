import React from 'react';
import TRReactComponent from "tm-react/src/artifacts/framework/tr-react-component";
import {
    AppBar, ChevronLeftIcon,
    clsx,
    CssBaseline, Divider,
    Drawer,
    IconButton,
    MenuIcon,
    Toolbar,
    Typography,
    withStyles
} from "react-mui-ui/ui/ui-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import {TRListData} from "react-mui-ui/ui/tr-ui-data";
import ProfileDropdown from "../common/profile-dropdown";
import TRVerticalNestedList  from 'react-mui-ui/ui/tr-vertical-nested-list';
import {navigationBarJSS} from "./navigation-bar-jss";

export interface Props extends TRProps {
    classes: any
    appTitle?: string
    navTitle?: string
    bodyContent: any
    route: any
    appConfig: any
    itemList: Array<TRListData>;
}


class NavigationBar extends TRReactComponent<Props, any> {

    static defaultProps = {
        appTitle: "Application Title",
        navTitle: "Navigation",
        itemList: [],
    };

    constructor(props: Props){
        super(props);
        this.state = {
            open: true
        }
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            {this.props.appTitle}
                        </Typography>
                        <ProfileDropdown route={this.props.route} appConfig={this.props.appConfig}/>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}>
                    <div className={classes.toolbarIcon}>
                        <Typography variant="h6" align="inherit">
                            {this.props.navTitle}
                        </Typography>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <TRVerticalNestedList itemList={this.props.itemList}/>

                </Drawer>
                <main className={classes.content}>
                    <div className={classes.tableAction} />
                    {this.props.bodyContent}
                </main>
            </div>
        );
    }

}

export default withStyles(navigationBarJSS)(NavigationBar);