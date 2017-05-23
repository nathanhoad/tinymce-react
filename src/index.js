const React = require('react');
const uuid = require('uuid/v4');


class TinyMCE extends React.Component {
    constructor (props) {
        super(props);
        
        this.initialiseEditor = this.initialiseEditor.bind(this);
        this.removeEditor = this.removeEditor.bind(this);
        
        if (typeof document !== "undefined" && typeof document.createElement === "function") {  
            this.script = document.createElement('script');
            this.script.type = "application/javascript";
            this.script.addEventListener('load', this.initialiseEditor);
        }
        
        this.state = {
            editor: null
        };
    }
    
    
    componentDidMount () {
        if (typeof window === "undefined" || typeof document === "undefined") return;
        if (window.tinymce) return;
        if (this.has_loaded_script) return;
        
        let script_url = `https://cloud.tinymce.com/stable/tinymce.min.js${this.props.apiKey ? `?apiKey=${this.props.apiKey}` : ''}`;
        this.script.src = script_url;
        document.head.appendChild(this.script);
        
        this.has_loaded_script = true;
    }
    
    
    componentWillUnmount () {
        if (typeof this.script !== "undefined") {
            this.script.removeEventListener('load', this.initialiseEditor);
        }
    }
    
    
    initialiseEditor () {
        if (this.state.editor) {
            this.removeEditor();
        }
        
        const component = this;
        
        let config = this.props.config;
        config.selector = `#${component.props.id}`;
        config.setup = (editor) => {
            component.setState({ editor });
            
            editor.on('init', () => {
                editor.setContent(component.props.content);
            });
            
            editor.on('keyup change', () => {
                const content = editor.getContent();
                component.props.onContentChanged(content);
            });
        };
        
        window.tinymce.init(config);
    }
    
    
    removeEditor () {
        window.tinymce.remove(this.state.editor);
        this.setState({
            editor: null
        });
    }
    
    
    render () {
        const { id } = this.props;
        
        return (
            <textarea id={id} style={{ visibility: 'hidden' }} defaultValue={this.props.content} />
        )
    }
}


TinyMCE.defaultProps = {
    id: uuid(),
    content: '',
    config: { height: 500 },
    onContentChanged: () => {}
};


module.exports = TinyMCE;
