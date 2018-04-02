import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { stateToHTML } from 'draft-js-export-html';

const onEditorStateChange = (editorState) => {
    //console.log(editorState.toJS().currentContent.blockMap)
}
const renderField = ({ input, label, type, meta: { touched, error, invalid, warning } }) => (
    <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
        <label  className="control-label">{label}</label>
        <div>
            <Editor
                editorState={EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(input && input.value)))}
                onEditorStateChange={onEditorStateChange}
            />
            <div className="help-block">
                {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
        </div>
    </div>
)
//<textarea {...input} className="form-control md-textarea"  placeholder={label} type={type}/>
//export default renderField;

class renderEditorTextArea extends React.Component {

    constructor(props) {
        super(props);
        this.handleEditorStateChange = this.handleEditorStateChange.bind(this);
        const { input } = this.props

        if(input && input.value){
            this.state = {
                editorState : EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(input && input.value)))
            }
        }else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }
    componentDidUpdate(){
        let curText = convertToRaw(this.state.editorState.getCurrentContent()).blocks
        const { input } = this.props
        if(input && input.value && input.value != '<p><br></p>') {
            if(!curText[0] ||( curText.length < 2 && curText[0].text == '' )){
               this.setState({ editorState : EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(input && input.value))) });
            }
        }
    }

    convertToString(editorState) {
        return stateToHTML(editorState.getCurrentContent())
    }

    handleEditorStateChange(editorState) {
        const { onChange } = this.props.input;
        const stringValue = this.convertToString(editorState);
        this.setState({ editorState });
        onChange(stringValue);
    }

    render() {
        const { label } = this.props
        return (
            <div>
                <label  className="control-label">{label}</label>
                <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.handleEditorStateChange} />
                <hr/>
            </div>
        );
    }
}

export default renderEditorTextArea;