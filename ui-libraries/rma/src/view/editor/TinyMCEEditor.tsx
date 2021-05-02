import TRComponent from "tm-react/src/artifacts/component/tr-component";
import {TRProps} from "tm-react/src/artifacts/model/tr-model";
import TRComponentState from "tm-react/src/artifacts/component/tr-component-state";
import {Box, Typography} from "react-mui-ui/ui/ui-component";
import React from "react";
import {Editor} from "@tinymce/tinymce-react";


interface Props extends TRProps {
    value?: any;
    label?: any;
    onChange?: any;
    onSave?: any;
    name?: any;
    apiKey: any;
    height?: number;
    enableMenubar?: boolean;
    disableToolbar?: boolean;
}


class State extends TRComponentState {}
export default class TinyMCEEditor extends TRComponent<Props, State> {

    state: State = new State();
    plugins: any = ['autoresize', 'print', 'media', 'emoticons', 'autolink', 'anchor', 'preview', 'image imagetools' , 'advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'table', 'textcolor', 'insertdatetime media table paste code help wordcount']
    toolbarActions: string = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | emoticons | table | image media | | forecolor backcolor removeformat | anchor | preview | print'

    static defaultProps = {
        enableMenubar: false,
        height: 400,
        initialValue: "",
        label: "",
    };

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {}

    onChange(content: any) {
        let data = {
            target: {
                value: content,
                name: this.props.name,
            }
        }
        if (this.props.onChange) {
            this.props.onChange(data)
        }
    }

    onSaveAction(event: any) {
        if (event.which === 83 && event.ctrlKey && this.props.onSave) {
            this.props.onSave()
            return false
        }
        console.log("Pressss ")
    }


    renderUI() {
        let _this = this;
        const {height, enableMenubar, disableToolbar, apiKey, value, label} = this.props
        let toolbar = disableToolbar ? false : this.toolbarActions
        return (
            <React.Fragment>
                <Box mb={1}>
                    <Typography>{label}</Typography>
                </Box>
                <Editor
                    onKeyDown={ (event: any) => { return _this.onSaveAction(event)}}
                    onKeyPress={ (event: any) => { return _this.onSaveAction(event)}}
                    toolbar={toolbar}
                    value={value}
                    apiKey={apiKey}
                    onEditorChange={(content: any) => {
                        _this.onChange(content)
                    }}
                    init={
                        {
                            height: height, menubar: enableMenubar, toolbar: toolbar, plugins: _this.plugins,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }
                    }
                />
            </React.Fragment>
        )
    }

}