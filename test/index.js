const React = require('react');
const { test } = require('ava');
const { shallow } = require('enzyme');

const TinyMCE = require('../src');


test('it renders', t => {
    let component = shallow(<TinyMCE content="<p>This is some content</p>" />);
    
    t.regex(component.html(), new RegExp("textarea"));
    t.regex(component.html(), new RegExp("&lt;p&gt;This is some content&lt;/p&gt;"));
});
