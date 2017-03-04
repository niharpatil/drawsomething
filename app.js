var template = require('./template.handlebars');
var html = template({page_title: 'nihar page'});

$('#body-el').append(html);

require('./client')
require('./draw')