# TinyMCE React

A simple TinyMCE React component.

`yarn add tinymce-react`


## Usage

Note: When the component mounts it will load in the cloud version of TinyMCE (if it hasn't already been loaded) with 
the given `apiKey`.

```javascript
const React = require('react');
const TinyMCE = require('tinymce-react');


module.exports = (props) => {
    return (
        <TinyMCE 
            apiKey={YOUR_TINYMCE_API_KEY} 
            config={{
                height: 500,
                plugins: 'image table'
            }}
            content={`<p>This is some HTML</p>`} 
            onContentChanged={content => console.log(content)} 
        />
    )
}
```

Have a look at the [TinyMCE documentation](https://www.tinymce.com/docs/configure) for all `config` options.
