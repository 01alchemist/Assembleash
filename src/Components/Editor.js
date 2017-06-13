import React, { Component } from "react"
import PropTypes from 'prop-types'

import AceEditor from 'react-ace'
//import brace from 'brace'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'

import 'brace/mode/typescript'
import 'brace/snippets/typescript'
import 'brace/theme/tomorrow_night_eighties'

import '../ace.editor.css'

export default class Editor extends Component {
    static propTypes = {
        focus:       PropTypes.bool,
        readOnly:    PropTypes.bool,
        width:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        code:        PropTypes.string,
        annotations: PropTypes.array,
        onChange:    PropTypes.func
    }

    static defaultProps = {
        focus:       false,
        readOnly:    false,
        width:       '100%',
        height:      '750px',
        code:        '',
        annotations: null,
        onChange:    () => {}
    }

    constructor(props) {
        super(props);
        this.state = {
            value: props.code
        };
    }

    onLoad = editor => {
        this.editor = editor;
        const session = editor.getSession();

        session.setUseSoftTabs(true);
        session.setOptions({ useWorker: true });
        editor.renderer.setScrollMargin(14, 14);

        // TODO need fix setTimeout and use more clerver way
        setTimeout(() => {
            editor.scrollToLine(Infinity, false, false, () => {});
            editor.gotoLine(Infinity, 0, false);
        }, 300);
    }

    onChange = newValue => {
        this.setState({ value: newValue });
        this.props.onChange(newValue);
    }

    onSelectionChange = (newValue, event) => {
        //console.log('select-change', newValue);
        //console.log('select-change-event', event);
    }

    render() {
        const { value } = this.state;
        const { width, height, focus, readOnly, code, annotations } = this.props;

        let text    = !readOnly ? value : code;
        let tabSize = !readOnly ? 4 : 1;

        return (
            <AceEditor
                name="editor"

                focus={ focus }
                readOnly={ readOnly }

                // annotations={ [
                //     { row: 0, type: 'error', text: 'some error' }
                // ] }

                annotations={ annotations }

                showGutter
                showLineNumbers
                showPrintMargin={ false }
                highlightActiveLine={ false }

                enableBasicAutocompletion={ !readOnly }
                enableLiveAutocompletion={ !readOnly }
                enableSnippets={ !readOnly }
                cursorStart={ 1 }

                value={ text }

                mode="typescript"
                theme="tomorrow_night_eighties"
                fontSize={ 14 }
                width={ width }
                height={ height }

                tabSize={ tabSize }

                editorProps={{
                    $blockScrolling: Infinity
                }}

                setOptions={{
                    cursorStyle: 'slim',
                    autoScrollEditorIntoView: false,
                    showFoldWidgets: false,
                    animatedScroll: true,
                    displayIndentGuides: readOnly
		        }}

                onLoad={ this.onLoad }
                onChange={ this.onChange }
                onSelectionChange={ this.onSelectionChange }
            />
        );
    }
}
