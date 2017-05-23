const React = require('react');
const uuid = require('uuid/v4');


class TinyMCE extends React.Component {
    constructor (props) {
        super(props);
        
        this.initialiseEditor = this.initialiseEditor.bind(this);
        this.removeEditor = this.removeEditor.bind(this);
        
        this.id = props.id || uuid();
        
        this.state = {
            editor: null
        };
    }
    
    
    componentDidMount () {
        if (typeof window === "undefined" || typeof document === "undefined") return;
        
        if (window.tinymce || window._has_requested_tinymce) {
            this.initialiseEditor();
            return;
        }
        
        this.script = document.createElement('script');
        this.script.type = "application/javascript";
        this.script.addEventListener('load', this.initialiseEditor);
        this.script.src = `https://cloud.tinymce.com/stable/tinymce.min.js${this.props.apiKey ? `?apiKey=${this.props.apiKey}` : ''}`;
        document.head.appendChild(this.script);
        
        window._has_requested_tinymce = true;
    }
    
    
    componentWillUnmount () {
        if (typeof this.script !== "undefined") {
            this.script.removeEventListener('load', this.initialiseEditor);
        }
        
        if (this.state.editor) {
            this.removeEditor();
        }
    }
    
    
    componentWillReceiveProps (next_props) {
        if (!this.state.editor) {
            this.initialiseEditor();
        } else if (this.props.content !== next_props.content) {
            this.state.editor.setContent(next_props.content);
        }
    }
    
    
    shouldComponentUpdate () {
        return false;
    }
    
    
    initialiseEditor () {
        if (typeof window === "undefined") return;
        
        if (window._has_requested_tinymce && !window.tinymce && !this.state.editor) {
            // Multiple editors on the page, one of the other ones has already requested the tinymce script
            setTimeout(() => {
                try {
                    this.initialiseEditor();
                } catch (e) {}
            }, 500);
            return;
        }
        
        if (this.state.editor) {
            this.removeEditor();
        }
        
        const component = this;
        
        let config = this.props.config;
        config.selector = `#${component.id}`;
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
        const { content, config, className } = this.props;
        
        if (config.inline) {
            return (
                <div id={this.id} className={className} dangerouslySetInnerHTML={{ __html: content }} />
            );
        } else {
            return (
                <textarea id={this.id} style={{ visibility: 'hidden' }} defaultValue={content} />
            );
        }
    }
}


TinyMCE.defaultProps = {
    id: undefined,
    content: '',
    config: { height: 300 },
    onContentChanged: () => {}
};


module.exports = TinyMCE;
