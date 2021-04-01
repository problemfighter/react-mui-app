import React from 'react';
import TRReactComponent from "tm-react/src/artifacts/framework/tr-react-component";
import {DesignProps, TRTableActionData} from "react-mui-ui/ui/tr-ui-data";
import TRDropdown, {DropdownStyle} from "react-mui-ui/ui/tr-dropdown";
import {TRProps, TRState} from "tm-react/src/artifacts/model/tr-model";
import TRTableAction, {TableActionStyle} from "react-mui-ui/ui/tr-table-action";
import {Theme, withStyles} from "react-mui-ui/ui/ui-component";

export const TableJss: any = (theme: Theme) => ({
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
    button: {
        padding: 0,
        minWidth: 16,
        color: '#929292',
        '& svg': {
            height: 20,
            width: 20,
        }
    },
    menuList: {
        paddingTop: 0,
        paddingBottom: 0
    },
    menuItem: {
        minHeight: 35,
        color: theme.palette.text.primary,
        fontSize: 14,
        padding: '8px 10px',
        cursor: 'pointer',
        transition: 'background-color 0.05s ease',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '& svg':{
                color: theme.palette.common.white,
            }
        }
    }
});


class TRTableActionState implements TRState {}

interface TRTableActionProps extends TRProps {
    actions: Map<string, TRTableActionData>;
    dropdownStyle?: DropdownStyle
    tableActionStyle?: TableActionStyle,
    readonly [x: string]: any;
}

class CaTableAction extends TRReactComponent<TRTableActionProps, TRTableActionState> {



    render() {
        const {classes} = this.props;
        const tableActionStyle: DropdownStyle = {actionButton: {
                classes: {root: classes.button}
            },
            menuList:{
                classes:{root:classes.menuList}
            },
            menuItem:{
                classes:{root: classes.menuItem}
            }};


        return (<React.Fragment>
            <TRTableAction actions={this.props.actions} dropdownStyle={tableActionStyle} tableActionStyle={this.props.tableActionStyle} />
        </React.Fragment>);
    }

}

export default withStyles(TableJss)(CaTableAction);